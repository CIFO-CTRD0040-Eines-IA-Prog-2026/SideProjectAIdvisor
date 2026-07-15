<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Bump rationale: MAJOR — initial roadmap creation

Changes this revision:
  - Created initial roadmap with 1 planned spec entry (001-user-login)

Specs affected: 001
Open questions added/resolved: 3 open questions added

Notes: Initial roadmap created from constitution principles and session context.
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
- **Notes:** Spec, plan, and tasks are complete. 41 tasks, 0 of 41 completed. MVP scope is sign-up only (15 tasks, waves 1–3).

### 002 — Job Offer Analyzer  [status: undecided]

- **Description:** The core feature — analyze a job offer URL or webhook payload and generate an optimal tech stack recommendation plus three side project proposals (Easy, Medium, Hard), each with open-source tools, production readiness checklist, code complexity, and infrastructure complexity.
- **Outcome:** *To be defined — spec not yet written.*
- **Scope (in):** *To be defined.*
- **Scope (out):** *To be defined.*
- **Depends on:** 001 (requires authenticated user context).
- **Governed by:** C-02 (Next.js/React), C-03 (Supabase/Postgres), C-04 (TDD).
- **Notes:** Originally discussed during project initiation but not yet specified. Needs scoping and clarification before moving to `planned`.

## Open Questions

- **Q-01 — Project end states beyond V-01 and V-02:** What additional outcomes should the project deliver (e.g., multi-tenant SaaS, analytics dashboard, resume analysis)? Not yet defined.
- **Q-02 — Spec sequencing after 001 and 002:** Are there additional features planned beyond User Login and Job Offer Analyzer? For example: email integration, payment/subscription model, admin dashboard, API for third-party integrations.
- **Q-03 — AI model provider strategy:** The Job Offer Analyzer requires LLM-based analysis. Which provider(s) should be supported (OpenAI, Anthropic, open-source self-hosted)? This affects cost, latency, and data privacy decisions.

## Cross-Cutting Notes

- The project follows the Spec-Driven Development workflow (`/speckit.spec` → `/speckit.plan` → `/speckit.tasks` → implement). Skipping any stage is forbidden beyond typo fixes.
- All diagrams (workflow, status, dependencies) are maintained in `README.md` under their respective SDD sections.

---

**Version**: 1.0.0 | **Ratified**: 2026-07-15 | **Last Amended**: 2026-07-15
