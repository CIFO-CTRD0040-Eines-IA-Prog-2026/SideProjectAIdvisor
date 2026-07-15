# API

Loaded when touching server actions, route handlers, request/response handling, or
boundary validation. Next.js (Server Actions + Route Handlers) is the only API
surface — no separate service.

## Server logic (Next.js)

- Mutations and reads: define Server Actions with `"use server"` (colocated or under
  `src/server/`) and call them from Server/Client Components.
- Raw HTTP / webhooks: Route Handlers under `src/app/api/<path>/route.ts`
  (`export async function GET/POST/...`).
- Keep all DB access, secrets, and third-party API calls server-side.
- Do NOT add Express, NestJS, FastAPI, or any other server framework.

## Routing & request/response

- File-based routes under `src/app/`. Use async Server Components for GET-style data;
  Server Actions for mutations and any read that touches the DB.
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

- Server Action files: `*.server.ts` colocated or under `src/server/`.
- DB access only through `src/db` helpers — no inline connection creation in routes.
- All env access goes through the validated `env.ts` module (see `docs/typescript.md`).
