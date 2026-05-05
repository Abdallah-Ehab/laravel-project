<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Category;
use App\Models\JobListing;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::where('role', '!=', 'admin')->count();
        $totalEmployers = User::where('role', 'employer')->count();
        $totalCandidates = User::where('role', 'candidate')->count();
        $totalJobs = JobListing::count();
        $approvedJobs = JobListing::where('status', 'approved')->count();
        $pendingJobs = JobListing::where('status', 'pending')->count();
        $totalApplications = Application::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_employers' => $totalEmployers,
                'total_candidates' => $totalCandidates,
                'total_jobs' => $totalJobs,
                'approved_jobs' => $approvedJobs,
                'pending_jobs' => $pendingJobs,
                'total_applications' => $totalApplications,
            ],
        ]);
    }
}
