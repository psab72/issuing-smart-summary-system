<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['sometimes', 'string', 'min:5', 'max:200'],
            'description'    => ['sometimes', 'string', 'min:10', 'max:5000'],
            'priority'       => ['sometimes', 'in:low,medium,high,critical'],
            'category'       => ['sometimes', 'in:bug,feature,infrastructure,security,performance,other'],
            'status'         => ['sometimes', 'in:open,in_progress,resolved,closed'],
            'reporter_name'  => ['nullable', 'string', 'max:100'],
            'reporter_email' => ['nullable', 'email', 'max:200'],
            'due_at'         => ['nullable', 'date'],
        ];
    }

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
