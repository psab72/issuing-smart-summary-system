<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Issue extends Model
{
    protected $fillable = [
        'title',
        'description',
        'priority',
        'category',
        'status',
        'reporter_name',
        'reporter_email',
        'ai_summary',
        'suggested_action',
        'escalated',
        'escalation_reason',
        'due_at',
    ];

    protected $casts = [
        'escalated' => 'boolean',
        'due_at'    => 'datetime',
    ];

    // ── Scopes ──────────────────────────────────────────────────────────────

    public function scopeFilterByStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    public function scopeFilterByPriority(Builder $query, ?string $priority): Builder
    {
        return $priority ? $query->where('priority', $priority) : $query;
    }

    public function scopeFilterByCategory(Builder $query, ?string $category): Builder
    {
        return $category ? $query->where('category', $category) : $query;
    }

    public function scopeEscalated(Builder $query): Builder
    {
        return $query->where('escalated', true);
    }

    // ── Computed helpers ────────────────────────────────────────────────────

    /**
     * Numeric weight for priority — used in ordering and escalation logic.
     */
    public static function priorityWeight(string $priority): int
    {
        return match ($priority) {
            'critical' => 4,
            'high'     => 3,
            'medium'   => 2,
            'low'      => 1,
            default    => 0,
        };
    }
}
