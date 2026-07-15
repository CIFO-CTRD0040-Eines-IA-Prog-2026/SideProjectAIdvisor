---
description: "Task list for User Login feature implementation"
---

# Tasks: User Login

**Input**: Design documents from `/specs/001-user-login/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per Constitution Principle IV (Test-First Development is mandatory).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to `apps/web/src/` unless prefixed with `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create directory structure

- [ ] T001 Install `@supabase/supabase-js` and `@supabase/ssr` in `apps/web/package.json`
- [ ] T002 [P] Create directory structure: `lib/supabase/`, `components/auth/`, `app/(auth)/login/`, `app/(auth)/signup/`, `app/(auth)/reset-password/`, `app/(auth)/update-password/`, `app/(authenticated)/`, `app/auth/callback/`
- [ ] T003 [P] Create browser Supabase client in `apps/web/src/lib/supabase/client.ts` using `createBrowserClient`
- [ ] T004 [P] Create server Supabase client in `apps/web/src/lib/supabase/server.ts` using `createServerClient` with cookie handling
- [ ] T005 Create session refresh middleware utility in `apps/web/src/lib/supabase/middleware.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create `apps/web/src/middleware.ts` — Next.js middleware that refreshes session on every request and redirects unauthenticated users from protected routes to `/login`
- [ ] T007 [P] Create `apps/web/src/lib/auth-actions.ts` with shared types (`ActionResult`, `AuthError`) for all server actions
- [ ] T008 Create authenticated route group layout at `apps/web/src/app/(authenticated)/layout.tsx` — checks session and redirects to `/login` if no session
- [ ] T009 [P] Configure `.env.local` template with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders

**Checkpoint**: Foundation ready — Supabase clients, middleware, and auth layout are in place.

---

## Phase 3: User Story 1 — Sign Up with Email and Password (Priority: P1) 🎯 MVP

**Goal**: A new visitor can navigate to `/signup`, enter email + password, and create an account. On success they are redirected to the authenticated home.

**Independent Test**: Navigate to `/signup`, submit a valid email and password meeting strength requirements, verify redirect to `/` with active session and success confirmation.

### Tests for User Story 1 (TDD — write first, ensure they FAIL before implementation)

- [ ] T010 [P] [US1] Unit test for signup form validation (email format, password strength, empty fields, duplicate email display) in `tests/auth/signup-form.test.tsx`
- [ ] T011 [P] [US1] Unit test for `signUp` server action — success path, duplicate email, invalid input edge cases in `tests/auth/auth-actions.test.ts`

### Implementation for User Story 1

- [ ] T012 [US1] Implement `signUp(email, password)` server action in `apps/web/src/lib/auth-actions.ts` — calls `supabase.auth.signUp`, sets session cookie via `@supabase/ssr`, returns `ActionResult`
- [ ] T013 [P] [US1] Create signup page at `apps/web/src/app/(auth)/signup/page.tsx` — renders signup form component
- [ ] T014 [P] [US1] Create signup form component in `apps/web/src/components/auth/signup-form.tsx` — email input, password input, client-side validation (email format, password strength), submit via server action, loading state, error display
- [ ] T015 [US1] Wire signup form to page — handle success redirect, error display, and loading states

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 — Log In with Email and Password (Priority: P1)

**Goal**: A registered user can navigate to `/login`, enter credentials, and be signed in. Failed attempts show a generic "Invalid email or password" error.

**Independent Test**: Navigate to `/login`, enter valid credentials, verify redirect to `/`. Enter invalid password, verify generic error. Enter unregistered email, verify same generic error.

### Tests for User Story 2 (TDD — write first, ensure they FAIL before implementation)

- [ ] T016 [P] [US2] Unit test for login form — valid submission, wrong password, unregistered email, empty fields in `tests/auth/login-form.test.tsx`
- [ ] T017 [P] [US2] Unit test for `signIn` server action — success, wrong password, unregistered email (generic error), rate limiting trigger in `tests/auth/auth-actions.test.ts`

### Implementation for User Story 2

- [ ] T018 [US2] Implement `signIn(email, password)` server action in `apps/web/src/lib/auth-actions.ts` — calls `supabase.auth.signInWithPassword`, sets session cookie, returns generic error for all failures (FR-005)
- [ ] T019 [P] [US2] Create login page at `apps/web/src/app/(auth)/login/page.tsx` — renders login form component
- [ ] T020 [P] [US2] Create login form component in `apps/web/src/components/auth/login-form.tsx` — email input, password input, "Forgot password" link, submit via server action, loading state, generic error display
- [ ] T021 [US2] Wire login form to page — handle success redirect, error display, loading states
- [ ] T022 [US2] Implement redirect for already-authenticated users on `/login` and `/signup` (FR-011) — check session on mount and redirect to `/`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 — Log Out (Priority: P2)

**Goal**: A signed-in user can click a sign-out button and end their session. Protected routes redirect to login after logout.

**Independent Test**: Sign in via `/login`, click log out, verify redirect to public home. Attempt to access a protected route (e.g., `/`) by direct URL, verify redirect to `/login`.

### Tests for User Story 3 (TDD — write first, ensure they FAIL before implementation)

- [ ] T023 [P] [US3] Unit test for `signOut` action — success, no-active-session error, session cookie clearing in `tests/auth/auth-actions.test.ts`
- [ ] T024 [P] [US3] Unit test for auth header component — shows user email when signed in, shows login link when signed out in `tests/auth/auth-header.test.tsx`

### Implementation for User Story 3

- [ ] T025 [US3] Implement `signOut()` server action in `apps/web/src/lib/auth-actions.ts` — calls `supabase.auth.signOut`, clears session cookies, returns `ActionResult`
- [ ] T026 [P] [US3] Create auth header component in `apps/web/src/components/auth/auth-header.tsx` — displays user email and sign-out button when authenticated, login/signup links when not
- [ ] T027 [US3] Integrate auth header into `apps/web/src/app/(authenticated)/layout.tsx` — render header for all authenticated pages

**Checkpoint**: Full auth cycle works — sign up, log in, log out, route protection.

---

## Phase 6: User Story 4 — Reset Forgotten Password (Priority: P3)

**Goal**: A user who forgot their password can request a reset link via email, click the time-limited link, and set a new password. They can then log in with the new credentials.

**Independent Test**: Request password reset for a registered email, receive reset link (check Supabase Auth emails or console), click link, set new password, log in with new credentials.

### Tests for User Story 4 (TDD — write first, ensure they FAIL before implementation)

- [ ] T028 [P] [US4] Unit test for `resetPassword` server action — success message (always same), rate limiting in `tests/auth/auth-actions.test.ts`
- [ ] T029 [P] [US4] Unit test for `updatePassword` server action — valid token, expired token, weak password in `tests/auth/auth-actions.test.ts`

### Implementation for User Story 4

- [ ] T030 [US4] Implement `resetPassword(email)` server action in `apps/web/src/lib/auth-actions.ts` — calls `supabase.auth.resetPasswordForEmail` with redirect to `/auth/callback?redirect_to=/update-password`
- [ ] T031 [US4] Implement `updatePassword(newPassword)` server action in `apps/web/src/lib/auth-actions.ts` — calls `supabase.auth.updateUser`, returns error for expired/invalid session
- [ ] T032 [P] [US4] Create forgot-password page at `apps/web/src/app/(auth)/reset-password/page.tsx`
- [ ] T033 [P] [US4] Create forgot-password form component in `apps/web/src/components/auth/forgot-password-form.tsx` — email input, submit, success message
- [ ] T034 [P] [US4] Create update-password page at `apps/web/src/app/(auth)/update-password/page.tsx` — new password input, confirm, error display for expired link
- [ ] T035 [P] [US4] Create auth callback route at `apps/web/src/app/auth/callback/route.ts` — handles Supabase Auth redirects (password reset token exchange, email confirmation), extracts `code` from query params, exchanges for session, redirects to `redirect_to`

**Checkpoint**: All four auth flows functional and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Add login rate limiting in `apps/web/src/lib/auth-actions.ts` — track failed attempts per IP, block after 5 failures for 15 minutes (FR-013)
- [ ] T037 [P] Add password reset rate limiting in `apps/web/src/lib/auth-actions.ts` — max 3 requests per email per hour (FR-014)
- [ ] T038 [P] Add error boundary wrapper for auth pages — graceful fallback UI if Supabase is unreachable
- [ ] T039 Run end-to-end validation scenarios from `specs/001-user-login/quickstart.md`
- [ ] T040 [P] Add form accessibility — autofocus on first input, aria labels on all inputs, keyboard navigation for all auth forms
- [ ] T041 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` to verify all quality gates pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational completion
  - US1 must go first (creates users needed for testing US2)
  - US2 can follow immediately after US1
  - US3 depends on session being active (US2)
  - US4 depends on user existence (US1) and login flow (US2)
