# Authentication Controllers Explained

This project uses Laravel Breeze scaffolding with Inertia.js. All authentication controllers live in `app/Http/Controllers/Auth/` and are wired in `routes/auth.php`.

---

## 1. RegisteredUserController — User Registration

**Routes:** `GET /register` → `create()` | `POST /register` → `store()`

### Flow
1. **`create()`** — Renders the React `Auth/Register` page via Inertia
2. **`store()`** — Handles the POST submission:
   - Validates `name`, `email` (unique), `password` (confirmed, meets defaults)
   - Creates the user with a hashed password
   - Fires the `Registered` event (triggers email verification notification since `User implements MustVerifyEmail`)
   - Logs the user in via `Auth::login($user)`
   - Redirects to `dashboard`

### Custom behavior in this project
- `AppServiceProvider::boot()` hooks into `User::created` (local only) to auto-set `email_verified_at`
- `User::sendEmailVerificationNotification()` is overridden to bail out in `local` environment

---

## 2. AuthenticatedSessionController — Login & Logout

**Routes:** `GET /login` → `create()` | `POST /login` → `store()` | `POST /logout` → `destroy()`

### Login Flow (`store`)
1. Delegates to `LoginRequest::authenticate()` (see below)
2. Regenerates the session ID (prevents session fixation attacks)
3. Redirects to `dashboard` or the originally intended URL (`intended()`)

### Logout Flow (`destroy`)
1. Logs out via `Auth::guard('web')->logout()`
2. Invalidates the session
3. Regenerates the CSRF token
4. Redirects to `/`

---

### LoginRequest — Form Request (in `app/Http/Requests/Auth/`)

This is not a controller but a **Form Request** that powers the login endpoint:

- **`rules()`** — Requires `email` and `password`
- **`authenticate()`** — Attempts `Auth::attempt(email, password)`. On failure, increments the rate limiter and throws a validation error. On success, clears the rate limiter.
- **`ensureIsNotRateLimited()`** — Blocks after 5 failed attempts per email+IP combo. Fires a `Lockout` event and tells the user how many seconds to wait.
- **`throttleKey()`** — Generates a unique key like `abdallah@example.com|127.0.0.1`

---

## 3. EmailVerificationPromptController — Verification Notice

**Route:** `GET /verify-email` → `__invoke()`

This is an invokable controller. It checks:
- If the user is already verified → redirects to `dashboard`
- Otherwise → renders `Auth/VerifyEmail` React page

This is triggered by the `verified` middleware on protected routes. When an unverified user hits a protected route, Laravel redirects them here.

---

## 4. VerifyEmailController — Email Verification Handler

**Route:** `GET /verify-email/{id}/{hash}` → `__invoke()`

