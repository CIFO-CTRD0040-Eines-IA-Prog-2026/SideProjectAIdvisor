# Research: Public Home Page with Header Login Button

**Feature**: 002-public-home-login-button
**Date**: 2026-07-15
**Spec**: [spec.md](spec.md)

## Unknowns Resolved

The spec has no `[NEEDS CLARIFICATION]` markers. The following design/technical
unknowns were researched to ground the implementation plan. Each follows the
Decision → Rationale → Alternatives format.

---

### 1. Where should the login/account control live: inside the `Advisor` component or a shared layout header?

**Decision**: Add a shared site header to the root layout (`apps/web/src/app/layout.tsx`)
that renders the state-aware login/account control, and remove the home-grown
header currently baked into `Advisor.tsx`.

**Rationale**: The `Advisor` component is the home *content*, not the chrome.
The current `Advisor.tsx` ships its own `<header>` (SIDE.DEV logo + `v1.0`).
Hosting the auth control in the root layout means it appears consistently on
every public and authenticated page, follows Next.js App Router conventions
(shared UI in the root layout), and keeps the auth-driven UI out of a feature
component. A single header also satisfies FR-004 (state-aware header) and SC-002
(visible on first paint) without duplicating session-resolution logic in two
places.

**Alternatives considered**:
- *Keep the header inside `Advisor.tsx` and inject the auth control there*:
  rejected because it couples auth UI to the home feature and would not appear
  on other pages; also forces the home feature to know about session state.
- *Add the header to a new `(public)` route group layout*: rejected because the
  login button should also show on authenticated pages (FR-004 is state-aware,
  not route-gated); the root layout is the correct shared boundary.

---

### 2. How should the home page route be made public without weakening protection on other routes?

**Decision**: Add `/` to the `PUBLIC_ROUTES` set in `apps/web/src/lib/constants.ts`,
and invert the existing middleware logic so it protects everything *not* in
`PUBLIC_ROUTES`. Keep the two existing middleware branches:
(1) unauthenticated + non-public → redirect to `/login`;
(2) authenticated + public-auth-routes (`/login`, `/signup`) → redirect to `/`.

**Rationale**: The current `middleware.ts` already uses a `PUBLIC_ROUTES` allowlist
with exactly these two branches. Adding `/` to the allowlist makes the home page
public while leaving all other routes protected by default — this is the
minimum-diff change and directly satisfies FR-001, FR-007, and FR-008/SC-005.
An allowlist is safer than a denylist because new routes are protected by
default.

**Alternatives considered**:
- *Move the home page into a `(public)` route group and exclude the group from
  protection*: rejected because the root URL `/` must stay at `app/page.tsx`
  (no route group prefix); moving it would change the URL or require redirects.
- *Maintain a separate `UNPROTECTED_ROUTES` denylist*: rejected as less safe —
  new routes would be public by default.

**Note on authenticated-redirect**: Keep redirecting authenticated users away
from `/login` and `/signup` (FR-008 / User Story 4), but `/` must NOT trigger
that redirect for authenticated users (home is for everyone — User Story 1,
scenario 3). The current code already handles this via the
`user && PUBLIC_ROUTES.has(pathname)` branch; since `/` is now public AND meant
for authenticated users too, the middleware must distinguish "auth pages" from
"public content pages". Resolve by splitting `PUBLIC_ROUTES` into two sets in
research follow-up below.

---

### 3. How to distinguish "auth pages" (login/signup) from "public content pages" (home) in the middleware?

**Decision**: Introduce two distinct sets (both in `constants.ts`):
- `PUBLIC_ROUTES` — routes any visitor may see (`/`, `/login`, `/signup`,
  `/reset-password`, `/update-password`, `/auth/callback`).
- `AUTH_PAGES` — subset of public routes that authenticated users should be
  redirected away from (`/login`, `/signup`, `/reset-password`, `/update-password`).

Middleware logic becomes:
1. `updateSession(request)`.
2. `if (!user && !PUBLIC_ROUTES.has(pathname))` → redirect to `/login`.
3. `if (user && AUTH_PAGES.has(pathname))` → redirect to `/`.

