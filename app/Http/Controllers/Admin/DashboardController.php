<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Category;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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

        $now = now();
        $weekStart = $now->copy()->startOfWeek();
        $lastWeekStart = $weekStart->copy()->subWeek();

        $trends = [
            'users_this_week'  => User::where('created_at', '>=', $weekStart)->count(),
            'users_last_week'  => User::whereBetween('created_at', [$lastWeekStart, $weekStart])->count(),
            'jobs_this_week'   => JobListing::where('created_at', '>=', $weekStart)->count(),
            'jobs_last_week'   => JobListing::whereBetween('created_at', [$lastWeekStart, $weekStart])->count(),
            'apps_this_week'   => Application::where('created_at', '>=', $weekStart)->count(),
            'apps_last_week'   => Application::whereBetween('created_at', [$lastWeekStart, $weekStart])->count(),
        ];

        $recentUsers = User::where('role', '!=', 'admin')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($u) => [
                'type' => $u->role === 'employer' ? 'new_employer' : 'new_candidate',
                'description' => "{$u->name} registered as " . ucfirst($u->role),
                'time' => $u->created_at,
            ]);

        $recentJobs = JobListing::with('employer')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($j) => [
                'type' => 'new_job',
                'description' => "{$j->title} posted by {$j->employer->name}",
                'time' => $j->created_at,
            ]);

        $recentApps = Application::with(['candidate', 'jobListing'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'type' => 'new_application',
                'description' => "{$a->candidate->name} applied to {$a->jobListing->title}",
                'time' => $a->created_at,
            ]);

        $activity = collect($recentUsers)
            ->concat($recentJobs)
            ->concat($recentApps)
            ->sortByDesc('time')
            ->take(10)
            ->values()
            ->map(fn($a) => [
                ...$a,
                'time' => $a['time']->diffForHumans(),
            ]);

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
            'trends' => $trends,
            'activity' => $activity,
        ]);
    }
}
