# Implementation Plan: User Login

**Branch**: `001-user-login` | **Date**: 2026-07-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-user-login/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Add email/password authentication to the existing Next.js application using Supabase Auth. Users can sign up, log in, log out, and reset forgotten passwords. Authenticated sessions persist across browser restarts; protected routes redirect unauthenticated users to the login page.

## Technical Context

**Language/Version**: TypeScript 5.8

**Primary Dependencies**: Next.js 15.5 (App Router), React 18.3, Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`), Tailwind CSS 4, Radix UI / MUI components for form UI

**Storage**: Supabase PostgreSQL (auth.users table managed by Supabase Auth; sessions handled via cookies by `@supabase/ssr`)

**Testing**: vitest + @testing-library/react (standard Next.js testing stack; to be configured if not present)

**Target Platform**: Web — Vercel serverless runtime (Edge-supported routes for auth middleware)

**Project Type**: Web application (Next.js App Router with server components)

**Performance Goals**: Auth pages load in under 3 seconds; form submission (login/signup) responds within 2 seconds

**Constraints**: Session-based auth using HTTP-only cookies; Supabase Row-Level Security for future data access; no custom API routes needed — Supabase Auth handles all auth logic

**Scale/Scope**: Single Next.js application; auth flows managed entirely through Supabase Auth client SDK; no separate backend service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Monorepo & Turborepo Discipline | ✅ PASS | Feature lives entirely inside `apps/web`; no new packages needed |
| II. Type-Safe Full-Stack Web | ✅ PASS | TypeScript strict mode, Next.js App Router, Tailwind CSS, no `any` types |
| III. Supabase as the Data & Auth Backend | ✅ PASS | Uses Supabase Auth explicitly; no bespoke auth solution |
| IV. Test-First Development (NON-NEGOTIABLE) | ✅ PASS | Tests will be written before implementation (vitest + testing-library) |
| V. Contract-Driven APIs | ✅ N/A | Auth is handled entirely by Supabase Auth SDK; no custom API contracts needed |

**Result**: GATE PASSED — no constitutional violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-login/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── update-password/
│   │       └── page.tsx
│   ├── (authenticated)/
│   │   └── layout.tsx          # checks session, redirects to login if unauthenticated
│   └── auth/
│       └── callback/route.ts   # handles auth redirects (password reset, email confirm)
├── components/
│   └── auth/
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       ├── forgot-password-form.tsx
│       └── auth-header.tsx     # sign-out button, user avatar/email display
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # browser Supabase client
│   │   ├── server.ts           # server-side Supabase client (cookies)
│   │   └── middleware.ts       # session refresh middleware
│   └── auth-actions.ts         # server actions for login, signup, logout, reset
├── middleware.ts               # Next.js middleware: refresh session, protect routes
└── styles/
    └── auth.css                # minimal auth page styling (or use Tailwind directly)

tests/
├── auth/
│   ├── login-form.test.tsx
│   ├── signup-form.test.tsx
│   └── auth-actions.test.ts
└── setup.ts                    # vitest setup with Supabase mock
```

**Structure Decision**: Web application pattern (Option 2) adapted for Next.js App Router. Auth routes use route groups `(auth)` for public auth pages and `(authenticated)` for gated pages. Feature code is placed under `features/auth/` (following existing `features/advisor/` pattern) or directly under `components/auth/` and `lib/` as shown.

## Complexity Tracking

> *No constitutional violations to justify — section left empty.*
