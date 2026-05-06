<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'description'      => $this->description,
            'priority'         => $this->priority,
            'category'         => $this->category,
            'status'           => $this->status,
            'reporter_name'    => $this->reporter_name,
            'reporter_email'   => $this->reporter_email,
            'ai_summary'       => $this->ai_summary,
            'suggested_action' => $this->suggested_action,
            'escalated'        => $this->escalated,
            'escalation_reason'=> $this->escalation_reason,
            'due_at'           => $this->due_at?->toISOString(),
            'created_at'       => $this->created_at->toISOString(),
            'updated_at'       => $this->updated_at->toISOString(),
        ];
    }
}
