<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $recentJobs = JobListing::approved()
            ->with(['employer', 'category'])
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Welcome', [
            'recentJobs' => $recentJobs->map(fn($job) => [
                'id' => $job->id,
                'slug' => $job->slug,
                'title' => $job->title,
                'company_name' => $job->company_name,
                'location' => $job->location,
                'work_type' => $job->work_type,
                'experience_level' => $job->experience_level,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'created_at' => $job->created_at->diffForHumans(),
                'category' => $job->category?->only(['id', 'name', 'slug']),
            ]),
        ]);
    }
}
