# AGENTS.md

SaaS web app. Full-stack TypeScript monorepo (pnpm workspaces + Turborepo),
single deployable in `apps/web`, hosted on Vercel with Postgres on Neon.

## Commands

```bash
pnpm dev            # turbo run dev --parallel (apps/web dev server)
pnpm build          # turbo run build (cached, builds deps first)
pnpm lint           # turbo run lint
pnpm typecheck      # turbo run typecheck
pnpm test           # turbo run test
pnpm test -- -t "<name>"   # single test by name
pnpm format         # prettier --write .
pnpm drizzle-kit generate   # create migration (apps/web/src/db)
pnpm drizzle-kit migrate    # apply migrations
```

## Monorepo layout

`apps/web/` is the Next.js (App Router) app (the deployable). `packages/config/` holds
shared tsconfig/eslint presets. Add `packages/*` only when code is shared across
deployables. See `docs/monorepo.md` for workspace/Turborepo details.

## Git

- Squash merge only. Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Branch format: `type/short-description` (e.g., `feat/user-auth`).
- Edit `docs/conventions.md` in the same PR where a convention changes.

## Done

- Work isn't done until `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass.
- Review the diff before accepting; confirm the requested behavior changed (and any bug no longer reproduces).

## Deep dives

Read the matching file when working in that area:

- Conventions (cross-cutting rules, screaming architecture) → `docs/conventions.md`
- Frontend (React, Next.js App Router, shadcn, routing, AI SDK UI streaming) → `docs/frontend.md`
- API (server functions, routing, validation, error handling) → `docs/backend/api.md`
- Database (Postgres/Neon, Drizzle, schema, migrations, transactions) → `docs/backend/database.md`
- AI (Vercel AI SDK, streaming, structured output) → `docs/backend/ai.md`
- Email (Resend, React Email templates) → `docs/backend/email.md`
- Jobs (background tasks, cron) → `docs/backend/jobs.md`
- Infra (Vercel, Neon, env, migrations, CI, domains/SSL) → `docs/infra.md`
- Monorepo (pnpm workspaces, Turborepo, shared tsconfig, workspace:* imports) → `docs/monorepo.md`
- TypeScript (strict config, shared types, env typing, conventions) → `docs/typescript.md`
- Testing — frontend (component tests, Testing Library, Playwright) → `docs/testing/frontend.md`
- Testing — backend (server fns, DB in tests, Zod, mocking) → `docs/testing/backend.md`
- Testing — infra (CI gates, build verification, deploy smoke) → `docs/testing/infra.md`
- Auth (Clerk, sessions, route protection, webhook sync, social sign-in) → `docs/backend/auth.md`
- Changelog (user-facing release entries, format, publishing) → `docs/changelog.md`

If a task spans multiple areas, read all relevant files first.
