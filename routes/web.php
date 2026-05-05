<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\JobListingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job:slug}', [JobListingController::class, 'show'])->name('jobs.show');

Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'employer') {
        return redirect()->route('employer.dashboard');
    }
    if ($user->role === 'candidate') {
        return redirect()->route('candidate.dashboard');
    }
    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::get('/dashboard', [EmployerDashboardController::class, 'index'])->name('dashboard');
    Route::resource('jobs', EmployerJobController::class)->except(['index', 'show']);
    Route::get('/jobs', [EmployerJobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/{job:slug}/applicants', [EmployerApplicantController::class, 'index'])->name('applicants.index');
    Route::patch('/applications/{application}/status', [EmployerApplicantController::class, 'updateStatus'])->name('applications.status');
});

Route::middleware(['auth', 'candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/dashboard', [CandidateDashboardController::class, 'index'])->name('dashboard');
    Route::get('/applications', [CandidateApplicationController::class, 'index'])->name('applications.index');
    Route::get('/jobs/{job:slug}/apply', [CandidateApplicationController::class, 'create'])->name('apply.create');
    Route::post('/jobs/{job:slug}/apply', [CandidateApplicationController::class, 'store'])->name('apply.store');
    Route::delete('/applications/{application}', [CandidateApplicationController::class, 'destroy'])->name('applications.destroy');
    Route::post('/jobs/{job:slug}/save', [SavedJobController::class, 'toggle'])->name('jobs.save');
    Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
});

