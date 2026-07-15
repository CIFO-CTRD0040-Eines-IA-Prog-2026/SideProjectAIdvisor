<!--
Sync Impact Report
- Version change: (none) -> 1.0.0
- Modified principles: N/A (initial ratification; all principles new)
  - [PRINCIPLE_1_NAME] -> I. Monorepo & Turborepo Discipline
  - [PRINCIPLE_2_NAME] -> II. Type-Safe Full-Stack Web
  - [PRINCIPLE_3_NAME] -> III. Supabase as the Data & Auth Backend
  - [PRINCIPLE_4_NAME] -> IV. Test-First Development (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] -> V. Contract-Driven APIs
- Added sections:
  - "Conventions & Release Discipline" (was [SECTION_2_NAME])
  - "Development Workflow & Quality Gates" (was [SECTION_3_NAME])
  - "Governance" (formalized)
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md -> N/A (Constitution Check is dynamic; no hardcoded violations)
  - .specify/templates/spec-template.md -> N/A (no constitution-mandated section additions; placeholders remain generic)
  - .specify/templates/tasks-template.md -> N/A (TDD gating already represented via "Tests FIRST" notes; consistent with principle IV)
- Follow-up TODOs: none
-->

# SideProjectAIdvisor Constitution

## Core Principles

### I. Monorepo & Turborepo Discipline

- The project MUST be a single pnpm-workspace Turborepo monorepo.
- All deployables live under `apps/`; code reused across two or more
  deployables MUST live under `packages/`.
- A new `packages/*` entry MUST NOT be created for code used by only one
  deployable — colocate it in that app first.
- Every package MUST declare a clear, single responsibility and a typed
  entry point (`package.json` `exports`); organizational-only packages are
  forbidden.
- Turborepo task pipelines (`build`, `lint`, `typecheck`, `test`, `dev`)
  MUST be cached and declared in `turbo.json`; `workspace:*` is the only
  allowed protocol for internal dependencies.

**Rationale**: A screaming-architecture monorepo keeps features
discoverable, shared code DRY, and remote caching fast.

### II. Type-Safe Full-Stack Web

- The web deployable MUST be a Next.js (App Router) application built with
  TypeScript and React.
- TypeScript MUST run in `strict` mode with no per-file relaxations; `any`
  is forbidden (use `unknown` + narrowing).
- Tailwind CSS is the ONLY styling system; inline styles, CSS modules, and
  runtime style objects are forbidden unless Tailwind cannot express the
  case (justify inline).
- Server/client boundaries MUST be explicit: server-only logic stays in
  Server Components or route handlers; client interactivity is isolated to
  `"use client"` modules.

**Rationale**: One language, one styling system, and a strict type
boundary eliminate whole classes of runtime and integration bugs.

### III. Supabase as the Data & Auth Backend

- Postgres, auth, and storage MUST be provided by Supabase; direct
  third-party DBaaS or bespoke auth is forbidden.
- All SQL MUST be versioned in Supabase migrations; ad-hoc schema changes
  in the dashboard are forbidden.
- Row-Level Security (RLS) MUST be enabled on every table containing
  user-owned data; client queries MUST never assume a trusted server.
- TypeScript types for the database MUST be generated from Supabase
  (`supabase gen types typescript`) and consumed via the shared types
  package — hand-written row types are forbidden.

**Rationale**: Centralizing data, auth, and storage on one audited
platform keeps security boundaries consistent and types in sync with
reality.

### IV. Test-First Development (NON-NEGOTIABLE)

- Test-Driven Development is mandatory for all non-trivial code:
  write the failing test -> user approves the test -> then implement to
  green -> then refactor.
- The Red-Green-Refactor cycle MUST be followed in order; no
  implementation PR is accepted without a prior failing test.
- Integration tests MUST cover: new API contracts, contract changes,
  Supabase queries/migrations, and cross-package boundaries.
- A change is "done" only when `pnpm lint && pnpm typecheck && pnpm test &&
  pnpm build` all pass locally and in CI.

**Rationale**: Tests-as-specification prevent regressions, encode intent,
and keep the shared-package contracts honest.

### V. Contract-Driven APIs

- All HTTP/RPC contracts MUST be specified as OpenAPI/Swagger documents
  maintained in a shared package (e.g., `packages/api-specs`).
- A service endpoint MUST NOT be implemented or consumed before its
  OpenAPI spec exists and is reviewed.
- Generated clients and server stubs MUST be derived from those specs;
  hand-coded fetch wrappers that duplicate the contract are forbidden.
- Breaking contract changes MUST be represented by a SemVer bump of the
  spec package and called out in the changelog.

**Rationale**: A single source of truth for contracts prevents drift
between frontend and backend and enables automated contract testing.

## Conventions & Release Discipline

- **Conventional Commits** are mandatory: `feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`. Squash merges
  only; the squash title MUST be a valid conventional commit.
- **Branch naming**: `type/short-description` (e.g., `feat/user-auth`).
- **Changelog**: Every `feat:` and `fix:` commit MUST produce a
  user-facing entry in `CHANGELOG.md` under an `[Unreleased]` heading;
  releases cut a versioned section from `[Unreleased]`.
- **Deployment**: The app MUST deploy on Vercel via the repo's main
  branch; preview deployments are required for every PR before merge.
- **Environment**: Secrets MUST live in Vercel project env vars and local
  `.env.local`; committed secrets are a P0 incident and MUST be rotated.

## Development Workflow & Quality Gates

- **Local gates (pre-PR)**: `pnpm lint && pnpm typecheck && pnpm test &&
  pnpm build` MUST pass.
- **PR gates**: CI MUST run the same four commands on every push; a
  failing gate blocks merge.
- **Spec-Kit workflow**: New features follow
  `/speckit.spec` -> `/speckit.plan` -> `/speckit.tasks` -> implement;
  skipping the spec stage is forbidden for anything beyond a typo.
- **Code review**: At least one approving review is required; reviewers
  MUST verify requested behavior changed and the bug no longer reproduces.
- **Migration safety**: Supabase migrations MUST be forward-only and
  reversible; destructive migrations require an explicit approval note.

## Governance

- This Constitution supersedes all other project practices; conflicting
  guides MUST be amended to comply or the Constitution amended.
- **Amendments** require: a written proposal, documented migration plan,
  review, and a recorded ratification date; the version below MUST be
  bumped per SemVer (MAJOR on principle removal/redefinition, MINOR on
  new principle/material expansion, PATCH on wording/typo clarifications).
- **Compliance**: Every PR and review MUST verify alignment with the
  principles above; unresolved violations MUST be justified in the plan's
  "Complexity Tracking" table or the PR is rejected.
- For runtime, area-specific development guidance, read the matching file
  in `docs/` (frontend, backend, database, AI, etc.) before working in
  that area.

**Version**: 1.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14