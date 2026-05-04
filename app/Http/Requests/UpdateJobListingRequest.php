<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateJobListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('job')->employer_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|min:50',
            'requirements' => 'required|string',
            'benefits' => 'nullable|string',
            'salary_min' => 'nullable|integer',
            'salary_max' => 'nullable|integer|gte:salary_min',
            'location' => 'required|string|max:255',
            'work_type' => 'required|in:remote,on-site,hybrid',
            'experience_level' => 'required|in:junior,mid,senior,any',
            'deadline' => 'nullable|date|after:today',
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }

    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated($key, $default);
        $validated['slug'] = Str::slug($validated['title']);

        return $validated;
    }
}
