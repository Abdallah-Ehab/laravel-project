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
