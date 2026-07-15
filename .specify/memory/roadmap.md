<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.1.1
Bump rationale: PATCH — two status transitions, no structural additions.

Changes this revision:
  - Transitioned 003 — Public Home Page with Header Login Button: specced → in-progress. The
    pre-implementation brief (specs/002-public-home-login-button/roadmap-reviews/brief-...md)
    recommended moving to in-progress as implementation begins.
  - Reconciled 001 — User Login: specced → in-progress. The brief's F1 finding observed that
    001's auth surface is already present in the codebase (auth pages, components, seed script,
    signOut action, Supabase clients, middleware, PUBLIC_ROUTES) even though the tasks checklist
    recorded 0/41 checked. in-progress is the honest status: real implementation exists but the
    full gate (quickstart scenarios + `pnpm lint && typecheck && test && build`) has not been
    confirmed, so neither `implemented` nor `verified` is justified yet.

Specs affected: 001 (status), 003 (status)
Open questions added/resolved: none; Q-01..Q-03 unchanged

Notes: Both changes are status transitions only (no new entries, no scope/outcome changes) →
PATCH bump. 002 unchanged.
-->

# SideProjectAIdvisor — Spec Roadmap

Living, non-binding map of the specs planned for SideProjectAIdvisor. It is **not a
commitment to order or scope** — it captures the spec-specific discussion,
decisions, technology choices, outcomes, and constraints surfaced during the
constitution and grilling phases so they are not lost before the spec that needs
them is written. Specs are scoped and clarified when they are actually started.
Foundations: the project [constitution](constitution.md).

Status legend (lifecycle): **undecided** · **needs-info** · **planned** ·
**specced** · **in-progress** · **implemented** · **verified** · **deferred** ·
**abandoned**.

---

## Vision & End States

<!-- Harvested from constitution/session context; user declined to expand further. -->

- **V-01 — Job-to-Proposal pipeline:** A candidate can submit a job offer URL (or send one via webhook) and receive a curated tech stack recommendation plus three distinct side project proposals (Easy, Medium, Hard) tailored to help them land that specific role.
- **V-02 — Self-service account management:** Users can create accounts, manage their session, and view their analysis history without requiring manual intervention.

*End states beyond these remain undefined. See Open Questions.*

## Constraints & Decisions

*Harvested from the constitution. Each constraint maps to a constitutional principle.*

