# Infra

Loaded when touching deployment, env vars, Postgres, CI, domains/SSL, or backups.
Read this before any change to `vercel.json`, `apps/web/next.config.mjs`,
`turbo.json`, `pnpm-workspace.yaml`, `.github/workflows/`, or env config.

## Hosting model

- **Vercel** — single deployable: the Next.js app (`apps/web`) on Vercel's Node runtime.
- Git push to `main` auto-deploys production; PRs get isolated preview deployments.
- Vercel handles SSL, CDN, edge network, and previews automatically.
- Vercel features are fair game (Analytics, KV, Edge Config, Cron) — but keep
  persistent relational data in Neon, not in Vercel KV.

## Postgres: Neon

- **Neon** (serverless Postgres) — free tier, scale-to-zero, branch-per-preview.
- `DATABASE_URL` comes from Neon; set it as a Vercel env var (see `docs/backend/database.md`).
- Use Neon preview branches so each Vercel preview deploy gets an isolated DB.

## Environment variables

- All secrets via **Vercel env vars** (Project → Settings → Environment Variables),
  scoped to Production / Preview / Development. Never committed.
- A single `apps/web/src/env.ts` validates env at boot with Zod (`z.object({...})`).
- Mirror the same keys as GitHub Actions secrets for CI.
- Required (non-exhaustive): `DATABASE_URL`, `CLERK_SECRET_KEY`,
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET`,
  `POLAR_API_KEY` / `POLAR_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SENTRY_DSN`,
  `POSTHOG_KEY`, `AI_*` provider keys. Client-exposed keys use the `NEXT_PUBLIC_`
  prefix (e.g. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`).

## Build & migrations

- Build command: `pnpm build` (runs `turbo run build`). Vercel builds the Next.js app
  automatically (zero-config Next.js preset); no custom output config needed in
  `apps/web/next.config.mjs` unless you override defaults.
- Run `pnpm drizzle-kit migrate` as a Vercel prebuild step (or a CI job) before the
  new deployment receives traffic — never migrate from the running app at boot.
- Neon handles backups via point-in-time restore; verify a restore quarterly.

## CI: GitHub Actions

- Free tier: 2,000 min/mo on private repos (public = unlimited). Effectively free
  for low deploy volume.
- Workflows (`.github/workflows/`):
  - `ci.yml` — on PR/push: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
  - Deploy is handled by Vercel's Git integration — no separate deploy job unless
    you want gated production releases.
- Enable Turbo Remote Cache (via Vercel) for faster pipeline runs.
- Pin action versions; cache pnpm store + Turbo cache; fail fast on typecheck.

## Monitoring & ops

- **Uptime:** Vercel status + external pinger (Better Stack / UptimeRobot) for prod.
- **Errors:** Sentry (FE + BE); release tracking via Vercel commit SHA / Sentry integration.
- **Logs:** Vercel runtime logs; ship long-term to Axiom/Logtail if needed.
- **Analytics:** PostHog (cloud); optionally Vercel Analytics for basic traffic.

## Conventions

- Keep `vercel.json`, `turbo.json`, `pnpm-workspace.yaml` at repo root; `packages/config/` versioned in git.
- `.env.example` lists keys without values; real `.env` is gitignored.
- Never put DB strings, API keys, or Clerk secrets in commits.
