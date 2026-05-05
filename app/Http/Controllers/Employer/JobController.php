<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobListingRequest;
use App\Http\Requests\UpdateJobListingRequest;
use App\Models\Category;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Auth::user()->postedJobs()
            ->withCount('applications')
            ->with('category')
            ->latest()
            ->paginate(10);

        return Inertia::render('Employer/Jobs/Index', [
            'jobs' => fn() => $jobs->map(fn($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'slug' => $job->slug,
                'status' => $job->status,
                'company_name' => $job->company_name,
                'location' => $job->location,
                'work_type' => $job->work_type,
                'applications_count' => $job->applications_count,
                'created_at' => $job->created_at->format('M d, Y'),
                'category' => $job->category?->only(['id', 'name']),
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Employer/Jobs/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(StoreJobListingRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            $data['company_logo'] = $request->file('company_logo')->store('logos', 'public');
        }

        Auth::user()->postedJobs()->create($data);

        return redirect()->route('employer.jobs.index')->with('success', 'Job listing created and pending approval.');
    }

    public function edit(JobListing $job)
    {
        if ($job->employer_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Employer/Jobs/Edit', [
            'job' => $job->only([
                'id', 'title', 'category_id', 'description', 'requirements',
                'benefits', 'salary_min', 'salary_max', 'location', 'work_type',
                'experience_level', 'deadline', 'company_name', 'company_logo',
            ]),
            'categories' => Category::all(),
        ]);
    }

    public function update(UpdateJobListingRequest $request, JobListing $job)
    {
        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            if ($job->company_logo) {
                Storage::disk('public')->delete($job->company_logo);
            }
            $data['company_logo'] = $request->file('company_logo')->store('logos', 'public');
        }

        $originalTitle = $job->title;
        $originalDescription = $job->description;

        $job->update($data);

        if ($originalTitle !== $job->title || $originalDescription !== $job->description) {
            $job->update(['status' => 'pending']);
        }

        return redirect()->route('employer.jobs.index')->with('success', 'Job listing updated successfully.');
    }

    public function destroy(JobListing $job)
    {
        if ($job->employer_id !== Auth::id()) {
            abort(403);
        }

        if ($job->company_logo) {
            Storage::disk('public')->delete($job->company_logo);
        }

        $job->delete();

        return redirect()->route('employer.jobs.index')->with('success', 'Job listing deleted.');
    }
}
