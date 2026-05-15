<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\SavedJob;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Candidate/Profile/Index', [
            'applications_count' => Application::where('candidate_id', $user->id)->count(),
            'saved_jobs_count'   => SavedJob::where('candidate_id', $user->id)->count(),
        ]);
    }
}