- **Polish (Phase 7)**: Depends on all user stories being complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Core implementation before integration/wiring
- Story complete before moving to next phase

### Parallel Opportunities

| Parallel Group | Tasks | Rationale |
|---------------|-------|-----------|
| Setup | T002, T003, T004 | Different files, no dependencies |
| Foundational | T007, T009 | auth-actions.ts and .env.local are independent |
| US1 Tests | T010, T011 | Test different files |
| US1 Impl | T013, T014 | Page shell and form component are independent |
| US2 Tests | T016, T017 | Test different files |
| US2 Impl | T019, T020 | Page shell and form component are independent |
| US3 Tests | T023, T024 | Test different files |
| US3 Impl | T026 | Single component — sequential within story |
| US4 Tests | T028, T029 | Test different files |
| US4 Impl | T032, T033, T034, T035 | Pages, forms, and callback route are independent |
| Polish | T036, T037, T038, T040 | Rate limiting, error boundary, accessibility are independent |

---

## Implementation Strategy

### MVP First (Phases 1–3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Sign Up)
4. **STOP and VALIDATE**: Navigate to `/signup`, create account, see authenticated home
5. Deploy/demo if ready — sign-up flow is the core value

### Incremental Delivery

1. **MVP** (Phases 1–3): Sign-up only — user creates account and reaches authenticated home
2. **+ Login** (Phase 4): Returning users can authenticate — full authentication cycle
3. **+ Logout** (Phase 5): Session management — complete auth lifecycle
4. **+ Password Reset** (Phase 6): Account recovery — self-service for forgotten passwords
5. **+ Polish** (Phase 7): Rate limiting, accessibility, hardening

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundation is done:
   - Developer A: User Story 1 (Sign Up) — T010 to T015
   - Developer B: User Story 2 (Log In) — T016 to T022
3. After US1 + US2:
   - Developer A: User Story 3 (Log Out) — T023 to T027
   - Developer B: User Story 4 (Password Reset) — T028 to T035
4. Polish tasks distributed across team

---

## Summary

| Phase | Story | Task IDs | Task Count | Parallel Tasks |
|-------|-------|----------|------------|----------------|
| 1 Setup | — | T001–T005 | 5 | 3 |
| 2 Foundational | — | T006–T009 | 4 | 2 |
| 3 Sign Up | US1 (P1) | T010–T015 | 6 | 4 |
| 4 Log In | US2 (P1) | T016–T022 | 7 | 4 |
| 5 Log Out | US3 (P2) | T023–T027 | 5 | 4 |
| 6 Password Reset | US4 (P3) | T028–T035 | 8 | 6 |
| 7 Polish | — | T036–T041 | 6 | 4 |
| **Total** | | **T001–T041** | **41** | **27** |
