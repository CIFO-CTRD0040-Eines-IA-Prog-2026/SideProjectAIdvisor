# Data Model: Public Home Page with Header Login Button

**Feature**: 002-public-home-login-button
**Spec**: [spec.md](spec.md)

This iteration introduces **no new persisted entities**. It reuses the **User**
and **Session** entities defined in `specs/001-user-login/data-model.md`, which
are managed by Supabase Auth (`auth.users`) and persisted as HTTP-only cookies
via `@supabase/ssr`.

The only new concept is a **view-derived, non-persisted** state used to decide
which header control renders.

## Entities

### HeaderAuthState *(view-derived, not persisted)*

A transient state computed during server render of the root layout, used to
select the header auth control. Not stored; recomputed on each request.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `authenticated` | boolean | Whether a valid session cookie is present | Derived from Session (Supabase server client) |
| `email` | string \| null | The signed-in user's email, when authenticated | Derived from User |

**Relationships**: Derived from **Session** → **User** (defined in feature 001).
No relationships are created or modified.

## Validation Rules

No persisted-field validation is added by this iteration. The only "validation"
is the routing predicate performed by middleware (an allowlist membership test,
not a data rule):

| Check | Rule | FR Reference |
|-------|------|--------------|
| Home is public | `/` MUST be a member of `PUBLIC_ROUTES` | FR-001 |
| Auth-page redirect | Authenticated user at a route in `AUTH_PAGES` → redirect to `/` | FR-008 |
| Protected routes | Unauthenticated user at a route NOT in `PUBLIC_ROUTES` → redirect to `/login` | FR-007 |

## State Transitions

No persisted state transitions are added. The header control transitions follow
session state:

```
[Unauthenticated] (no Session)            → header shows "Log in" button   (FR-002/004)
    → (user clicks Log in) →              → login page                    (FR-003)
    → (user signs in elsewhere) → Session → header shows account control  (FR-004/012)

[Authenticated] (Session present)          → header shows account control  (FR-004)
    → (user clicks sign out) → Session end → header reverts to "Log in"    (FR-011)
    → (session expires) → no Session       → header reverts to "Log in"    (FR-003 edge / User Story 3)
```

## Database / Migrations

None. No table, column, RLS policy, or migration is added or changed by this
iteration. Auth data remains entirely in `auth.users` and session cookies as
established by feature 001.