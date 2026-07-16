---

description: "Task list for feature 002-public-home-login-button"
---

# Tasks: Public Home Page with Header Login Button

**Input**: Design documents from `/specs/002-public-home-login-button/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/header-auth-ui.md, quickstart.md all present.

**Tests**: Test-First is NON-NEGOTIABLE (constitution principle IV). Per the user's explicit instruction, the test layer for this feature is **Playwright e2e** (`apps/web/playwright.config.ts` → `tests/e2e/`). Failing e2e tests are written BEFORE implementation (red), then implementation makes them green. No vitest is introduced (it is not installed); routing/header behavior is verified end-to-end via Playwright, which is sufficient and matches the user's request to "remember e2e test with playwright".

**Organization**: Tasks are grouped by user story (spec.md priorities P1→P3) so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Web app, Next.js App Router. Test paths under `apps/web/tests/e2e/` (Playwright). Source under `apps/web/src/`. The web package is `@advisor/web` (use `pnpm --filter @advisor/web ...`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test scaffolding for the new e2e scenarios. No source changes.

- [x] T001 [P] Add Playwright e2e helper for a guaranteed unauthenticated session (clear all cookies, no `sb-` session) in `apps/web/tests/e2e/helpers/unauthenticated.ts`
- [x] T002 [P] Add Playwright e2e helper for a seeded authenticated session (reuse test user `test@sideprojectadvisor.com` / `Test1234` from feature 001, log in via UI or storageState) in `apps/web/tests/e2e/helpers/authenticated.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Route-protection refactor that BOTH US1 (public home) and US4 (auth-page redirect) depend on. MUST be complete before any user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests (write FIRST, must FAIL against current code)

- [x] T003 [P] E2E test: unauthenticated visit to `/` renders the home page with NO redirect to `/login` (SC-001) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T004 [P] E2E test: unauthenticated visit to a protected route redirects to `/login` (FR-007, SC-005 — protection preserved) in `apps/web/tests/e2e/public-home.spec.ts`

### Implementation (make tests green)

- [x] T005 [P] Add `'/'` to `PUBLIC_ROUTES` and define a new `AUTH_PAGES` set (subset `{ /login, /signup, /reset-password, /update-password }`, excludes `/`) in `apps/web/src/lib/constants.ts`
- [x] T006 Change the authenticated-redirect branch in middleware to use `AUTH_PAGES` (not `PUBLIC_ROUTES`) so authenticated users are bounced off auth pages but NOT off the public home in `apps/web/src/middleware.ts`

**Checkpoint**: Home is public; protected routes still redirect; authenticated users are not redirected away from `/`. Foundation ready — user story work can proceed.

---

## Phase 3: User Story 1 - Visitor Reaches Home Without Logging In (Priority: P1) 🎯 MVP

**Goal**: An unauthenticated visitor to `/` sees the full home experience with no forced login.

**Independent Test**: Fresh private session → navigate to `/` → page renders fully, no redirect.

### Tests (write FIRST, must FAIL before implementation where behavior is new)

- [x] T007 [P] [US1] E2E test: authenticated visit to `/` renders the home page (NO redirect) — US1 scenario 3 (regression guard against the AUTH_PAGES split) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T008 [US1] Update now-stale assertions in the existing 001 e2e suite that encode retired behavior: the `"redirects unauthenticated user to login"` test visiting `/` and the `"can sign out after login"` test expecting post-sign-out `/` → `/login` redirect in `apps/web/tests/e2e/login.spec.ts`

### Implementation

- [x] T009 [US1] Confirm home page renders the Advisor feature for unauthenticated visitors (no auth gate in `page.tsx`; the gate was the middleware, now fixed in T006) — verify, no code change expected, in `apps/web/src/app/page.tsx`

**Checkpoint**: User Story 1 fully functional and independently testable — an unauthenticated visitor reaches `/` with no redirect. This is the MVP.

---

## Phase 4: User Story 2 - Visitor Sees a Login Button in the Header (Priority: P1)

**Goal**: An unauthenticated visitor sees a "Log in" button in the header top-right region; clicking it goes to `/login`.

**Independent Test**: Unauthenticated home load → "Log in" button visible in header → click → land on `/login`.

### Tests (write FIRST, must FAIL before implementation)

- [x] T010 [P] [US2] E2E test: unauthenticated home page shows a "Log in" button in the header top-right region, visible without scrolling, and still visible on a mobile-width viewport (FR-002, FR-005, SC-002) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T011 [P] [US2] E2E test: clicking the "Log in" button navigates to `/login` in a single step (FR-003, SC-003) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T012 [P] [US2] E2E test: the "Log in" button is keyboard-reachable and has an accessible name (FR-006) in `apps/web/tests/e2e/public-home.spec.ts`

