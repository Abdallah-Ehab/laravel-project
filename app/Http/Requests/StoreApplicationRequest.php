<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resume' => 'required|file|mimes:pdf|max:5120',
            'cover_note' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'resume.mimes' => 'The resume must be a PDF file.',
            'resume.max' => 'The resume must not exceed 5MB.',
        ];
    }
}
