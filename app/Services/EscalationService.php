<?php

namespace App\Services;

use App\Models\Issue;
use Carbon\Carbon;

class EscalationService
{
    /**
     * Determine whether an issue should be escalated and why.
     *
     * Rules:
     *   1. Any critical issue is always escalated.
     *   2. High-priority issues open for more than 4 hours are escalated.
     *   3. Any issue past its due_at date is escalated.
     *   4. Any medium issue open for more than 48 hours is escalated.
     *
     * @return array{escalated: bool, reason: string|null}
     */
    public function evaluate(Issue $issue): array
    {
        $age = Carbon::parse($issue->created_at)->diffInHours(now());

        if ($issue->priority === 'critical') {
            return $this->flag('Critical priority — requires immediate attention.');
        }

        if ($issue->due_at && now()->isAfter($issue->due_at)) {
            return $this->flag('Past the agreed resolution deadline.');
        }

        if ($issue->priority === 'high' && $issue->status === 'open' && $age >= 4) {
            return $this->flag("High-priority issue has been open for {$age} hours without resolution.");
        }

        if ($issue->priority === 'medium' && $issue->status === 'open' && $age >= 48) {
            return $this->flag("Medium-priority issue has been open for {$age} hours.");
        }

        return ['escalated' => false, 'reason' => null];
    }

    private function flag(string $reason): array
    {
        return ['escalated' => true, 'reason' => $reason];
    }
}