### Implementation

- [x] T013 [P] [US2] Create `HeaderAuth` client component — logged-out state renders a "Log in" link/button pointing to `/login` with an accessible label (FR-006) in `apps/web/src/components/auth/header-auth.tsx`
- [x] T014 [US2] Create a shared `SiteHeader` server component (logo + `<HeaderAuth authenticated={false} email={null} />` initially) and render it in the root layout so the header appears on every page in `apps/web/src/components/layout/site-header.tsx` and `apps/web/src/app/layout.tsx`
- [x] T015 [US2] Remove the baked-in `<header>` (SIDE.DEV logo + `v1.0`) from the Advisor feature so chrome is not duplicated; keep the rest of the Advisor component intact in `apps/web/src/features/advisor/Advisor.tsx`

**Checkpoint**: User Stories 1 AND 2 both work independently — unauthenticated visitors reach a public home with a header "Log in" button.

---

## Phase 5: User Story 3 - Authenticated User Sees Account Control Instead of Login Button (Priority: P2)

**Goal**: A signed-in user sees an account indicator + sign-out control in the header (not a login button); signing out keeps them on the home page and reverts the header.

**Independent Test**: Sign in → home header shows account control (no "Log in" button) → sign out → stay on `/` with "Log in" button back.

### Tests (write FIRST, must FAIL before implementation)

- [x] T016 [P] [US3] E2E test: signed-in user on `/` sees an account indicator (email initial / avatar) and a sign-out control, and does NOT see a "Log in" button (FR-004, SC-004) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T017 [P] [US3] E2E test: signing out from the header keeps the user on `/` and the header reverts to the "Log in" button (FR-011, SC-006) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T018 [P] [US3] E2E test: the account/sign-out controls are keyboard-reachable with accessible labels (FR-006) in `apps/web/tests/e2e/public-home.spec.ts`

### Implementation

- [x] T019 [P] [US3] Extend `HeaderAuth` to render an account indicator (reuse `UserAvatar`) + `SignOutButton` (reuse existing `signOut` action) when `authenticated` is true, and the "Log in" button when false, in `apps/web/src/components/auth/header-auth.tsx`
- [x] T020 [US3] Resolve the Supabase session server-side in the root layout (reuse `createClient()` from `@/lib/supabase/server`) and pass `authenticated` + `email` to `SiteHeader` → `HeaderAuth` to avoid a logged-out→logged-in flash (FR-010) in `apps/web/src/app/layout.tsx` and `apps/web/src/components/layout/site-header.tsx`

**Checkpoint**: User Stories 1, 2, AND 3 all work independently — public home, header login button for anonymous, account control for signed-in users.

---

## Phase 6: User Story 4 - Authenticated Users Are Not Redirected Away from Auth Pages (Priority: P3)

**Goal**: Authenticated users visiting auth pages (`/login`, `/signup`) are redirected to `/`; unauthenticated users visiting protected routes are still redirected to `/login`; no redirect loops.

**Independent Test**: Sign in → visit `/login` directly → redirected to `/`; visit a protected route unauthenticated → redirected to `/login`.

### Tests (write FIRST, must FAIL before implementation where behavior is new)

- [x] T021 [P] [US4] E2E test: authenticated user visiting `/login` is redirected to `/` (FR-008) in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T022 [P] [US4] E2E test: authenticated user visiting `/signup` is redirected to `/` in `apps/web/tests/e2e/public-home.spec.ts`
- [x] T023 [P] [US4] E2E test: unauthenticated user visiting a protected (non-public) route is redirected to `/login` — SC-005 regression guard in `apps/web/tests/e2e/public-home.spec.ts`

### Implementation

- [x] T024 [US4] Ensure `AUTH_PAGES` includes all auth routes (`/login`, `/signup`, `/reset-password`, `/update-password`) so the authenticated-redirect branch from T006 covers each, in `apps/web/src/lib/constants.ts`

**Checkpoint**: All user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gate wiring (honor "remember e2e with playwright"), changelog, full quality gates.

