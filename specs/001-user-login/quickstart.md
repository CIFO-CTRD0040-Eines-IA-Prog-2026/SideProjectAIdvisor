# Quickstart: User Login Feature

## Prerequisites

- Node.js 20+, pnpm 11+
- Supabase project with Auth enabled (email/password provider)
- Environment variables configured in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<project-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
  ```
- Supabase Auth settings: "Enable email confirmations" can be ON or OFF (v1 assumes OFF)

## Setup

```bash
pnpm install
```

If `@supabase/supabase-js` and `@supabase/ssr` are not yet in `apps/web/package.json`:
```bash
pnpm --filter @advisor/web add @supabase/supabase-js @supabase/ssr
```

## Test User

A seed script creates a pre-confirmed test user for development:

```bash
pnpm --filter @advisor/web seed
```

**Credentials:**

| Field    | Value                          |
|----------|--------------------------------|
| Email    | `test@sideprojectadvisor.com` |
| Password | `Test1234`                    |

> **Prerequisite:** Set `SUPABASE_SERVICE_ROLE_KEY` in `apps/web/.env` (find it in Supabase Dashboard → Project Settings → API → `service_role` key). This is required to create users via the Admin API without email confirmation.

The script is idempotent — running it multiple times won't create duplicates.

## Validation Scenarios

### Scenario 1: Sign Up

1. Navigate to `/signup`
2. Enter a valid email and password (min 8 chars, 1 upper, 1 lower, 1 number)
3. Click "Sign Up"
4. **Expected**: Redirected to `/` (authenticated home). Session is active.

### Scenario 2: Sign Up with Duplicate Email

1. Navigate to `/signup`
2. Enter the same email used in Scenario 1
3. Click "Sign Up"
4. **Expected**: Error message "Email already in use". Page remains on `/signup`.

### Scenario 3: Login

1. Navigate to `/login`
2. Enter the email and password from Scenario 1
3. Click "Log In"
4. **Expected**: Redirected to `/` (authenticated home). Session is active.

### Scenario 4: Login with Wrong Password

1. Navigate to `/login`
2. Enter a valid email with an incorrect password
3. Click "Log In"
4. **Expected**: Error message "Invalid email or password". Page remains on `/login`.

### Scenario 5: Protected Route Redirect

1. Log out (or start without a session)
2. Navigate directly to `/` (or any protected route)
3. **Expected**: Redirected to `/login`.

### Scenario 6: Logout

1. While authenticated, click "Log Out"
2. **Expected**: Redirected to public home. Protected routes redirect to `/login`.

### Scenario 7: Password Reset

1. Navigate to `/login`, click "Forgot Password"
2. Enter the email from Scenario 1
3. Click "Send Reset Link"
4. **Expected**: Success message "If an account exists, a reset link has been sent"
5. Check the Supabase Auth emails (or console logs in development) for the reset link
6. Click the reset link (should open `/auth/callback?redirect_to=/update-password`)
7. Enter a new valid password
8. Click "Update Password"
9. **Expected**: Redirected to `/`. Can log in with the new password.

## Running Tests

```bash
pnpm --filter @advisor/web test         # unit/component tests
pnpm --filter @advisor/web test:e2e     # E2E tests (Playwright) - when configured
```

## Expected Outcome

All five auth flows (sign up, log in, log out, password reset, route protection) work end-to-end. See [contracts/auth-server-actions.md](contracts/auth-server-actions.md) for the action interfaces and [data-model.md](data-model.md) for entity details.
