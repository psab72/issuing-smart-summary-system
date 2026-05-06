<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['required', 'string', 'min:5', 'max:200'],
            'description'    => ['required', 'string', 'min:10', 'max:5000'],
            'priority'       => ['required', 'in:low,medium,high,critical'],
            'category'       => ['required', 'in:bug,feature,infrastructure,security,performance,other'],
            'status'         => ['sometimes', 'in:open,in_progress,resolved,closed'],
            'reporter_name'  => ['nullable', 'string', 'max:100'],
            'reporter_email' => ['nullable', 'email', 'max:200'],
            'due_at'         => ['nullable', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.min'          => 'Title must be at least 5 characters.',
            'description.min'    => 'Description must be at least 10 characters — please provide enough detail.',
            'priority.in'        => 'Priority must be one of: low, medium, high, critical.',
            'category.in'        => 'Category must be one of: bug, feature, infrastructure, security, performance, other.',
            'status.in'          => 'Status must be one of: open, in_progress, resolved, closed.',
            'reporter_email.email' => 'Reporter email must be a valid email address.',
            'due_at.after'       => 'Due date must be in the future.',
        ];
    }

    /**
     * Return JSON error response instead of redirect on validation failure.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}
