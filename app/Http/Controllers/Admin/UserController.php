<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'admin');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            match ($request->status) {
                'active' => $query->active(),
                'banned' => $query->banned(),
                default => null,
            };
        }

        $users = $query->latest()->paginate(15)->withQueryString()->through(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'banned_at' => $user->banned_at,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at->diffForHumans(),
            'applications_count' => $user->applications()->count(),
            'jobs_count' => $user->postedJobs()->count(),
        ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function show(User $user)
    {
        if ($user->isAdmin()) {
            abort(404);
        }

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'bio' => $user->bio,
            'banned_at' => $user->banned_at,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at->diffForHumans(),
        ];

        if ($user->isEmployer()) {
            $data['jobs'] = $user->postedJobs()
                ->withCount('applications')
                ->latest()
                ->take(20)
                ->get()
                ->map(fn($job) => [
                    'id' => $job->id,
                    'title' => $job->title,
                    'slug' => $job->slug,
                    'status' => $job->status,
                    'applications_count' => $job->applications_count,
                    'created_at' => $job->created_at->diffForHumans(),
                ]);
        }

        if ($user->isCandidate()) {
            $data['applications'] = $user->applications()
                ->with('jobListing')
                ->latest()
                ->take(20)
                ->get()
                ->map(fn($app) => [
                    'id' => $app->id,
                    'job_title' => $app->jobListing->title,
                    'job_slug' => $app->jobListing->slug,
                    'status' => $app->status,
                    'created_at' => $app->created_at->diffForHumans(),
                ]);
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $data,
        ]);
    }

    public function ban(User $user)
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Cannot ban an admin.');
        }

        $user->update(['banned_at' => now()]);

        return back()->with('success', "\"{$user->name}\" has been banned.");
    }

    public function unban(User $user)
    {
        $user->update(['banned_at' => null]);

        return back()->with('success', "\"{$user->name}\" has been unbanned.");
    }
}
