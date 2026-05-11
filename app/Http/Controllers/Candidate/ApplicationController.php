<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index()
    {
        $applications = Auth::user()->applications()
            ->with(['jobListing' => fn($q) => $q->with('category')])
            ->latest()
            ->paginate(10)
            ->through(fn($app) => [
                'id' => $app->id,
                'job_title' => $app->jobListing->title,
                'job_slug' => $app->jobListing->slug,
                'company_name' => $app->jobListing->company_name,
                'company_logo' => $app->jobListing->company_logo ? asset('storage/' . $app->jobListing->company_logo) : null,
                'location' => $app->jobListing->location,
                'status' => $app->status,
                'cover_note' => $app->cover_note,
                'created_at' => $app->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Candidate/Applications', [
            'applications' => $applications,
        ]);
    }

    public function create(JobListing $job)
    {
        if ($job->status !== 'approved') {
            abort(404);
        }

        if ($job->hasApplied(Auth::user())) {
            return redirect()->route('jobs.show', $job)->with('error', 'You have already applied to this job.');
        }

        return Inertia::render('Candidate/Apply', [
            'job' => $job->only(['id', 'slug', 'title', 'company_name', 'location', 'work_type']),
        ]);
    }

    public function store(StoreApplicationRequest $request, JobListing $job)
    {
        if ($job->status !== 'approved') {
            abort(404);
        }

        if ($job->hasApplied(Auth::user())) {
            return redirect()->route('jobs.show', $job)->with('error', 'You have already applied to this job.');
        }

        $path = $request->file('resume')->store('resumes', 'public');

        Application::create([
            'job_listing_id' => $job->id,
            'candidate_id' => Auth::id(),
            'resume_path' => $path,
            'cover_note' => $request->cover_note,
        ]);

        return redirect()->route('candidate.applications.index')->with('success', 'Application submitted successfully.');
    }

    public function destroy(Application $application)
    {
        if ($application->candidate_id !== Auth::id()) {
            abort(403);
        }

        if (!$application->isPending()) {
            abort(403, 'Cannot delete an application that has been accepted or rejected.');
        }

        Storage::disk('public')->delete($application->resume_path);
        $application->delete();

        return redirect()->route('candidate.applications.index')->with('success', 'Application withdrawn.');
    }
}
