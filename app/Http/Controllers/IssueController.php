<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIssueRequest;
use App\Http\Requests\UpdateIssueRequest;
use App\Http\Resources\IssueResource;
use App\Models\Issue;
use App\Services\EscalationService;
use App\Services\IssueSummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IssueController extends Controller
{
    public function __construct(
        private readonly IssueSummaryService $summaryService,
        private readonly EscalationService   $escalationService,
    ) {}

    // ── GET /api/issues ──────────────────────────────────────────────────────

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Issue::query()
            ->filterByStatus($request->query('status'))
            ->filterByPriority($request->query('priority'))
            ->filterByCategory($request->query('category'));

        if ($request->boolean('escalated')) {
            $query->escalated();
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $issues = $query
            ->orderByRaw("FIELD(priority, 'critical','high','medium','low')")
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 20));

        return IssueResource::collection($issues);
    }

    // ── POST /api/issues ─────────────────────────────────────────────────────

    public function store(StoreIssueRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Generate AI summary + suggested action
        ['summary' => $summary, 'suggested_action' => $action] = $this->summaryService->generate(
            $data['title'],
            $data['description'],
            $data['priority'],
            $data['category'],
        );

        $issue = Issue::create(array_merge($data, [
            'status'           => $data['status'] ?? 'open',
            'ai_summary'       => $summary,
            'suggested_action' => $action,
        ]));

        // Evaluate escalation immediately after creation
        $escalation = $this->escalationService->evaluate($issue);
        $issue->update([
            'escalated'         => $escalation['escalated'],
            'escalation_reason' => $escalation['reason'],
        ]);

        return (new IssueResource($issue))
            ->response()
            ->setStatusCode(201);
    }

    // ── GET /api/issues/{id} ─────────────────────────────────────────────────

    public function show(Issue $issue): IssueResource
    {
        return new IssueResource($issue);
    }

    // ── PATCH /api/issues/{id} ────────────────────────────────────────────────

    public function update(UpdateIssueRequest $request, Issue $issue): IssueResource
    {
        $data = $request->validated();

        // Re-generate summary if content fields changed
        if (isset($data['title']) || isset($data['description']) || isset($data['priority']) || isset($data['category'])) {
            ['summary' => $summary, 'suggested_action' => $action] = $this->summaryService->generate(
                $data['title']       ?? $issue->title,
                $data['description'] ?? $issue->description,
                $data['priority']    ?? $issue->priority,
                $data['category']    ?? $issue->category,
            );
            $data['ai_summary']       = $summary;
            $data['suggested_action'] = $action;
        }

        $issue->update($data);

        // Re-evaluate escalation after any update
        $escalation = $this->escalationService->evaluate($issue->fresh());
        $issue->update([
            'escalated'         => $escalation['escalated'],
            'escalation_reason' => $escalation['reason'],
        ]);

        return new IssueResource($issue->fresh());
    }

    // ── DELETE /api/issues/{id} ───────────────────────────────────────────────

    public function destroy(Issue $issue): JsonResponse
    {
        $issue->delete();
        return response()->json(['message' => 'Issue deleted.']);
    }

    // ── POST /api/issues/{id}/regenerate-summary ─────────────────────────────

    public function regenerateSummary(Issue $issue): IssueResource
    {
        ['summary' => $summary, 'suggested_action' => $action] = $this->summaryService->generate(
            $issue->title,
            $issue->description,
            $issue->priority,
            $issue->category,
        );

        $issue->update([
            'ai_summary'       => $summary,
            'suggested_action' => $action,
        ]);

        return new IssueResource($issue->fresh());
    }

    // ── GET /api/issues/stats ─────────────────────────────────────────────────

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'      => Issue::count(),
            'open'       => Issue::where('status', 'open')->count(),
            'escalated'  => Issue::where('escalated', true)->count(),
            'by_priority' => Issue::selectRaw('priority, count(*) as count')
                ->groupBy('priority')->pluck('count', 'priority'),
            'by_category' => Issue::selectRaw('category, count(*) as count')
                ->groupBy('category')->pluck('count', 'category'),
            'by_status'   => Issue::selectRaw('status, count(*) as count')
                ->groupBy('status')->pluck('count', 'status'),
        ]);
    }
}
