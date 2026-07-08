# Conventions

Loaded when writing or reviewing any code. Cross-cutting rules that apply across
frontend and backend. Area docs elaborate the "how" for their domain; this file
holds the terse rules. Describe capabilities over file paths — paths drift.

## Stack & framework

- Use Drizzle, not Prisma. Use Zod at every external/IO boundary.
- Keep server logic in TanStack Start server functions — no separate backend
  framework (Express, NestJS, FastAPI).
- shadcn/ui components are owned copies (tweak their source freely); don't
  re-wrap them in a generic component layer.
- Persistent relational data lives in Neon; auth is owned by Clerk — don't store
  passwords/sessions in our DB. No Vercel-specific stores for relational data.

## Screaming architecture

- Organize by feature/domain, not by technical layer. `apps/web/src/features/<feature>/`
  groups that feature's UI, server fns, schema slice, and tests together — whatever
  the domain.
- Reading `apps/web/src/features/` should show the product's capabilities, not
  framework plumbing.
- No layer buckets (`controllers/`, `models/`, `services/`). App-level cross-cutting
  infra lives in `apps/web/src/lib/` and `apps/web/src/components/ui/`; monorepo-wide
  config in `packages/config/`.
- Internal packages use `workspace:*` + an `exports` field — never `npm link` or
  relative path hacks.
- Data flows one direction: `features/*` may import from `lib/` and `components/ui/`;
  `lib/` and `components/ui/` must NOT import from `features/*`.

## TypeScript

- Strict, `noUncheckedIndexedAccess`. No `any` without a justifying comment.
- Prefer `unknown` + narrowing over `as` casts.
- Derive types from Zod (`z.infer`) and Drizzle (`InferSelectModel`) — don't
  duplicate entity types by hand. See `docs/typescript.md` for config detail.

## Naming & imports

- Components/types: PascalCase. Functions/vars: camelCase. Hooks: `useX`.
- Server fn files: `*.server.ts`. Tests: `*.test.ts(x)`.
- Path alias `@/*` → `src/*` (within `apps/web`). No barrel files.
- Group imports: externals → `@/` internals → relative.

## Error handling

- Throw typed errors from a central error-utils module (no `throw "string"`).
- Wrap risky server work in try/catch; return user-safe messages, never leak
  stacks or secrets. See `docs/backend/api.md` for the full pattern.

```ts
// CORRECT — typed error, user-safe message
import { AppError } from "@/lib/errors";

export const getUser = createServerFn(async (_event) => {
  const user = await db.users.findById(userId);
  if (!user) throw new AppError("not_found", "User not found");
  return user;
});

// WRONG — string throw leaks an unstructured error
throw "user not found";
```

## Dates & data

- Day.js only — never native `Date`. Lodash for complex transforms
  (`groupBy`, `difference`, `cloneDeep`).

```ts
// CORRECT
import dayjs from "dayjs";
const iso = dayjs(createdAt).toISOString();

// WRONG — native Date parsing is a timezone footgun
new Date(createdAt).toISOString();
```

## Comments & style

- No comments unless the code is genuinely non-obvious. No dead code or
  `console.log` in committed code.

## Boundaries (never touch)

- Never hand-edit generated files: Drizzle migrations under `drizzle/`, lockfiles
  (`pnpm-lock.yaml`), build output (`.output/`, `dist/`, `node_modules/`).
- Never mutate `packages/config/` base tsconfig — extend it, don't change the base.
- Never commit `.env` or any file containing secrets/keys/tokens.
- Never import server-only modules (`*.server.ts`, `src/db`) into client components.

## Secrets

- All secrets via Vercel env, read through a validated `env` module
  (Zod-shaped). Never commit secrets; never log tokens/PII to Sentry/PostHog.

## Maintenance

- When the agent makes the same mistake twice, run a quick retrospective (what was the gap?) and add a rule here — not on the first occurrence.
- If a linter/hook can enforce a rule, move it there — free this file for judgment calls.
- Edit this file in the same PR where the convention changes — never let it drift stale.
- Quarterly review: prune rules a linter now enforces, and generalize stale file paths
  into capability descriptions.
