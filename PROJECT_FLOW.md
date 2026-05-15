# Laravel Job Board — Project Architecture & Flow

> A complete walkthrough of how the application works, with code references.

---

## 1. Application Entry Point

Every request enters through `routes/web.php`. The file defines three layers of routes:

```php
// routes/web.php
// PUBLIC ROUTES — accessible to everyone
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job:slug}', [JobListingController::class, 'show'])->name('jobs.show');
```

Then a smart `/dashboard` redirect sends users to the right place based on their role:

```php
// routes/web.php
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
```

Then protected routes wrapped in role middleware:

```php
// routes/web.php
Route::middleware(['auth', 'employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::get('/dashboard', [EmployerDashboardController::class, 'index'])->name('dashboard');
    Route::resource('jobs', EmployerJobController::class)->except(['index', 'show']);
    Route::get('/jobs', [EmployerJobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/{job:slug}/applicants', [EmployerApplicantController::class, 'index'])->name('applicants.index');
    Route::patch('/applications/{application}/status', [EmployerApplicantController::class, 'updateStatus'])->name('applications.status');
});

Route::middleware(['auth', 'candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/dashboard', [CandidateDashboardController::class, 'index'])->name('dashboard');
    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::get('/jobs/{job:slug}/apply', [ApplicationController::class, 'create'])->name('apply.create');
    Route::post('/jobs/{job:slug}/apply', [ApplicationController::class, 'store'])->name('apply.store');
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])->name('applications.destroy');
    Route::post('/jobs/{job:slug}/save', [SavedJobController::class, 'toggle'])->name('jobs.save');
    Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/approvals', [AdminJobApprovalController::class, 'index'])->name('approvals.index');
    Route::patch('/jobs/{job}/approve', [AdminJobApprovalController::class, 'approve'])->name('jobs.approve');
    Route::patch('/jobs/{job}/reject', [AdminJobApprovalController::class, 'reject'])->name('jobs.reject');
});
```

---

## 2. Registration Flow

**React Page:** `resources/js/Pages/Auth/Register.jsx`

The user picks their role during signup:

```jsx
// Register.jsx — role selector
<Select value={data.role} onValueChange={(v) => setData('role', v)}>
    <SelectTrigger><SelectValue /></SelectTrigger>
    <SelectContent>
        <SelectItem value="candidate">Job Seeker</SelectItem>
        <SelectItem value="employer">Employer</SelectItem>
    </SelectContent>
</Select>
```

The role is stored directly in the `users` table:

```php
// app/Models/User.php — fillable fields
protected $fillable = [
    'name', 'email', 'password', 'role', 'avatar', 'bio',
];
```

```php
// database/migrations/0001_01_01_000000_create_users_table.php
$table->enum('role', ['employer', 'candidate', 'admin'])->default('candidate');
```

---

## 3. The Middleware Protection Layer

Three middleware classes guard each role's routes:

```php
// app/Http/Middleware/EnsureEmployer.php
class EnsureEmployer {
    public function handle(Request $request, Closure $next): Response {
        if (!Auth::check() || Auth::user()->role !== 'employer') {
            abort(403, 'Unauthorized action.');
        }
        return $next($request);
    }
}
```

```php
// app/Http/Middleware/EnsureCandidate.php
class EnsureCandidate {
    public function handle(Request $request, Closure $next): Response {
        if (!Auth::check() || Auth::user()->role !== 'candidate') {
            abort(403, 'Unauthorized action.');
        }
        return $next($request);
    }
}
```

```php
// app/Http/Middleware/EnsureAdmin.php
class EnsureAdmin {
    public function handle(Request $request, Closure $next): Response {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        return $next($request);
    }
}
```

Registered in `bootstrap/app.php`:

```php
$middleware->alias([
    'employer' => \App\Http\Middleware\EnsureEmployer::class,
    'candidate' => \App\Http\Middleware\EnsureCandidate::class,
    'admin' => \App\Http\Middleware\EnsureAdmin::class,
]);
```

So when a candidate tries to visit `/employer/jobs/create`, the `EnsureEmployer` middleware intercepts and returns 403.

---

## 4. Shared Inertia Data

