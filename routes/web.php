<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Employer\DashboardController as EmployerDashboardController;
use App\Http\Controllers\Employer\JobController as EmployerJobController;
use App\Http\Controllers\Employer\ApplicantController as EmployerApplicantController;
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboardController;
use App\Http\Controllers\Candidate\ApplicationController as CandidateApplicationController;
use App\Http\Controllers\Candidate\ProfileController as CandidateProfileController;
use App\Http\Controllers\Candidate\SavedJobController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\JobApprovalController as AdminJobApprovalController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('/profile', [CandidateProfileController::class, 'index'])->name('profile');
    Route::get('/applications', [CandidateApplicationController::class, 'index'])->name('applications.index');
    Route::get('/jobs/{job:slug}/apply', [CandidateApplicationController::class, 'create'])->name('apply.create');
    Route::post('/jobs/{job:slug}/apply', [CandidateApplicationController::class, 'store'])->name('apply.store');
    Route::delete('/applications/{application}', [CandidateApplicationController::class, 'destroy'])->name('applications.destroy');
    Route::post('/jobs/{job:slug}/save', [SavedJobController::class, 'toggle'])->name('jobs.save');
    Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/approvals', [AdminJobApprovalController::class, 'index'])->name('approvals.index');
    Route::patch('/jobs/{job}/approve', [AdminJobApprovalController::class, 'approve'])->name('jobs.approve');
    Route::patch('/jobs/{job}/reject', [AdminJobApprovalController::class, 'reject'])->name('jobs.reject');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}/ban', [AdminUserController::class, 'ban'])->name('users.ban');
    Route::patch('/users/{user}/unban', [AdminUserController::class, 'unban'])->name('users.unban');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
