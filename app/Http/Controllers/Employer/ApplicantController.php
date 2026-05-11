<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Mail\ApplicationStatusMail;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    public function index(JobListing $job)
    {
        if ($job->employer_id !== Auth::id()) {
            abort(403);
        }

        $applications = $job->applications()
            ->with('candidate')
            ->latest()
            ->paginate(15)
            ->through(fn($app) => [
                'id' => $app->id,
                'candidate_name' => $app->candidate->name,
                'candidate_email' => $app->candidate->email,
                'candidate_avatar' => $app->candidate->avatar,
                'candidate_bio' => $app->candidate->bio,
                'resume_path' => $app->resume_path,
                'cover_note' => $app->cover_note,
                'status' => $app->status,
                'created_at' => $app->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Employer/Applicants', [
            'job' => $job->only(['id', 'title', 'slug']),
            'applications' => $applications,
        ]);
    }

    public function updateStatus(Application $application)
    {
        $job = $application->jobListing;

        if ($job->employer_id !== Auth::id()) {
            abort(403);
        }

        $status = request('status');

        if (!in_array($status, ['accepted', 'rejected'])) {
            abort(400);
        }

        $application->update(['status' => $status]);

        Mail::to($application->candidate->email)->queue(new ApplicationStatusMail($application));

        return redirect()->route('employer.applicants.index', $job)->with('success', 'Application status updated.');
    }
}