- **C-01 — Monorepo & Turborepo Discipline:** pnpm-workspace monorepo with Turborepo; deployables under `apps/`, shared code under `packages/`. New packages require multi-deployable reuse. *(Constitution I)*
- **C-02 — Type-Safe Full-Stack Web:** Next.js (App Router), TypeScript strict, Tailwind CSS 4. No `any`, no CSS modules, explicit server/client boundaries. *(Constitution II)*
- **C-03 — Supabase as Data & Auth Backend:** Postgres, auth, and storage via Supabase. Versioned migrations, RLS on all user-owned tables, generated TypeScript types. *(Constitution III)*
- **C-04 — Test-First Development (NON-NEGOTIABLE):** TDD mandatory. Red-Green-Refactor cycle. Integration tests for new contracts and DB queries. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` must pass. *(Constitution IV)*
- **C-05 — Contract-Driven APIs:** OpenAPI specs in shared package; endpoints implemented only after spec review. Generated clients, no hand-coded fetch wrappers. SemVer breaks in spec package. *(Constitution V)*
- **C-06 — Conventional Commits & Release Discipline:** Squash merges only. Conventional commits (`feat:`, `fix:`, etc.). Changelog under `[Unreleased]`. Vercel deployment from main. Secrets never committed. *(Constitution: Conventions & Release)*

## Planned Specs

### 001 — User Login  [status: in-progress]

- **Description:** Add email/password authentication to the existing Next.js application using Supabase Auth. Users can sign up, log in, log out, and reset forgotten passwords.
- **Outcome:** A candidate can create an account, authenticate, and maintain a persistent session. Protected routes redirect unauthenticated users to the login page.
- **Scope (in):** Email/password sign-up, login, logout, password reset via email link, session persistence across restarts, route protection via middleware.
- **Scope (out):** Social login (Google, GitHub, etc.), email verification, user profile management, OAuth.
- **Depends on:** None — foundation-level feature.
- **Governed by:** C-03 (Supabase Auth), C-04 (TDD), C-06 (conventional commits).
- **Spec dir:** specs/001-user-login/
- **Notes:** Spec, plan, and tasks are complete. 41 tasks, 0 of 41 completed — design is done, implementation has not started (status reconciled `in-progress` → `specced` on 2026-07-15). MVP scope is sign-up only (15 tasks, waves 1–3). *Amended by 003* (the public-home / header-login-button iteration, which changes which routes 001 protects without redefining the auth flows).

### 002 — Job Offer Analyzer  [status: undecided]

- **Description:** The core feature — analyze a job offer URL or webhook payload and generate an optimal tech stack recommendation plus three side project proposals (Easy, Medium, Hard), each with open-source tools, production readiness checklist, code complexity, and infrastructure complexity.
- **Outcome:** *To be defined — spec not yet written.*
- **Scope (in):** *To be defined.*
- **Scope (out):** *To be defined.*
- **Depends on:** 001 (requires authenticated user context).
- **Governed by:** C-02 (Next.js/React), C-03 (Supabase/Postgres), C-04 (TDD).
- **Notes:** Originally discussed during project initiation but not yet specified. Needs scoping and clarification before moving to `planned`. **Numbering disambiguation (2026-07-15):** this `002` ledger ordinal is reserved for the Job Offer Analyzer and does *not* correspond to the `specs/002-public-home-login-button/` directory on disk — that directory is the 003 feature (a login-feature iteration), added after the roadmap-sync on 2026-07-15. The disk dir name and the ledger ordinal are allowed to differ; no rename of the disk dir is implied.

### 003 — Public Home Page with Header Login Button  [status: in-progress]

- **Description:** Make the home page (`/`) public so visitors are not forced to log in, and add a state-aware authentication control to a shared site header — a "Log in" button (top-right) for anonymous visitors, and an account indicator + sign-out control for signed-in users.
- **Outcome:** Unauthenticated visitors reach the home page with no forced-login redirect; a visible "Log in" button in the header links to the login page; authenticated users see an account indicator + sign-out and are not bounced off the public home; protected (non-public) routes remain protected.
- **Scope (in):** Add `/` to `PUBLIC_ROUTES`; split `AUTH_PAGES` (auth-only routes) from `PUBLIC_ROUTES` so authenticated users are redirected off auth pages but NOT off the public home; add a shared `SiteHeader` + `HeaderAuth` client component to the root layout; server-resolve the Supabase session in the layout to avoid a logged-out→logged-in flash; reuse the existing `signOut` action (no new server actions or contracts); remove the home-grown `<header>` baked into the `Advisor` feature component.
- **Scope (out):** Social login, profile management, email verification (unchanged from 001); no new data entities, migrations, server actions, or HTTP contracts; no new `packages/*`.
- **Depends on:** 001 — amends the login feature's routing (the home page's protection status and the auth-account control are reactions to 001's behavior).
- **Governed by:** C-02 (Next.js App Router, TypeScript strict, Tailwind-only, explicit server/client boundary), C-04 (Test-First via Playwright e2e, the user-specified test layer).
- **Spec dir:** specs/002-public-home-login-button/
- **Notes:** Added 2026-07-15 to absorb the orphan spec surfaced by `/speckit.roadmap.sync`. Design is complete (spec + plan + research + data-model + contracts/header-auth-ui + quickstart + 29 tasks); 0 of 29 tasks complete. Test layer is **Playwright e2e** at the user's explicit request (vitest is not installed in `@advisor/web`); existing `tests/e2e/login.spec.ts` has stale assertions this feature retires. The ledger ordinal (`003`) intentionally differs from the disk directory name (`002-public-home-login-button`) — spec directory names and ledger ordinals are independent; the ordinal was chosen to resolve the collision with the existing `002 — Job Offer Analyzer` entry. *Amends 001.*

## Open Questions

- **Q-01 — Project end states beyond V-01 and V-02:** What additional outcomes should the project deliver (e.g., multi-tenant SaaS, analytics dashboard, resume analysis)? Not yet defined.
- **Q-02 — Spec sequencing after 001 and 002:** Are there additional features planned beyond User Login and Job Offer Analyzer? For example: email integration, payment/subscription model, admin dashboard, API for third-party integrations.
- **Q-03 — AI model provider strategy:** The Job Offer Analyzer requires LLM-based analysis. Which provider(s) should be supported (OpenAI, Anthropic, open-source self-hosted)? This affects cost, latency, and data privacy decisions.

## Cross-Cutting Notes

- The project follows the Spec-Driven Development workflow (`/speckit.spec` → `/speckit.plan` → `/speckit.tasks` → implement). Skipping any stage is forbidden beyond typo fixes.
- All diagrams (workflow, status, dependencies) are maintained in `README.md` under their respective SDD sections.

---

**Version**: 1.1.1 | **Ratified**: 2026-07-15 | **Last Amended**: 2026-07-15
