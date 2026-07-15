# Feature Specification: Public Home Page with Header Login Button

**Feature Branch**: `002-public-home-login-button`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "update feature login, home page show not force to log in , should have a login button at top right or in an area better fit"

**Amends**: `specs/001-user-login/spec.md` (User Login). This iteration changes the home page from a forced-login route to a public route and adds a header login affordance.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visitor Reaches Home Without Logging In (Priority: P1)

A first-time visitor arrives at the site (root URL). They want to see what the product offers and try the core experience without being forced to create an account or sign in first. The home page loads immediately and fully — no redirect to a login page — so they can explore the value before committing.

**Why this priority**: Removing the forced-login gate is the core change requested. Today an unauthenticated visitor to `/` is redirected to `/login`, which blocks all exploration. Making the landing experience public is the prerequisite for every other story in this iteration.

**Independent Test**: Can be fully tested by opening a fresh private browser session (no session cookies), navigating to the root URL, and verifying the page renders the full home experience with no redirect to `/login`.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor (no session cookie), **When** they navigate to the root URL `/`, **Then** the home page renders fully and they are NOT redirected to `/login`.
2. **Given** an unauthenticated visitor on the home page, **When** they interact with the core home experience (e.g., submit the job-offer form), **Then** it works without requiring sign-in for the public-facing functionality.
3. **Given** an authenticated user, **When** they navigate to `/`, **Then** they also reach the home page (authenticated users are not bounced away from home).

---

### User Story 2 - Visitor Sees a Login Button in the Header (Priority: P1)

A visitor on the public home page wants a clear, obvious way to sign in when they are ready. A "Log in" button is present in the header (top-right area, consistent with common web conventions) so the entry point to authentication is always one click away without interrupting the exploration experience.

**Why this priority**: The login button is the explicit deliverable the user requested alongside the public home page. It restores the path to authentication without forcing it.

**Independent Test**: Can be fully tested by loading the home page as an unauthenticated visitor and verifying a visible, clickable "Log in" control exists in the header that navigates to the login page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor is on the home page, **When** the page loads, **Then** a "Log in" button is visible in the header area (top-right region) without scrolling.
2. **Given** an unauthenticated visitor clicks the "Log in" button, **When** the navigation completes, **Then** they arrive at the login page.
3. **Given** a visitor on a narrow/mobile viewport, **When** the home page header renders, **Then** the "Log in" control remains visible and accessible (it does not get clipped or hidden on mobile).

---

### User Story 3 - Authenticated User Sees Account Control Instead of Login Button (Priority: P2)

A returning, signed-in user visits the home page. Instead of a "Log in" button, the header shows who they are (account indicator such as an avatar or email initial) and a way to sign out. The header adapts to the user's authentication state so authenticated users do not see a redundant login prompt and can end their session from the home page.

**Why this priority**: State-aware navigation is important for a coherent experience but is secondary to making the page reachable and adding the login button.

**Independent Test**: Can be fully tested by signing in, navigating to the home page, and verifying the header shows the account control (not a login button), and that signing out from the header returns the user to the public home state.

**Acceptance Scenarios**:

1. **Given** an authenticated user is on the home page, **When** the header renders, **Then** it shows an account indicator (e.g., avatar/email initial) instead of a "Log in" button.
2. **Given** an authenticated user clicks the sign-out control in the header, **When** the sign-out completes, **Then** they remain on the home page and the header switches back to showing the "Log in" button.
3. **Given** the session expires while the user is on the home page, **When** the page re-evaluates session state, **Then** the header gracefully reverts to the logged-out state (login button) without error.

---

### User Story 4 - Authenticated Users Are Not Redirected Away from Auth Pages (Priority: P3)

Today the middleware redirects authenticated users who visit public auth routes (login, signup) to the home page. With the home page now public, this behavior must be reviewed so authenticated users are not caught in awkward redirects, and the auth pages remain reachable only where it makes sense.

**Why this priority**: This is a refinement of the existing routing logic to stay consistent with the new public-home model; it is not required for the core public-home + login-button value to land.

**Independent Test**: Can be fully tested by signing in, then directly navigating to the login page, and verifying the redirect behavior is intentional and does not loop or break navigation.

**Acceptance Scenarios**:

