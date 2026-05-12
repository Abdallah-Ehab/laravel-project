<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Mail\JobApprovedMail;
use App\Mail\JobRejectedMail;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use Inertia\Inertia;

class JobApprovalController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['employer', 'category']);


        if ($request->status === 'all') {
            $query->latest();
        } else {
            $query->where('status', $request->status ?? 'pending')->latest();
        }

        $jobs = $query->paginate(15)->through(fn($job) => [
            'id' => $job->id,
            'title' => $job->title,
            'slug' => $job->slug,
            'company_name' => $job->company_name,
            'employer_name' => $job->employer->name,
            'employer_email' => $job->employer->email,
            'location' => $job->location,
            'status' => $job->status,
            'created_at' => $job->created_at->format('M d, Y'),
            'category' => $job->category?->only(['id', 'name']),

        ]);

        return Inertia::render('Admin/JobApprovals', [
            'jobs' => $jobs,
            'filter' => $request->status ?? 'pending',
        ]);
    }

    public function approve(JobListing $job)
    {
        $job->update(['status' => 'approved']);


        Mail::to($job->employer->email)->queue(new JobApprovedMail($job));

        return back()->with('success', 'Job listing approved.');
    }

    public function reject(JobListing $job, Request $request)
    {
        $job->update(['status' => 'rejected']);

        Mail::to($job->employer->email)->queue(new JobRejectedMail($job, $request->reason));

        return back()->with('success', 'Job listing rejected.');
    }
}
