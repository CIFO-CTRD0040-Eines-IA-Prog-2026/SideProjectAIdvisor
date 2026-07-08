# TypeScript

Loaded when touching types, `tsconfig.json`, shared schemas, or env typing.
TypeScript is non-negotiable; strict mode is the default.

## Config

- Shared base in `packages/config/tsconfig/base.json` (`strict`, `noUncheckedIndexedAccess`, `composite: true`, `incremental: true`); each app/package `tsconfig.json` extends it, adding only what it needs. No scattered duplicate tsconfigs.
- Path aliases: `@/*` → `src/*` (configured in `apps/web/tsconfig.json` AND `apps/web/vite.config.ts`).
- Use TypeScript project references for incremental builds across packages.
- Target: a stable Node version matching the Vercel runtime (see `docs/infra.md`).

## Rules

- **No `any`** without a comment justifying it. Prefer `unknown` + narrowing.
- Do not silence the compiler with `as` to force a shape — fix the source.
  If a cast is truly needed, add a brief comment and prefer `z.infer` / Drizzle types.
- Prefer inferred types over hand-written interfaces where the source is already typed
  (Drizzle rows, Zod schemas, server fn returns).

## Shared types (FE ↔ BE)

- Define a Zod schema once; derive the TS type with `z.infer<typeof schema>`.
- Never duplicate a type for the same shape across FE and BE.
- Drizzle table types come from `InferSelectModel` / `InferInsertModel` — use them
  for entity types instead of redefining.

## Env typing

- All env access through a single `src/env.ts` module that validates with Zod and
  exports a typed `env` object. Import `env` everywhere — never `process.env` inline.

## Server function signatures

- Explicitly type inputs (Zod schema or TS type) and return types where non-obvious.
- Avoid returning raw DB rows to the client; project to a serializable shape (Zod schema).

## Conventions

- Types/interfaces: PascalCase (`User`, `CheckoutSession`).
- Prefer `type` aliases for unions/primitives; `interface` for extensible object shapes.
- Keep `enum` use minimal; prefer string-literal unions.
