# Research: User Login Feature

## Overview

Research findings for implementing email/password authentication in the existing Next.js application using Supabase Auth.

## Technology Decisions

### Auth Provider: Supabase Auth

- **Decision**: Use Supabase Auth for all authentication flows
- **Rationale**: Project constitution mandates Supabase as the auth backend (Principle III). Supabase Auth provides built-in email/password auth, session management, password reset flow, and Row-Level Security integration — eliminating the need for custom auth infrastructure.
- **Alternatives considered**: Clerk, NextAuth.js, custom JWT — all rejected per constitution requirement.

### Auth Client: @supabase/ssr

- **Decision**: Use `@supabase/ssr` package for server-side cookie-based session management
- **Rationale**: The recommended approach for Next.js App Router. Provides `createBrowserClient` for client components, `createServerClient` for server components and route handlers, and middleware helpers for session refresh.
- **Alternatives considered**: Using `@supabase/supabase-js` directly with manual cookie handling — `@supabase/ssr` is the maintained, idiomatic choice.

### Session Strategy: Cookie-based (HTTP-only)

- **Decision**: Store Supabase Auth session in HTTP-only cookies via `@supabase/ssr`
- **Rationale**: Supabase Auth uses JWTs stored in cookies by default when configured with `@supabase/ssr`. Cookies are automatically sent with requests, eliminating manual token management on the client. HTTP-only flag prevents XSS token theft.
- **Alternatives considered**: localStorage-based token storage — less secure (XSS vulnerable), not suitable for server components.

### Route Protection: Next.js Middleware

- **Decision**: Use Next.js `middleware.ts` to check session and redirect unauthenticated users
- **Rationale**: Middleware runs at the edge before a request reaches a page, allowing centralized route protection without per-page checks. Supabase provides middleware examples that refresh the session on every request.
- **Alternatives considered**: Per-page session checks in layouts — more repetitive, pages could flash before redirect.

### Form UI: Server Actions

- **Decision**: Implement auth forms using Next.js Server Actions
- **Rationale**: Server Actions run on the server, avoiding client-side API calls for form submission. This aligns with the App Router pattern and keeps auth logic server-side.
- **Alternatives considered**: Client-side fetch to API routes — adds unnecessary network hop, more boilerplate.

### Testing: vitest + @testing-library/react

- **Decision**: Use vitest with @testing-library/react for component and action tests
- **Rationale**: Industry-standard for Next.js + TypeScript projects. Fast, TypeScript-native, compatible with React Testing Library for component testing.
- **Alternatives considered**: Jest — slower, more configuration; Playwright — better for E2E but heavier for unit/component tests.

## Supabase Auth Integration Patterns

### Sign-Up Flow
1. Client form collects email + password
2. Server Action calls `supabase.auth.signUp({ email, password })`
3. Supabase creates user in `auth.users`, returns session (if auto-confirm enabled) or sends confirmation email
4. Server Action sets session cookies via `@supabase/ssr`

### Login Flow
1. Client form collects email + password
2. Server Action calls `supabase.auth.signInWithPassword({ email, password })`
3. Supabase validates credentials, returns session
4. Server Action sets session cookies via `@supabase/ssr`
5. Client redirects to authenticated home

### Logout Flow
1. User clicks sign-out button
2. Server Action calls `supabase.auth.signOut()`
3. Server Action clears session cookies
4. Client redirects to public home

### Password Reset Flow
1. User requests reset on forgot-password page
2. Server Action calls `supabase.auth.resetPasswordForEmail(email)`
3. Supabase sends email with reset link (points to `auth/callback?redirect_to=/update-password`)
4. User clicks link, is redirected to update-password page
5. Supabase Auth processes the recovery token via the callback route
6. User sets new password via `supabase.auth.updateUser({ password })`

## Route Protection Pattern

```
middleware.ts:
  - Read session cookie
  - If no session and route is in protected list → redirect to /login
  - If session exists → refresh token, set new cookie, allow request
  - Skip middleware for: /login, /signup, /reset-password, /auth/callback, public assets
```
