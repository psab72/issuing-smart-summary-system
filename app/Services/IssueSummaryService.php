<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IssueSummaryService
{
    private string $apiKey;
    private string $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', '');
    }

    /**
     * Generate a short summary and suggested next action for an issue.
     * Falls back to a rules-based approach if the API is unavailable.
     *
     * @return array{summary: string, suggested_action: string}
     */
    public function generate(string $title, string $description, string $priority, string $category): array
    {
        if ($this->apiKey) {
            try {
                return $this->generateViaAI($title, $description, $priority, $category);
            } catch (\Throwable $e) {
                Log::warning('AI summary failed, falling back to rules-based.', ['error' => $e->getMessage()]);
            }
        }

        return $this->generateViaRules($title, $description, $priority, $category);
    }

    // ── AI Path ─────────────────────────────────────────────────────────────

    private function generateViaAI(string $title, string $description, string $priority, string $category): array
    {
        $prompt = <<<PROMPT
    You are a support operations assistant. Given the issue below, return a JSON object with exactly two keys:
    - "summary": a single sentence (max 30 words) capturing what the issue is about
    - "suggested_action": a single concrete next step the team should take (max 25 words)

    Issue:
    Title: {$title}
    Category: {$category}
    Priority: {$priority}
    Description: {$description}

    Respond ONLY with raw JSON. No markdown, no explanation.
    PROMPT;

        $response = Http::post("{$this->endpoint}?key={$this->apiKey}", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
        ])->throw()->json();

        $text   = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $text   = preg_replace('/```json|```/', '', $text);
        $parsed = json_decode(trim($text), true);

        if (!is_array($parsed) || empty($parsed['summary']) || empty($parsed['suggested_action'])) {
            throw new \RuntimeException('Unexpected Gemini response shape.');
        }

        return [
            'summary'          => trim($parsed['summary']),
            'suggested_action' => trim($parsed['suggested_action']),
        ];
    }

    // ── Rules-Based Fallback ─────────────────────────────────────────────────

    private function generateViaRules(string $title, string $description, string $priority, string $category): array
    {
        $summary = $this->buildSummary($title, $category, $priority);
        $action  = $this->buildAction($priority, $category);

        return [
            'summary'          => $summary,
            'suggested_action' => $action,
        ];
    }

    private function buildSummary(string $title, string $category, string $priority): string
    {
        $categoryLabel = ucfirst($category);
        $priorityLabel = ucfirst($priority);
        return "{$priorityLabel}-priority {$categoryLabel} issue reported: {$title}.";
    }

    private function buildAction(string $priority, string $category): string
    {
        // Priority-first overrides
        if ($priority === 'critical') {
            return 'Page on-call engineer immediately and open a war-room channel.';
        }
        if ($priority === 'high') {
            return 'Assign to a senior engineer and begin triage within 1 hour.';
        }

        // Category-specific suggestions for medium/low
        return match ($category) {
            'bug'            => 'Reproduce the issue locally, identify the root cause, and schedule a fix.',
            'security'       => 'Escalate to the security team and assess the blast radius before any other action.',
            'infrastructure' => 'Check monitoring dashboards, review recent deploys, and restore service first.',
            'performance'    => 'Profile the affected service and identify the bottleneck before optimising.',
            'feature'        => 'Add to the product backlog and schedule for the next planning session.',
            default          => 'Review the issue details, assign an owner, and set a target resolution date.',
        };
    }
}