Every Inertia page receives shared data automatically:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array {
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'role' => $request->user()->role,
                'avatar' => $request->user()->avatar,
                'bio' => $request->user()->bio,
            ] : null,
        ],
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
        'ziggy' => [ ... ],
    ];
}
```

This means **any React component** can access the current user's role:

```jsx
import { usePage } from '@inertiajs/react';
const { auth } = usePage().props;
console.log(auth.user.role); // "employer", "candidate", or "admin"
```

---

## 5. The AppLayout — Unified UI Shell

`resources/js/Layouts/AppLayout.jsx` wraps every page. It builds the navigation dynamically based on role:

```jsx
const navLinks = {
    employer: [
        { label: 'Dashboard', href: route('employer.dashboard'), icon: Home },
        { label: 'My Jobs', href: route('employer.jobs.index'), icon: Briefcase },
    ],
    candidate: [
        { label: 'Dashboard', href: route('candidate.dashboard'), icon: Home },
        { label: 'My Applications', href: route('candidate.applications.index'), icon: Briefcase },
        { label: 'Saved Jobs', href: route('candidate.saved-jobs.index'), icon: Building2 },
    ],
    admin: [
        { label: 'Dashboard', href: route('admin.dashboard'), icon: Home },
        { label: 'Job Approvals', href: route('admin.approvals.index'), icon: ShieldCheck },
    ],
};

const links = auth?.user ? navLinks[auth.user.role] : [];
```

It also handles flash messages as toast notifications:

```jsx
useEffect(() => {
    if (flash?.success) toast({ description: flash.success });
    if (flash?.error) toast({ variant: 'destructive', description: flash.error });
}, []);
```

---

## 6. EMPLOYER FLOW

### Step A: Create a Job

Employer visits `/employer/jobs/create` → rendered by `resources/js/Pages/Employer/Jobs/Create.jsx`:

```jsx
const { data, setData, post, processing, errors } = useForm({
    title: '', category_id: '', description: '', requirements: '',
    salary_min: '', salary_max: '', location: '', work_type: '',
    experience_level: 'any', deadline: '', company_name: '', company_logo: null,
});
```

On submit, it POSTs to `EmployerJobController@store`:

```php
// app/Http/Controllers/Employer/JobController.php — store()
public function store(StoreJobListingRequest $request) {
    $data = $request->validated(); // validates all fields + generates slug

    if ($request->hasFile('company_logo')) {
        $data['company_logo'] = $request->file('company_logo')->store('logos', 'public');
    }

    Auth::user()->postedJobs()->create($data); // status defaults to 'pending'

    return redirect()->route('employer.jobs.index')
        ->with('success', 'Job listing created and pending approval.');
}
```

Validation is handled by `StoreJobListingRequest`:

```php
// app/Http/Requests/StoreJobListingRequest.php
public function rules(): array {
    return [
        'title' => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'description' => 'required|string|min:50',
        'salary_max' => 'nullable|integer|gte:salary_min', // salary_max >= salary_min
        'work_type' => 'required|in:remote,on-site,hybrid',
        'company_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    ];
}
```

### Step B: View Their Jobs

`/employer/jobs` → `EmployerJobController@index` → `resources/js/Pages/Employer/Jobs/Index.jsx`

Shows all the employer's jobs with status badges (pending/approved/rejected) and application counts:

```jsx
<Badge variant={statusVariants[job.status]}>{job.status}</Badge>
```

### Step C: Review Applicants

Clicking "View Applicants" on a job → `/employer/jobs/{slug}/applicants`

```php
// app/Http/Controllers/Employer/ApplicantController.php — index()
public function index(JobListing $job) {
    if ($job->employer_id !== Auth::id()) abort(403);

    $applications = $job->applications()->with('candidate')->latest()->paginate(15);

    return Inertia::render('Employer/Applicants', [
        'job' => $job->only(['id', 'title', 'slug']),
        'applications' => fn() => $applications->map(...),
    ]);
}
```

The employer can **Accept** or **Reject** each applicant:

```php
// updateStatus()
public function updateStatus(Application $application) {
    $job = $application->jobListing;
    if ($job->employer_id !== Auth::id()) abort(403);

    $application->update(['status' => request('status')]);

    Mail::to($application->candidate->email)->queue(new ApplicationStatusMail($application));

    return redirect()->route('employer.applicants.index', $job)
        ->with('success', 'Application status updated.');
}
```

---

## 7. CANDIDATE FLOW

### Step A: Browse Jobs

Public `/jobs` page with filters:

```php
// app/Http/Controllers/JobListingController.php — index()
public function index(Request $request) {
    $query = JobListing::approved()->with(['employer', 'category']);

    if ($request->filled('keyword')) {
        $keyword = $request->keyword;
        $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('description', 'like', "%{$keyword}%");
        });
    }

    if ($request->filled('work_type')) {
        $query->where('work_type', $request->work_type);
    }

    // ... location, category, salary_min, date_posted filters

    $jobs = $query->latest()->paginate(12);
    return Inertia::render('Jobs/Index', [...]);
}
```

The React filters component submits search via Inertia router with `preserveState`:

```jsx
// resources/js/Components/JobFilters.jsx
const submitFilters = (data) => {
    const clean = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    router.get(route('jobs.index'), clean, { preserveState: true, replace: true });
};
```

### Step B: View Job Details

`/jobs/{slug}` → `JobListingController@show`

```php
// app/Http/Controllers/JobListingController.php — show()
public function show(JobListing $job) {
    if ($job->status !== 'approved') abort(404); // hidden jobs return 404

    $job->incrementViews(); // tracks view count

    $hasApplied = false;
    $isSaved = false;

    if (auth()->check() && auth()->user()->isCandidate()) {
        $hasApplied = $job->hasApplied(auth()->user());
        $isSaved = $job->isSavedBy(auth()->user());
    }

    return Inertia::render('Jobs/Show', [...]);
}
```

Model-level helper methods keep this clean:

```php
// app/Models/JobListing.php
public function hasApplied(User $candidate): bool {
    return $this->applications()->where('candidate_id', $candidate->id)->exists();
}

