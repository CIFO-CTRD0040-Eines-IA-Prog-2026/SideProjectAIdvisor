# Feature Specification: User Login

**Feature Branch**: `001-user-login`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "login feature to current nextjs use supabase"

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

### User Story 1 - Sign Up with Email and Password (Priority: P1)

A new visitor to the site wants to create an account. They navigate to a sign-up page, enter their email address and a password, and submit. The system creates their account and logs them in automatically.

**Why this priority**: Account creation is the prerequisite for all other auth flows. Without sign-up, no user can log in.

**Independent Test**: Can be fully tested by navigating to the sign-up page, submitting a valid email and password, and verifying the user is redirected to the authenticated home page with a success confirmation.

**Acceptance Scenarios**:

1. **Given** a visitor is on the sign-up page, **When** they enter a valid email and a password meeting the strength requirements and click submit, **Then** their account is created and they are automatically signed in.
2. **Given** a visitor submits a sign-up form, **When** the email is already registered, **Then** a clear error message is displayed saying the email is already in use.
3. **Given** a visitor submits a sign-up form, **When** the password does not meet minimum requirements, **Then** inline validation feedback shows the password requirements.
4. **Given** a visitor submits a sign-up form with an invalid email format, **When** the form is validated, **Then** an error message indicates the email is invalid.

---

### User Story 2 - Log In with Email and Password (Priority: P1)

An existing user returns to the site and wants to access their account. They go to the login page, enter their credentials, and are signed in.

**Why this priority**: Log-in is the most frequent auth action and the primary gate to protected functionality.

**Independent Test**: Can be fully tested by navigating to the login page, entering valid credentials, and verifying the user reaches the authenticated home page.

**Acceptance Scenarios**:

1. **Given** a registered user is on the login page, **When** they enter their correct email and password and click submit, **Then** they are signed in and redirected to the authenticated home page.
2. **Given** a user submits the login form, **When** they enter an incorrect password, **Then** an error message says "Invalid email or password" without revealing which field is wrong.
3. **Given** a user submits the login form, **When** they enter an email that is not registered, **Then** the same generic error is shown ("Invalid email or password").
4. **Given** a user who is already signed in visits the login page, **When** the page loads, **Then** they are automatically redirected to the authenticated home page.

---

### User Story 3 - Log Out (Priority: P2)

A signed-in user wants to end their session. They click a log-out button and are signed out, then redirected to the public home page.

**Why this priority**: Log-out is essential for security and account switching, but the core value (accessing the app) is already delivered by sign-up and log-in.

**Independent Test**: Can be fully tested by signing in, clicking the log-out button, and verifying the user is redirected to the public home page and cannot access protected pages without re-authenticating.

**Acceptance Scenarios**:

1. **Given** a signed-in user clicks the log-out button, **When** the action completes, **Then** the user is signed out and redirected to the public home page.
2. **Given** a signed-out user, **When** they try to access a protected page directly by URL, **Then** they are redirected to the login page.

---

### User Story 4 - Reset Forgotten Password (Priority: P3)

A user who has forgotten their password wants to regain access. They click "Forgot password", enter their email, receive a reset link, and set a new password.

**Why this priority**: Password reset is important for user retention but is an edge flow compared to regular log-in.

**Independent Test**: Can be fully tested by requesting a password reset, receiving the reset link, setting a new password, and logging in with the new credentials.

**Acceptance Scenarios**:

1. **Given** a user is on the login page, **When** they click "Forgot password" and enter their registered email, **Then** they receive a confirmation message that a reset link has been sent.
2. **Given** a user clicks a valid password reset link, **When** they enter a new password meeting requirements, **Then** the password is updated and they are signed in.
3. **Given** a user clicks an expired or invalid reset link, **When** they attempt to use it, **Then** an error message is displayed and they are prompted to request a new link.

---

### Edge Cases

- What happens when the user submits an empty email or password field?
- How does the system handle concurrent login attempts from the same account (throttling/rate limiting)?
- What happens if the email delivery service for password reset is down?
- How are sessions handled when the user closes the browser without logging out?
- What happens when a user attempts to sign up with a disposable/temporary email address?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Visitors MUST be able to create an account with an email address and password.
- **FR-002**: The system MUST validate that email addresses are in a valid format before accepting them.
- **FR-003**: The system MUST enforce a minimum password strength (minimum length, character variety) during account creation and password reset.
- **FR-004**: Registered users MUST be able to log in with their email and password.
- **FR-005**: The system MUST display a generic "Invalid email or password" error on failed login attempts — not reveal which field is incorrect.
- **FR-006**: Signed-in users MUST be able to log out, which ends their session.
- **FR-007**: The system MUST protect designated pages/routes from unauthenticated access by redirecting to the login page.
- **FR-008**: Users MUST be able to request a password reset by entering their registered email address.
- **FR-009**: The system MUST send a time-limited password reset link to the user's email upon request.
- **FR-010**: Users MUST be able to set a new password using a valid reset link.
- **FR-011**: Already authenticated users visiting the login or sign-up pages MUST be redirected to the authenticated home page.
- **FR-012**: The system MUST persist user sessions across browser restarts (remember session).
- **FR-013**: The system MUST rate-limit login attempts per IP address to prevent brute-force attacks.
- **FR-014**: The system MUST rate-limit password reset requests per email address to prevent abuse.

### Key Entities *(include if feature involves data)*

- **User**: Represents a registered account. Key attributes: unique email address, password hash, account creation date, last sign-in date.
- **Session**: Represents an authenticated browser session linked to a User. Key attributes: session token, creation time, expiry time, associated user ID.
- **PasswordResetToken**: A time-limited token used to authorize password changes. Key attributes: token value, associated user ID, creation time, expiry time, consumed flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the full sign-up flow (enter email, enter password, submit, and reach the authenticated home page) in under 60 seconds.
- **SC-002**: A returning user can complete the log-in flow in under 15 seconds.
- **SC-003**: At least 99% of valid sign-up and login attempts succeed on the first submission (excluding intentional wrong-password tests).
- **SC-004**: The system correctly blocks unauthenticated access to every protected page — zero bypass scenarios.
- **SC-005**: A password reset can be completed (request → receive link → set new password → log in) in under 5 minutes end-to-end.
- **SC-006**: Brute-force protection activates after 5 failed login attempts from the same IP, blocking further attempts for at least 15 minutes.

## Assumptions

- Email delivery for password reset links is handled by an existing transactional email service; this spec does not cover email infrastructure setup.
- The application already has a designated authenticated layout and public layout; this spec covers the auth pages and session logic only.
- Social log-in (Google, GitHub, etc.) is out of scope for v1 — only email/password authentication is included.
- Email verification after sign-up is not required in v1 (users can log in immediately after registering).
- User profile management (edit name, avatar, change email) is out of scope for this spec and will be handled separately.
- The application uses session-based auth (cookies) rather than token-based auth (JWT in headers) for the web UI.
