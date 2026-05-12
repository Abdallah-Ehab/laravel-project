<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApprovalController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['employer', 'category']);

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $jobs = $query->latest()->paginate(15)->withQueryString()->through(fn($job) => [
            'id' => $job->id,
            'slug' => $job->slug,
            'title' => $job->title,
            'company_name' => $job->company_name,
            'employer_name' => $job->employer?->name,
            'description' => $job->description,
            'requirements' => $job->requirements,
            'benefits' => $job->benefits,
            'salary_min' => $job->salary_min,
            'salary_max' => $job->salary_max,
            'location' => $job->location,
            'work_type' => $job->work_type,
            'status' => $job->status,
            'created_at' => $job->created_at->diffForHumans(),
            'category' => $job->category?->only(['id', 'name', 'slug']),
        ]);

        return Inertia::render('Admin/JobApprovals', [
            'jobs' => $jobs,
            'filter' => $request->status ?? 'pending',
        ]);
    }

    public function approve(JobListing $job)
    {
        $job->update(['status' => 'approved']);

        return back()->with('success', 'Job approved successfully.');
    }

    public function reject(Request $request, JobListing $job)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $job->update(['status' => 'rejected']);

        return back()->with('success', 'Job rejected.');
    }
}
