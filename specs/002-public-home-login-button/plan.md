# Implementation Plan: Public Home Page with Header Login Button

**Branch**: `002-public-home-login-button` | **Date**: 2026-07-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-public-home-login-button/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Make the home page (`/`) public so visitors are not forced to log in, and add a
state-aware authentication control to a shared site header: a "Log in" button
(top-right) for anonymous visitors, and an account indicator + sign-out control
for signed-in users. This iterates on the `001-user-login` feature by adding `/`
to the public routes allowlist, splitting "auth pages" from "public content
pages" in the middleware redirect logic, and moving the header chrome out of
the `Advisor` feature component into the root layout. No new data entities,
migrations, server actions, or API contracts are introduced — the existing
Supabase Auth surface and `signOut` action from feature 001 are reused.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict, no `any`)

**Primary Dependencies**: Next.js 15.5 (App Router), React 18.3, Supabase Auth
via `@supabase/ssr` (server + browser clients, established in feature 001),
Tailwind CSS 4 (the only styling system — constitution principle II), existing
`lucide-react` icons and `components/auth/UserAvatar`, `components/auth/SignOutButton`.

**Storage**: Supabase PostgreSQL sessions via HTTP-only cookies (`@supabase/ssr`).
No new tables/columns. See [data-model.md](data-model.md).

**Testing**: vitest + @testing-library/react (feature 001 stack). Three layers:
unit (constants), integration (middleware redirect matrix), component (`HeaderAuth`).
+ one Playwright smoke for the full unauthenticated home render.

**Target Platform**: Web — Vercel serverless; Next.js middleware runs on the Edge
runtime (already used by feature 001's `middleware.ts`).

**Project Type**: Web application (Next.js App Router, server + client components
with explicit boundaries).

**Performance Goals**: Header renders the correct auth variant on first server
paint within 1s on broadband (SC-002/SC-004); no logged-out→logged-in flash
(FR-010). Middleware adds no I/O beyond feature 001's existing `updateSession`.

**Constraints**:
- Session resolved **server-side** in the root layout to avoid a client flash
  (FR-010); client component only handles interactions (navigate, sign-out).
- Tailwind only — no inline styles unless Tailwind cannot express the case
  (constitution principle II); the existing `Advisor.tsx` uses inline styles and
  is out of scope to refactor here beyond removing its duplicated header.
- No `any` types; `unknown` + narrowing where needed (constitution principle II).
- Protected routes must stay protected (SC-005); the allowlist approach is
  retained (new routes protected by default).

**Scale/Scope**: Single Next.js app (`apps/web`). Diff-sized: one constants
change, one middleware logic change, one root-layout header addition, one
client `HeaderAuth` component, and removal of the home-grown header in
`Advisor.tsx`. No new packages (constitution principle I — no `packages/*` for
single-deployable code).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Monorepo & Turborepo Discipline | ✅ PASS | All changes live in `apps/web`; no new `packages/*` (single-deployable code stays colocated) |
| II. Type-Safe Full-Stack Web | ✅ PASS | TypeScript strict, no `any`; Tailwind only; explicit server/client boundary (root layout Server Component resolves session → `HeaderAuth` client component for interactions) |
| III. Supabase as the Data & Auth Backend | ✅ PASS | Reuses Supabase Auth + `@supabase/ssr` session cookies from feature 001; no bespoke auth; no DB/migration changes |
| IV. Test-First Development (NON-NEGOTIABLE) | ✅ PASS | Tests written first (constants unit, middleware integration matrix, `HeaderAuth` component) then implementation to green; `pnpm lint && pnpm typecheck && pnpm test && pnpm build` is the gate |
| V. Contract-Driven APIs | ✅ N/A | No new HTTP/RPC contracts or server actions; navigation is client-side and sign-out reuses feature 001's existing `signOut` contract. A UI contract is documented in [contracts/header-auth-ui.md](contracts/header-auth-ui.md) for testability |

**Post-Phase-1 Re-check**: Design introduces no new persisted entities (data-model.md),
reuses feature 001's contracts, and documents a UI contract only. No constitutional
violations. **Result**: GATE PASSED — no violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-public-home-login-button/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── header-auth-ui.md # Phase 1 output — UI + routing contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   ├── layout.tsx              # MODIFIED — add shared <SiteHeader /> (server-resolves session)
│   ├── page.tsx                # home page (unchanged route; Advisor rendered inside)
│   ├── (auth)/                 # existing auth pages (unchanged)
│   ├── (authenticated)/        # existing gated pages (unchanged)
│   └── auth/callback/route.ts  # unchanged
├── components/
│   ├── layout/
│   │   └── site-header.tsx     # NEW — server component shell: logo + <HeaderAuth authenticated email />
│   └── auth/
│       ├── header-auth.tsx     # NEW — client component: login button (logged-out) / account + sign-out (logged-in)
│       ├── user-avatar.tsx     # reuse (feature 001)
│       └── sign-out-button.tsx # reuse (feature 001)
├── features/
│   └── advisor/
│       └── Advisor.tsx         # MODIFIED — remove the baked-in <header> (chrome moves to root layout)
├── lib/
│   ├── supabase/
│   │   └── server.ts            # reuse — server client used by root layout to read session
│   └── constants.ts            # MODIFIED — add AUTH_PAGES; add '/' to PUBLIC_ROUTES
└── middleware.ts               # MODIFIED — split authenticated-redirect to use AUTH_PAGES (not PUBLIC_ROUTES)

tests/
├── lib/
│   └── constants.test.ts        # NEW — '/' ∈ PUBLIC_ROUTES; AUTH_PAGES excludes '/'
├── middleware.test.ts          # NEW — redirect matrix (integration)
└── components/
    └── header-auth.test.tsx    # NEW — logged-out/login-button & logged-in/account+signout & a11y
```

**Structure Decision**: Web application pattern (Next.js App Router). The shared
site header is added to the root `app/layout.tsx` (a Server Component) so it
appears on every page and resolves session server-side to avoid a client flash.
The auth control is a small client component (`components/auth/header-auth.tsx`)
for interactivity only, keeping the server/client boundary explicit (constitution
principle II). Route protection stays centralized in `middleware.ts` +
`lib/constants.ts` (allowlist), unchanged in approach from feature 001 — only the
set memberships and the authenticated-redirect target set are refined. No new
`packages/*` entries (constitution principle I).

## Complexity Tracking

> No constitutional violations to justify — section left empty.