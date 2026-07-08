# Database

Loaded when touching schema, migrations, queries, or DB config.

## PostgreSQL + Drizzle

- **PostgreSQL** — the single source of truth. Provisioned by Neon (see `docs/infra.md`).
- **Drizzle ORM** (not Prisma). Syntax mirrors SQL; prefer raw-feeling queries.
- `DATABASE_URL` comes from Neon via Vercel env, read through the validated `env.ts` module.

## Schema

- Schema in `src/db/schema.ts`, or split tables across files in `src/db/schema/`.
- Derive entity types with `InferSelectModel` / `InferInsertModel` — do not redefine.
- The `users` table is keyed by Clerk's `userId`; identity lives in Clerk
  (see `docs/backend/auth.md`). Do not store passwords/sessions here.

## Migrations

- `pnpm drizzle-kit generate` — create a migration from schema changes.
- `pnpm drizzle-kit migrate` — apply migrations.
- Run migrations as a release step (Vercel prebuild or a CI job), not at app boot.

## Querying

- Use transactions for multi-step writes: `db.transaction(...)`.
- Never interpolate raw user input into `sql\`...\`` — validate with Zod first.
- Keep DB access behind `src/db` repository helpers; routes call helpers, not Drizzle directly.

## Backups

- Neon handles backups via point-in-time restore; verify a restore quarterly
  (see `docs/infra.md`).
