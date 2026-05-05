<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function index()
    {
        $savedJobs = Auth::user()->savedJobs()
            ->with(['category'])
            ->wherePivot('candidate_id', Auth::id())
            ->latest('saved_jobs.created_at')
            ->paginate(12);

        return Inertia::render('Candidate/SavedJobs', [
            'savedJobs' => fn() => $savedJobs->map(fn($job) => [
                'id' => $job->id,
                'slug' => $job->slug,
                'title' => $job->title,
                'company_name' => $job->company_name,
                'company_logo' => $job->company_logo ? asset('storage/' . $job->company_logo) : null,
                'location' => $job->location,
                'work_type' => $job->work_type,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'created_at' => $job->created_at->diffForHumans(),
                'category' => $job->category?->only(['id', 'name', 'slug']),
            ]),
        ]);
    }

    public function toggle(JobListing $job)
    {
        $user = Auth::user();

        if ($user->savedJobs()->where('job_listing_id', $job->id)->exists()) {
            $user->savedJobs()->detach($job->id);
            $saved = false;
        } else {
            $user->savedJobs()->attach($job->id);
            $saved = true;
        }

        return back()->with('success', $saved ? 'Job saved.' : 'Job removed from saved.');
    }
}
