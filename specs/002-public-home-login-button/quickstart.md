# Quickstart: Public Home Page with Header Login Button

**Feature**: 002-public-home-login-button
**Spec**: [spec.md](spec.md)

Runnable validation scenarios that prove the feature works end-to-end. These
are validation/run steps — implementation details belong in `tasks.md`.

## Prerequisites

- The **User Login** feature (`specs/001-user-login`) is implemented: Supabase
  Auth is wired up, login/signup/reset-password/sign-out flows exist, and a test
  user can be seeded.
- Node.js 20+, pnpm 11+.
- Environment configured as in `specs/001-user-login/quickstart.md`
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
  `SUPABASE_SERVICE_ROLE_KEY` for seeding).
- A seeded test user (see feature 001):
  - Email: `test@sideprojectadvisor.com`
  - Password: `Test1234`

## Validation scenarios

### Scenario 1 — Unauthenticated visitor reaches the home page (FR-001, SC-001)

1. Open a fresh private browser session (no `sb-…` cookies).
2. Navigate to `http://localhost:3000/`.
3. **Expected**: The home page renders fully. No redirect to `/login`. The
   advisor experience is interactable.
4. **Contract**: see routing matrix in [header-auth-ui.md](contracts/header-auth-ui.md).

### Scenario 2 — "Log in" button visible in the header (FR-002/003, SC-002/003)

1. From Scenario 1 (unauthenticated), inspect the header.
2. **Expected**: A "Log in" button is visible in the header top-right region on
   first paint without scrolling; visible on a mobile-width viewport too.
3. Click "Log in".
4. **Expected**: You land on `/login` in a single navigation step.
5. **Contract**: `HeaderAuth` logged-out state in [header-auth-ui.md](contracts/header-auth-ui.md).

### Scenario 3 — Protected routes still redirect (FR-007, SC-005)

1. From an unauthenticated session, directly visit a protected route (e.g.,
   any authenticated-only path from feature 001).
2. **Expected**: Redirected to `/login`. Home being public did not weaken
   protection elsewhere.
3. **Contract**: routing matrix, "any other (protected) | none → /login".

### Scenario 4 — Authenticated user not bounced from home (FR-004, User Story 1.3)

1. Sign in with the seeded test user.
2. Navigate to `http://localhost:3000/`.
3. **Expected**: You stay on the home page (no redirect). The header shows the
   account indicator + sign-out control (not the "Log in" button).
4. **Contract**: `HeaderAuth` logged-in state in [header-auth-ui.md](contracts/header-auth-ui.md).

### Scenario 5 — Sign out from the header keeps you home (FR-011, SC-006)

1. From Scenario 4 (authenticated, on home page), click sign-out in the header.
2. **Expected**: You remain on `/` and the header reverts to the "Log in"
   button.
3. **Contract**: `HeaderAuth` post-sign-out behavior.

### Scenario 6 — Auth pages redirect authenticated users (FR-008, User Story 4)

1. While authenticated, directly visit `/login`.
2. **Expected**: Redirected to `/`. Repeat for `/signup`.
3. **Contract**: routing matrix, auth-pages | present → `/`.

## Automated tests

Run the full suite (Test-First, constitution principle IV):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Targeted test layers for this iteration:

- **Unit (constants)**: `/` ∈ `PUBLIC_ROUTES`; `AUTH_PAGES` excludes `/`.
- **Integration (middleware)**: redirect matrix from Scenario 1, 3, 4, 6.
- **Component (header)**: `HeaderAuth` logged-out → login button → links to
  `/login`; logged-in → account control + sign-out; keyboard/`aria-label`
  assertions (accessibility, FR-006).

## Notes

- Session for the header is resolved server-side in the root layout (no
  logged-out→logged-in flash) — see [research.md](research.md), unknown 4.
- No new migrations or env vars are required by this iteration.