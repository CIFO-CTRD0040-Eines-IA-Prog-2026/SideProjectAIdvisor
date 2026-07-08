# API

Loaded when touching server functions, routes, request/response handling, or
boundary validation. TanStack Start is the only API surface — no separate service.

## Server functions (TanStack Start)

- Create with `createServerFn`. Import directly into route/component code.
- Keep all DB access, secrets, and third-party API calls server-side.
- Do NOT add Express, NestJS, FastAPI, or any other server framework.

## Routing & request/response

- File-based routes under `src/routes/`. Use loaders for GET-style data; server
  functions for mutations and any read that touches the DB.
- Return serializable shapes only — project DB rows through a Zod schema before
  returning to the client (see `docs/typescript.md`).
- Webhook routes (e.g. `/api/polar/webhook`) verify signatures before any work.

## Validation: Zod at boundaries

- Define one schema per shape; share between FE and BE.
- Parse every external input: `schema.parse(input)` / `safeParse` for user input.
- Derive TS types with `z.infer<typeof schema>` — never duplicate.
- Validate AI JSON output before trusting it (see `docs/backend/ai.md`).

## Error handling

- Wrap risky server work in try/catch; surface user-safe messages, log internals.
- Sentry captures FE + BE errors; release tracking is wired in CI (see `docs/infra.md`).
- Never leak stack traces or secrets to the client.

## Conventions

- Server fn files: `*.server.ts` colocated or under `src/server/`.
- DB access only through `src/db` helpers — no inline connection creation in routes.
- All env access goes through the validated `env.ts` module (see `docs/typescript.md`).