- [x] T025 [P] Add a `test` script to the web package so Playwright e2e runs under the standard `pnpm test` gate (`"test": "playwright test"`), keeping `test:e2e` as an alias in `apps/web/package.json`
- [x] T026 [P] Add a user-facing `[Unreleased]` entry to the changelog for the public home + header login button in `CHANGELOG.md`
- [x] T027 Run full local quality gate per constitution principle IV: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- [x] T028 Run the Playwright e2e suite end-to-end and confirm all scenarios in `quickstart.md` pass: `pnpm --filter @advisor/web test:e2e`
- [x] T029 [P] Manual validation: run the 6 scenarios in `specs/002-public-home-login-button/quickstart.md` against a fresh browser session

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. Helpers T001/T002 in parallel.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories. Tests T003/T004 (red) before T005/T006 (green).
- **User Stories (Phase 3–6)**: All depend on Foundational completion.
  - US1 (Phase 3): builds on Foundational; updates stale 001 e2e tests (T008).
  - US2 (Phase 4): depends on US1 (home must be public for the header login button to be visible there) — tests T010–T012 (red) before T013–T015 (green).
  - US3 (Phase 5): depends on US2 (shares `HeaderAuth` component) — tests T016–T018 (red) before T019–T020 (green).
  - US4 (Phase 6): depends on Foundational (AUTH_PAGES split) — tests T021–T023 (red) before T024 (green).
- **Polish (Phase 7)**: After all user stories complete. T027/T028 are the final gate.

### User Story Dependencies

- **User Story 1 (P1)**: Foundational complete — no other story dependency. (Independently testable: public home.)
- **User Story 2 (P1)**: Needs US1 (home public) for tests to observe the button there. Implementation is the header/login button itself.
- **User Story 3 (P2)**: Needs US2 (same `HeaderAuth` component). Implementation extends the component to the logged-in state.
- **User Story 4 (P3)**: Needs Foundational (AUTH_PAGES). Implementation only finalizes the `AUTH_PAGES` membership.

### Within Each User Story

- Playwright e2e tests written FIRST and FAIL before implementation (Test-First, constitution IV).
- Header/component changes before layout wiring.
- Story complete and green before the next priority.

### Parallel Opportunities

- T001/T002 (Setup helpers) — different files, parallel.
- T003/T004 (Foundational tests) — same file but disjoint scenarios; can be authored together, marked [P] as independent assertions.
- T005/T006 (Foundational impl) — different files (`constants.ts` vs `middleware.ts`), but T006 depends on T005's `AUTH_PAGES` export → T005 then T006.
- US2 tests T010/T011/T012 and US3 tests T016/T017/T018 — all in the same `public-home.spec.ts` file; authored sequentially or as one batch, not parallel across files.
- T013 (HeaderAuth logged-out) precedes T019 (HeaderAuth logged-in) — same file, sequential.
- T025/T026 (Polish) — different files, parallel.

---

## Parallel Example: Foundational (Phase 2)

```bash
# Author the failing e2e tests first (red), together:
Task T003: "E2E: unauthenticated '/' renders home (SC-001) in apps/web/tests/e2e/public-home.spec.ts"
Task T004: "E2E: unauthenticated protected route -> /login (SC-005) in apps/web/tests/e2e/public-home.spec.ts"

# Then implement (green), T005 before T006:
Task T005: "Add '/' to PUBLIC_ROUTES + define AUTH_PAGES in apps/web/src/lib/constants.ts"
Task T006: "Use AUTH_PAGES in middleware authenticated-redirect in apps/web/src/middleware.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: Setup (e2e helpers).
2. Complete Phase 2: Foundational — write red e2e (T003/T004), implement constants+middleware (T005/T006) to green.
3. Complete Phase 3: User Story 1 — add authenticated-`/` regression (T007), retire stale 001 assertions (T008), confirm home (T009).
4. **STOP and VALIDATE**: `pnpm --filter @advisor/web test:e2e` — unauthenticated and authenticated users reach `/` with no forced login.
5. Demo/ship the MVP (public home, no login button yet).

### Incremental Delivery

1. Setup + Foundational → public home, protected routes preserved.
2. Add US1 → public home MVP (demo).
3. Add US2 → header "Log in" button (demo).
4. Add US3 → state-aware account control + sign-out (demo).
5. Add US4 → auth-page redirect refinement verified.
6. Polish → `pnpm test` runs e2e; changelog; full gate green.

---

## Notes

- Test layer is **Playwright e2e** per the user's explicit reminder; vitest is not introduced (not installed). Test-First is honored as e2e red → implement → green.
- The existing `apps/web/tests/e2e/login.spec.ts` (feature 001) contains assertions that this feature RETIRES (visiting `/` redirects to `/login`; post-sign-out `/` redirects to `/login`). T008 updates them as part of the behavior change — not a TDD violation.
- `signOut` action lives at `@/lib/auth/actions`; server Supabase client at `@/lib/supabase/server` (`createClient()`); `UserAvatar` and `SignOutButton` already exist and are reused.
- No new packages (constitution I), no `any` (constitution II), no DB/migration changes (constitution III), no new HTTP contracts (constitution V — UI contract only).
- [P] tasks = different files, no dependencies. [Story] label maps a task to its user story.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.