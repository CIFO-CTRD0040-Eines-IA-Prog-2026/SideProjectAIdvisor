# Contract: Header Auth Control (UI Contract)

**Feature**: 002-public-home-login-button
**Spec**: [spec.md](../spec.md)

This is a **user-facing UI contract** for the shared site header's
authentication control. This iteration introduces no new HTTP/API contracts or
server actions — navigation to `/login` is a client-side route and sign-out
reuses the existing `signOut` server action from `specs/001-user-login/contracts/auth-server-actions.md`.

The contract documents the observable behavior of the `HeaderAuth` control so
frontend and tests can verify it independently.

## Component

### `HeaderAuth`

Renders inside the shared root layout header. Receives server-resolved state and
exposes two interactive affordances depending on session state.

**Props (server-resolved, passed from the root layout Server Component)**:

| Prop | Type | Description |
|------|------|-------------|
| `authenticated` | `boolean` | Whether a valid session is present (server-resolved) |
| `email` | `string \| null` | Signed-in user's email; required when `authenticated` is true |

**Visible states**:

| State | `authenticated` | Renders | FR |
|-------|-----------------|---------|----|
| Logged-out | `false` | "Log in" button linking to `/login` | FR-002, FR-003 |
| Logged-in | `true` | Account indicator (avatar / email initial) + sign-out control | FR-004, FR-011 |

## Behaviors

### Logged-out → "Log in" button

- Visible in the header top-right region on first server render (no client flash).
- An accessible name/label (e.g., `aria-label="Log in"`) is present (FR-006).
- Keyboard reachable; activates on Enter/Space (FR-006).
- Activation navigates to `/login` (a single navigation step) (FR-003, SC-003).
- Remains visible and usable on mobile viewports (FR-005, SC-002).

**Success (observable)**:

```json
{ "control": "login-button", "navigatesTo": "/login", "firstPaint": "server-rendered" }
```

### Logged-in → account control + sign-out

- Shows an account indicator derived from `email` (initial or avatar) (FR-004).
- Sign-out control activates the existing `signOut` server action (feature 001).
- After sign-out completes, the user remains on `/` and the control reverts to
  the "Log in" button (FR-011, SC-006).
- Both controls are keyboard reachable with accessible labels (FR-006).

**Success (observable)**:

```json
{ "control": "account-and-signout", "signOutAction": "signOut (feature 001)", "postSignOut": "stayOn / , revert to login-button" }
```

### Error / edge states

| Condition | Observable behavior | FR |
|-----------|----------------------|----|
| Session cookie present but invalid/expired at render | Server resolves `authenticated=false` → renders "Log in" button (graceful) | FR-010, User Story 3 |
| `authenticated=true` but `email` missing | Must not crash; render a generic account indicator with a fallback label | FR-004 |
| Client-side session re-resolution after load | No full logged-out→logged-in flash; transition is graceful | FR-010, SC-004 |

## Routing Contract (middleware)

The middleware redirect matrix is part of the contract for this iteration:

| Requested pathname | User session | Result | FR/SC |
|--------------------|--------------|--------|-------|
| `/` | none | render home (no redirect) | FR-001, SC-001 |
| `/` | present | render home (no redirect) | User Story 1.3 |
| `/login`, `/signup`, `/reset-password`, `/update-password` | none | render page | FR-008 |
| `/login`, `/signup`, `/reset-password`, `/update-password` | present | redirect to `/` | FR-008, User Story 4 |
| any other (protected) | none | redirect to `/login` | FR-007, SC-005 |
| any other (protected) | present | render page | FR-007 |

**Constants contract** (`apps/web/src/lib/constants.ts`):

- `PUBLIC_ROUTES` MUST include `/` plus the auth routes from feature 001.
- `AUTH_PAGES` MUST be the subset `{ /login, /signup, /reset-password, /update-password }`
  used only for the authenticated-redirect branch (excludes `/`).

## Out of scope

- No new server actions, no new HTTP endpoints, no new database queries.
- The existing `auth-server-actions` contract (feature 001) is unchanged.