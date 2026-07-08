# Testing — Infra

Loaded when touching CI workflows, build verification, or deployment smoke tests.

## CI (GitHub Actions)

- `pnpm test` runs on every PR (see `docs/infra.md`).
- Order gates to fail fast: `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm build`.
- Cache the pnpm store; pin action versions.

## Build verification

- `pnpm build` must succeed in CI on the same Node version as the runtime image.
- Fail the pipeline if the build emits type errors or missing env stubs.

## Deploy smoke tests (optional, later)

- After deploy, hit `GET /health` (expects 200) before marking the release green.
- For critical paths, a single Playwright smoke test against the deployed URL
  (auth, checkout) catches regressions the unit suite misses.

## Conventions

- Keep workflows under `.github/workflows/` and named by purpose (`ci.yml`, `deploy.yml`).
- Never put secrets in workflow files — reference GitHub Actions secrets.