public function isSavedBy(User $candidate): bool {
    return $this->savedByUsers()->where('candidate_id', $candidate->id)->exists();
}
```

### Step C: Apply to a Job

Candidate clicks "Apply Now" → `/candidate/jobs/{slug}/apply`

```jsx
// resources/js/Pages/Candidate/Apply.jsx
const { data, setData, post, processing, errors } = useForm({
    resume: null, // File object
    cover_note: '',
});

const submit = (e) => {
    e.preventDefault();
    post(route('candidate.apply.store', job.slug));
};
```

Inertia automatically uses `FormData` when it detects a File object:

```php
// app/Http/Controllers/Candidate/ApplicationController.php — store()
public function store(StoreApplicationRequest $request, JobListing $job) {
    if ($job->status !== 'approved') abort(404);

    if ($job->hasApplied(Auth::user())) {
        return redirect()->route('jobs.show', $job)
            ->with('error', 'You have already applied to this job.');
    }

    $path = $request->file('resume')->store('resumes', 'public');

    Application::create([
        'job_listing_id' => $job->id,
        'candidate_id' => Auth::id(),
        'resume_path' => $path,
        'cover_note' => $request->cover_note,
    ]);

    return redirect()->route('candidate.applications.index')
        ->with('success', 'Application submitted successfully.');
}
```

The DB-level unique constraint prevents duplicate applications even if the controller check is bypassed:

```php
// migration
$table->unique(['job_listing_id', 'candidate_id'], 'unique_application');
```

### Step D: Track Applications

`/candidate/applications` shows all applications with status badges:

```jsx
<Badge variant={app.status === 'pending' ? 'warning' : app.status === 'accepted' ? 'success' : 'destructive'}>
    {app.status}
</Badge>
```

Candidates can withdraw **pending** applications only:

```php
// destroy()
public function destroy(Application $application) {
    if ($application->candidate_id !== Auth::id()) abort(403);
    if (!$application->isPending()) abort(403, 'Cannot delete accepted/rejected application.');

    Storage::disk('public')->delete($application->resume_path);
    $application->delete();
}
```

---

## 8. ADMIN FLOW

### Step A: Review Pending Jobs

`/admin/approvals` → `AdminJobApprovalController@index`

Shows all pending jobs. Admin can filter to see all or just pending:

```php
// app/Http/Controllers/Admin/JobApprovalController.php
public function index(Request $request) {
    $query = JobListing::with(['employer', 'category']);

    if ($request->status === 'all') {
        $query->latest();
    } else {
        $query->where('status', $request->status ?? 'pending')->latest();
    }

    return Inertia::render('Admin/JobApprovals', [...]);
}
```

### Step B: Approve or Reject

**Approve** — sets status to `approved`, emails employer:

```php
public function approve(JobListing $job) {
    $job->update(['status' => 'approved']);
    Mail::to($job->employer->email)->queue(new JobApprovedMail($job));
    return back()->with('success', 'Job listing approved.');
}
```

**Reject** — sets status to `rejected`, includes optional reason:

```php
public function reject(JobListing $job, Request $request) {
    $job->update(['status' => 'rejected']);
    Mail::to($job->employer->email)->queue(new JobRejectedMail($job, $request->reason));
    return back()->with('success', 'Job listing rejected.');
}
```

The React page shows a dialog for rejection reason:

```jsx
<Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Reject Job Listing</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this job listing.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder="Rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
        <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={reject}>Reject</Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

---

## 9. The Complete Request-Response Cycle

### Page Visit

```
1. Browser → GET /jobs
2. Laravel Router → matches JobListingController@index
3. Middleware chain runs:
   - HandleInertiaRequests → shares auth user + flash messages
4. Controller queries DB: JobListing::approved()->latest()->paginate(12)
5. Returns Inertia::render('Jobs/Index', { jobs, categories, filters })
6. Inertia serializes data as JSON in page response
7. React receives props → AppLayout.jsx wraps the page
8. Jobs/Index.jsx renders JobCard components for each job
9. Flash messages appear as toast notifications
```