Protected by the `signed` middleware (validates the URL signature hasn't been tampered with) and `throttle:6,1` (max 6 attempts per minute).

### Flow
1. If user already verified → redirect to `dashboard?verified=1`
2. Otherwise → calls `markEmailAsVerified()` on the user model
3. Fires the `Verified` event (listeners could send a welcome email, grant bonuses, etc.)
4. Redirects to `dashboard?verified=1`

---

## 5. EmailVerificationNotificationController — Resend Verification Email

**Route:** `POST /email/verification-notification` → `store()`

Throttled to 6 per minute. Used on the verification notice page when the user clicks "Resend verification email".

### Flow
1. If already verified → redirect to `dashboard`
2. Calls `$request->user()->sendEmailVerificationNotification()`
3. Redirects back with `status=verification-link-sent`

### Custom behavior in this project
- In `local` environment, `sendEmailVerificationNotification()` is a no-op (overridden in the `User` model)

---

## 6. PasswordResetLinkController — Forgot Password

**Routes:** `GET /forgot-password` → `create()` | `POST /forgot-password` → `store()`

### Flow
1. **`create()`** — Renders `Auth/ForgotPassword` with any session status message
2. **`store()`** — Validates `email`, then calls `Password::sendResetLink()`
   - If sent → returns back with `status` (success flash)
   - If failed → throws `ValidationException` with the error on the `email` field

Note: Laravel intentionally returns a generic success message even if the email doesn't exist in the DB (security best practice to prevent email enumeration).

---

## 7. NewPasswordController — Reset Password

**Routes:** `GET /reset-password/{token}` → `create()` | `POST /reset-password` → `store()`

### Flow
1. **`create()`** — Renders `Auth/ResetPassword`, passing the email and reset token from the URL
2. **`store()`** — Validates `token`, `email`, `password` (confirmed, meets defaults)
   - Calls `Password::reset()` with a callback that:
     - Sets the new hashed password
     - Generates a fresh `remember_token` (invalidates all existing sessions)
     - Fires the `PasswordReset` event
   - On success → redirects to `login` with status
   - On failure → throws validation error

---

## 8. ConfirmablePasswordController — Password Confirmation

**Routes:** `GET /confirm-password` → `show()` | `POST /confirm-password` → `store()`

Used before sensitive actions (e.g., deleting an account, changing email). Laravel's `password.confirm` middleware redirects users here if they haven't confirmed their password recently.

### Flow
1. **`show()`** — Renders `Auth/ConfirmPassword`
2. **`store()`** — Validates the current password against `Auth::guard('web')->validate()`
   - On success → stores `auth.password_confirmed_at` timestamp in session (valid for 3 hours by default)
   - On failure → throws validation error

---

## 9. PasswordController — Update Password (Authenticated)

**Route:** `PUT /password` → `update()` (requires `auth` middleware)

### Flow
1. Validates:
   - `current_password` — must match the user's current password (uses Laravel's `current_password` rule)
   - `password` — must meet defaults and be confirmed
2. Updates the user's password with a new hash
3. Redirects back

---

## Route Groups Summary

```
routes/auth.php
├── guest middleware (only accessible when NOT logged in)
│   ├── GET  /register                          → RegisteredUserController::create
│   ├── POST /register                          → RegisteredUserController::store
│   ├── GET  /login                             → AuthenticatedSessionController::create
│   ├── POST /login                             → AuthenticatedSessionController::store
│   ├── GET  /forgot-password                   → PasswordResetLinkController::create
│   ├── POST /forgot-password                   → PasswordResetLinkController::store
│   ├── GET  /reset-password/{token}            → NewPasswordController::create
│   └── POST /reset-password                    → NewPasswordController::store
│
└── auth middleware (requires being logged in)
    ├── GET  /verify-email                      → EmailVerificationPromptController::__invoke
    ├── GET  /verify-email/{id}/{hash}          → VerifyEmailController::__invoke (signed, throttled)
    ├── POST /email/verification-notification   → EmailVerificationNotificationController::store (throttled)
    ├── GET  /confirm-password                  → ConfirmablePasswordController::show
    ├── POST /confirm-password                  → ConfirmablePasswordController::store
    ├── PUT  /password                          → PasswordController::update
    └── POST /logout                            → AuthenticatedSessionController::destroy
```

---

## Key Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Form Request** | `LoginRequest` | Encapsulates validation + auth logic in a dedicated class |
| **Invokable Controllers** | `VerifyEmailController`, `EmailVerificationPromptController` | Single-action controllers with `__invoke()` |
| **Event Dispatching** | `Registered`, `Verified`, `PasswordReset`, `Lockout` | Decoupled side-effects (emails, logging, notifications) |
| **Rate Limiting** | Login (5 attempts), Verification (6/min) | Prevents brute-force and spam |
| **Signed URLs** | Email verification link | Tamper-proof URL that expires |
| **Session Regeneration** | After login and logout | Prevents session fixation attacks |
| **Flash Messages** | `session('status')` | One-time success/error messages after redirect |
