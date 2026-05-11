<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobListingController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::approved()->with(['employer', 'category']);

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('work_type')) {
            $query->where('work_type', $request->work_type);
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        if ($request->filled('salary_min')) {
            $query->where('salary_max', '>=', $request->salary_min);
        }

        if ($request->filled('date_posted')) {
            match ($request->date_posted) {
                'today' => $query->whereDate('created_at', now()),
                'this_week' => $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]),
                'this_month' => $query->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year),
                default => null,
            };
        }

        $jobs = $query->latest()->paginate(12)->withQueryString()->through(fn($job) => [
            'id' => $job->id,
            'slug' => $job->slug,
            'title' => $job->title,
            'company_name' => $job->company_name,
            'company_logo' => $job->company_logo ? asset('storage/' . $job->company_logo) : null,
            'location' => $job->location,
            'work_type' => $job->work_type,
            'experience_level' => $job->experience_level,
            'salary_min' => $job->salary_min,
            'salary_max' => $job->salary_max,
            'created_at' => $job->created_at->diffForHumans(),
            'category' => $job->category?->only(['id', 'name', 'slug']),
        ]);

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'categories' => Category::all(),
            'filters' => $request->only(['keyword', 'category', 'location', 'work_type', 'experience_level', 'salary_min', 'date_posted']),
        ]);
    }

    public function show(JobListing $job)
    {
        if ($job->status !== 'approved' && !auth()->user()?->isAdmin()) {
            abort(404);
        }

        $job->incrementViews();

        $relatedJobs = JobListing::approved()
            ->where('id', '!=', $job->id)
            ->where('category_id', $job->category_id)
            ->with(['category'])
            ->latest()
            ->take(3)
            ->get();

        $hasApplied = false;
        $isSaved = false;

        if (auth()->check() && auth()->user()->isCandidate()) {
            $hasApplied = $job->hasApplied(auth()->user());
            $isSaved = $job->isSavedBy(auth()->user());
        }

        return Inertia::render('Jobs/Show', [
            'job' => [
                'id' => $job->id,
                'slug' => $job->slug,
                'title' => $job->title,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'benefits' => $job->benefits,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'location' => $job->location,
                'work_type' => $job->work_type,
                'experience_level' => $job->experience_level,
                'deadline' => $job->deadline?->format('F j, Y'),
                'company_name' => $job->company_name,
                'company_logo' => $job->company_logo ? asset('storage/' . $job->company_logo) : null,
                'created_at' => $job->created_at->diffForHumans(),
                'views' => $job->views,
                'category' => $job->category?->only(['id', 'name', 'slug']),
            ],
            'hasApplied' => $hasApplied,
            'isSaved' => $isSaved,
            'relatedJobs' => $relatedJobs->map(fn($j) => [
                'id' => $j->id,
                'slug' => $j->slug,
                'title' => $j->title,
                'company_name' => $j->company_name,
                'location' => $j->location,
                'work_type' => $j->work_type,
                'created_at' => $j->created_at->diffForHumans(),
                'category' => $j->category?->only(['id', 'name', 'slug']),
            ]),
        ]);
    }
}