### Form Submission

```
1. React form → post(route('employer.jobs.store'), { ...data })
2. Inertia sends request with CSRF token + FormData (if files)
3. Laravel validates via StoreJobListingRequest
   - On validation fail: redirects back with $errors → Inertia shows them inline
   - On success: creates record, redirects with flash message
4. Inertia follows redirect, re-fetches page with updated data
5. Flash message appears as toast on the new page
```

---

## 10. Model Relationships

```
User (employer)
  ├── postedJobs() → hasMany JobListing
  │     ├── category() → belongsTo Category
  │     ├── applications() → hasMany Application
  │     │     └── candidate() → belongsTo User
  │     └── savedByUsers() → belongsToMany User (via saved_jobs)

User (candidate)
  ├── applications() → hasMany Application
  └── savedJobs() → belongsToMany JobListing (via saved_jobs)

User (admin)
  └── no special relationships — role-based access only
```

Implemented in the models:

```php
// app/Models/User.php
public function postedJobs(): HasMany {
    return $this->hasMany(JobListing::class, 'employer_id');
}

public function applications(): HasMany {
    return $this->hasMany(Application::class, 'candidate_id');
}

public function savedJobs(): BelongsToMany {
    return $this->belongsToMany(JobListing::class, 'saved_jobs', 'candidate_id', 'job_listing_id')
        ->withTimestamps();
}

// app/Models/JobListing.php
public function employer(): BelongsTo {
    return $this->belongsTo(User::class, 'employer_id');
}

public function category(): BelongsTo {
    return $this->belongsTo(Category::class);
}

public function applications(): HasMany {
    return $this->hasMany(Application::class);
}

// Query scopes
public function scopeApproved(Builder $query): Builder {
    return $query->where('status', 'approved');
}

public function scopePending(Builder $query): Builder {
    return $query->where('status', 'pending');
}
```

---

## 11. Seeding the Initial State

```php
// database/seeders/DatabaseSeeder.php
public function run(): void {
    User::create([
        'name' => 'Admin',
        'email' => 'admin@jobboard.test',
        'password' => Hash::make('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $categories = ['Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'Operations', 'HR', 'Legal', 'Engineering', 'Healthcare'];
    foreach ($categories as $cat) {
        Category::create(['name' => $cat, 'slug' => Str::slug($cat)]);
    }
}
```

---

## 12. File Upload Handling

Files are stored in `storage/app/public/` and served via symlink:

```php
// Logo upload (employer)
$data['company_logo'] = $request->file('company_logo')->store('logos', 'public');
// Stored at: storage/app/public/logos/{hash}.ext
// Accessible at: /storage/logos/{hash}.ext

// Resume upload (candidate)
$path = $request->file('resume')->store('resumes', 'public');
// Stored at: storage/app/public/resumes/{hash}.ext
// Accessible at: /storage/resumes/{hash}.ext
```

In React, files are displayed using the `asset()` helper output:

```php
// Controller
'company_logo' => $job->company_logo ? asset('storage/' . $job->company_logo) : null,
```

```jsx
// React
{job.company_logo && <img src={job.company_logo} alt={job.company_name} />}
```

---

## 13. Email Notifications

Mailables are queued for async delivery:

```php
Mail::to($job->employer->email)->queue(new JobApprovedMail($job));
Mail::to($job->employer->email)->queue(new JobRejectedMail($job, $reason));
Mail::to($application->candidate->email)->queue(new ApplicationStatusMail($application));
```

Blade templates render the email body:

```php
// resources/views/mail/job-approved.blade.php
<p>Your job listing "<strong>{{ $jobListing->title }}</strong>" has been approved and is now live.</p>
```

---

## Visual Flow Diagram

```
┌─────────────┐
│   Visitor   │
└──────┬──────┘
       │
  ┌────▼─────┐
  │  Home /  │
  │ Browse   │───────┐
  │   Jobs   │       │
  └────┬─────┘       │
       │              │  (clicks "Apply Now")
       │              ▼
  ┌────▼─────┐   ┌────────────┐
  │ Register │──▶│  Apply for │
  │ (role?)  │   │    Job     │
  └────┬─────┘   └──────┬─────┘
       │                 │
  ┌────▼────┐            │
  │ Employer│      ┌─────▼──────┐
  │  Flow:  │      │ Candidate  │
  │ Post Job│      │    Flow:   │
  │ Pending │      │ View Apps  │
  └────┬────┘      │  Withdraw  │
       │           └────────────┘
       │                    ▲
  ┌────▼─────┐              │
  │   Admin  │──(accepts)───┘
  │ Approves │
  │ Job Live │
  └──────────┘
```
