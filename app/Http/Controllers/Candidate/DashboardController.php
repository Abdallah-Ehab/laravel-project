<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $candidate = Auth::user();

        $totalApplications = $candidate->applications()->count();
        $pendingApplications = $candidate->applications()->where('status', 'pending')->count();
        $acceptedApplications = $candidate->applications()->where('status', 'accepted')->count();
        $savedJobs = $candidate->savedJobs()->count();

        $recentApplications = $candidate->applications()
            ->with(['jobListing' => fn($q) => $q->with('category')])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($app) => [
                'id' => $app->id,
                'job_title' => $app->jobListing->title,
                'job_slug' => $app->jobListing->slug,
                'company_name' => $app->jobListing->company_name,
                'status' => $app->status,
                'created_at' => $app->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Candidate/Dashboard', [
            'stats' => [
                'total_applications' => $totalApplications,
                'pending_applications' => $pendingApplications,
                'accepted_applications' => $acceptedApplications,
                'saved_jobs' => $savedJobs,
            ],
            'recentApplications' => $recentApplications,
        ]);
    }
}
