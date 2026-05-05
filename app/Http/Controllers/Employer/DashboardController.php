<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $employer = Auth::user();

        $totalJobs = $employer->postedJobs()->count();
        $activeJobs = $employer->postedJobs()->where('status', 'approved')->count();
        $pendingJobs = $employer->postedJobs()->where('status', 'pending')->count();
        $totalApplications = Application::whereIn('job_listing_id', $employer->postedJobs()->pluck('id'))->count();

        $recentJobs = $employer->postedJobs()
            ->withCount('applications')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'slug' => $job->slug,
                'status' => $job->status,
                'applications_count' => $job->applications_count,
                'created_at' => $job->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Employer/Dashboard', [
            'stats' => [
                'total_jobs' => $totalJobs,
                'active_jobs' => $activeJobs,
                'pending_jobs' => $pendingJobs,
                'total_applications' => $totalApplications,
            ],
            'recentJobs' => $recentJobs,
        ]);
    }
}
