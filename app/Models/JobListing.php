<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'category_id',
        'title',
        'slug',
        'description',
        'requirements',
        'benefits',
        'salary_min',
        'salary_max',
        'location',
        'work_type',
        'experience_level',
        'deadline',
        'company_name',
        'company_logo',
        'status',
        'views',
    ];

    protected function casts(): array
    {
        return [
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'deadline' => 'date',
            'views' => 'integer',
        ];
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_jobs', 'job_listing_id', 'candidate_id')
            ->withTimestamps();
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }

    public function hasApplied(User $candidate): bool
    {
        return $this->applications()->where('candidate_id', $candidate->id)->exists();
    }

    public function isSavedBy(User $candidate): bool
    {
        return $this->savedByUsers()->where('candidate_id', $candidate->id)->exists();
    }
}
