# Jobs

Loaded when touching background tasks, cron, or scheduled work.

## Current model

- No long-running worker process assumed yet. Prefer:
  - In-request work for short tasks (a few hundred ms).
  - External scheduler for periodic jobs (Vercel Cron, or a GitHub Actions scheduled
    workflow) calling a server function endpoint.

## If a queue becomes necessary

- Add Redis (e.g. Upstash, accessible from Vercel) + a worker (a separate Vercel
  function or an external small service).
- Before introducing it, update `docs/infra.md` with the new service and resource plan.
- Keep job handlers idempotent and retried with backoff.

## Conventions

- Scheduled server fns live in `src/server/jobs/` and are thin — they orchestrate
  `src/db` + `src/emails` + `src/server/ai`, they don't hold business logic inline.
- Never put secrets in cron payloads; read them from `env.ts` inside the handler.