1. **Given** an authenticated user navigates to `/login` directly, **When** the route evaluates, **Then** they are redirected to the home page (authenticated users have no reason to see the login form).
2. **Given** an authenticated user navigates to `/signup` directly, **When** the route evaluates, **Then** they are redirected to the home page.
3. **Given** an unauthenticated user navigates to a protected (non-public) route, **When** the route evaluates, **Then** they are still redirected to `/login` as before — protected routes remain protected.

---

### Edge Cases

- What happens when the session cookie is present but invalid/expired on first load of the home page?
- How does the header behave during the brief moment between page load and session resolution (flash of logged-out then logged-in state)?
- What happens when a visitor on the home page clicks "Log in", signs in, and is redirected back — does the header update to the authenticated state?
- How is the login button rendered if the home page is loaded with slow/janky session resolution (server vs client session)?
- What is the accessible name/label and keyboard focus behavior of the login button and account control for screen-reader users?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page (root URL `/`) MUST be accessible to unauthenticated visitors without redirecting to the login page.
- **FR-002**: The system MUST display a "Log in" button in the header of the public home page, positioned in the top-right region (or the area that best fits the existing header design and responsive layout).
- **FR-003**: Clicking the "Log in" button MUST navigate the visitor to the login page.
- **FR-004**: The header MUST be state-aware: it shows a "Log in" button when no user is signed in, and an account indicator (e.g., avatar/email initial) with a sign-out control when a user is signed in.
- **FR-005**: The "Log in" button and account control MUST remain visible and usable across supported viewport sizes (desktop and mobile).
- **FR-006**: The header login/account control MUST be reachable via keyboard and have an accessible name/label for assistive technology.
- **FR-007**: Protected (non-public) routes MUST still redirect unauthenticated users to the login page — the public status of the home page MUST NOT reduce protection on other protected routes.
- **FR-008**: Authenticated users visiting the login or sign-up pages MUST be redirected to the home page (existing behavior preserved).
- **FR-009**: The public home experience (the core product value shown on the home page) MUST remain usable to unauthenticated visitors without requiring sign-in.
- **FR-010**: The header MUST avoid a visible "flash" of incorrect session state on load wherever the rendering model allows; where a brief client-side resolution is unavoidable, the transition MUST be graceful (no broken layout or errors).
- **FR-011**: After signing out from the header control on the home page, the user MUST remain on the home page and the header MUST revert to the logged-out (login button) state.
- **FR-012**: After signing in via the login page, an authenticated user returning to the home page MUST see the authenticated header state.

### Key Entities *(include if feature involves data)*

This iteration introduces no new data entities. It reuses the existing **User** and **Session** entities defined in `specs/001-user-login/spec.md`. The only new concept is a header UI state derived from session presence:

- **HeaderAuthState**: A transient, view-derived state (not persisted) representing which header control to show. Key attributes: `authenticated` (boolean), derived from the current session. Relationships: derived from **Session**.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated visits to the root URL `/` render the home page with no redirect to `/login` (zero forced-login gate on the home page).
- **SC-002**: The "Log in" button is visible on first paint of the home page header (in the top-right region) within 1 second on a standard broadband connection, with no horizontal scrolling required on mobile.
- **SC-003**: 100% of unauthenticated visitors who click the "Log in" button reach the login page in a single navigation step.
- **SC-004**: At least 95% of authenticated sessions show the correct account control (not the login button) on the home page header within 1 second of load.
- **SC-005**: Zero protected (non-public) routes become accessible to unauthenticated users as a result of making the home page public — existing protection is fully preserved.
- **SC-006**: After sign-out from the home page header, 100% of cases remain on the home page with the header reverting to the login button.

## Assumptions

- The authentication infrastructure (sign-up, log-in, log-out, password reset) is already specified and planned in `specs/001-user-login`; this iteration only changes which routes are public and adds a header login affordance — it does not redefine auth flows.
- The home page's core experience (the advisor tool) is already usable by unauthenticated visitors; this iteration assumes no backend gating beyond route protection was forcing auth on the home content itself.
- The existing root layout or a new shared header is the appropriate place to host the state-aware login/account control; placing it in the shared layout (rather than only inside the Advisor component) is preferred so it applies consistently.
- "Top-right or an area better fit" is resolved to: the top-right region of the shared site header, consistent with common web conventions, adapting for mobile where the header is compact.
- Session state is available to drive header rendering via the existing server-side Supabase session resolution (established in feature 001); a brief client-side resolution may occur but must degrade gracefully.
- Social log-in, profile management, and email verification remain out of scope (as in feature 001).