**Rationale**: The current code redirects authenticated users away from
*all* `PUBLIC_ROUTES`. Once `/` is public, that branch would wrongly bounce
authenticated users off the home page (violating User Story 1, scenario 3).
Splitting the sets preserves the "auth pages are for anonymous users only"
behavior while letting authenticated users stay on the public home page.

**Alternatives considered**:
- *Inline the auth-page list in middleware*: rejected; a named constant is
  testable and keeps the contract in one place (constitution principle V leans
  on named contracts, and the existing code already centralizes routes).
- *Remove the authenticated-redirect entirely*: rejected; it would leave
  authenticated users staring at a login form (poor UX, violates FR-008).

---

### 4. How to render the state-aware header without a session "flash" (logged-out → logged-in)?

**Decision**: Resolve the session **server-side** in the root layout using the
existing Supabase server client (`@supabase/ssr` server helper established in
feature 001) and pass a boolean `authenticated` (+ email/initial when needed)
down to a client `HeaderAuth` component. The header renders the correct control
on first server render; the client component only handles the interactive
parts (click → navigate, sign-out action) and avoids re-deriving session.

**Rationale**: A server component layout reading cookies avoids the
"flash of unauthenticated content" because the initial HTML already contains
the correct header variant (satisfies FR-010 and SC-004). The sign-out path
reuses the existing `signOut` server action from feature 001.

**Alternatives considered**:
- *Pure client-side session with `useUser()`*: rejected; causes a visible
  logged-out flash while the client resolves the session (violates FR-010).
- *Client component that suspends on session*: rejected; adds a loading
  boundary where simpler server resolution suffices, and the constitution
  favors explicit server/client boundaries (Principle II).

---

### 5. Should the sign-out from the home header keep the user on the home page?

**Decision**: Yes. The `signOut` server action (feature 001) currently redirects
to `/` after logout; since `/` is now public, the user stays on the home page and
the header reverts to the login button on next render. No change to the action's
redirect target is needed — only the home page's protection status changes.

**Rationale**: Directly satisfies FR-011 and SC-006. Keeping the redirect target
as `/` reuses the existing behavior; the visible difference is that `/` is now
public, so the user is no longer bounced to `/login` after signing out.

**Alternatives considered**:
- *Redirect to `/login` after sign-out*: rejected; contradicts the user's request
  that the home page not force login and would feel regressive.

---

### 6. Are there new data entities or API contracts introduced by this iteration?

**Decision**: No new entities or server-action contracts. The only new concept is
a view-derived `HeaderAuthState` (transient, not persisted) described in the
spec's Key Entities. No new server actions are required: login navigation is a
client-side `<Link>`/router push to `/login`, and sign-out reuses the existing
`signOut` action from feature 001.

**Rationale**: This iteration is a routing + header-UI change. Reusing the
existing auth surface keeps the contract surface stable (constitution principle
V) and avoids scope creep. The existing `auth-server-actions` contract from
feature 001 is unchanged.

**Alternatives considered**:
- *Add a `getHeaderAuthState` server action*: rejected; the root layout can read
  session directly via the server client without a new action, and exposing
  session booleans as a "contract" over-rotates on principle V for UI state.

---

### 7. Testing strategy for the routing + header change.

**Decision**: Test at three layers, all via the existing vitest + Testing Library
stack:
1. **Unit (constants)**: assert `/` is in `PUBLIC_ROUTES` and `AUTH_PAGES`
   excludes `/`.
2. **Integration (middleware)**: assert redirect matrix — unauthenticated→`/`
   stays, unauthenticated→protected→`/login`, authenticated→`/login`→`/`,
   authenticated→`/` stays.
3. **Component (header)**: render `HeaderAuth` with `authenticated=false` →
   shows "Log in" button linking to `/login`; with `authenticated=true` → shows
   account control + sign-out; keyboard/label assertions for accessibility
   (FR-006).

**Rationale**: Honors the NON-NEGOTIABLE Test-First principle (IV): tests are
written first, then the routing/header changes make them green. Middleware is
the highest-risk change (SC-005), so it gets integration coverage.

**Alternatives considered**:
- *Playwright E2E only*: rejected as too coarse for the redirect matrix; kept for
  a single smoke that the full unauthenticated home render works end-to-end.