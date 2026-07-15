# Testing — Backend

Loaded when writing or modifying tests for server functions, DB, Zod schemas,
or external-service integrations. Runner: **Vitest**.

## Server functions

- Call them directly (they're plain functions) and assert on the return value.
- Mock Drizzle at the repository boundary for unit tests; run integration tests
  against a real throwaway test DB.

## Database in tests

- Use a **separate test Postgres** (or a test schema) — never dev/production.
- Each test file resets tables or wraps work in a transaction that rolls back.
- Set `DATABASE_URL` to the test DB in the test environment only (see `docs/infra.md`).
- Do NOT mock Drizzle/Postgres for integration tests — exercise the real SQL path.

## Zod schemas

- Round-trip tests for AI JSON output and API input boundaries.
- Assert both accept (valid) and reject (malformed) cases.

## Mocking external services

- Mock Polar, Resend, and AI providers with `vi.mock` or `msw`.
- Webhook handlers: send signed payloads so signature verification is exercised.

## Test user

A pre-seeded test user is available for integration and E2E tests:

| Field    | Value                          |
|----------|--------------------------------|
| Email    | `test@sideprojectadvisor.com` |
| Password | `Test1234`                    |

Seed it with:

```bash
pnpm --filter @advisor/web seed
```

Requires `SUPABASE_SERVICE_ROLE_KEY` in `apps/web/.env`. See [quickstart](../../specs/001-user-login/quickstart.md) for details.

## Conventions

- Test data factories in `tests/factories/` for reuse (users, subscriptions).
- Idempotent handlers: assert that replaying a webhook event is a no-op.
- One assertion concept per test; never commit `it.only` / `test.only`.
