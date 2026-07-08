# Frontend

Loaded when touching UI, routing, components, styling, or client-side AI streaming.
Read this before editing anything in `src/` (or `src/routes/`, `src/components/`).

## Framework: TanStack Start

- File-based routing under `src/routes/`. Each file/segment is a route.
- Server functions: create with `createServerFn` and import them directly into
  client code. They run on the server, auto-serialized — no manual fetch/REST.
- Do NOT spin up Express/FastAPI/etc. All backend logic lives in server functions.
- Build target: Vite + Vercel. Server functions run on Vercel's Node runtime.

## UI

- **React 19** + **TypeScript** (strict). No `any` without a justifying comment.
- **Tailwind** for styling. Keep utility-first; avoid premature abstraction.
- **shadcn/ui** — components are copied into the repo (owned), NOT a dependency.
  Tweak their source freely. Do NOT re-wrap them in a generic component layer.
- **Tabler Icons** (`@tabler/icons-react`). Prefer over ad-hoc SVGs.

## AI SDK (client streaming)

- Vercel AI SDK, model-agnostic. Swapping providers = changing the model string.
- Use `useChat` / `useCompletion` for UI streaming; pair with server-side `streamText`.
- Keep prompt/model config in server functions; never ship API keys to the client.

## Validation & shared schemas

- **Zod** for all external/IO boundaries (form input, API args, AI JSON output).
- Define schemas once and import them from shared modules on both FE and BE.

## Utilities

- **Day.js** for date formatting (lightweight, immutable).
- **Lodash** for complex transforms (`groupBy`, `difference`, deep clone). Avoid
  reinventing array/object helpers.

## Routing & data loading

- Prefer TanStack's built-in loaders for route data; keep server functions as
  the source of truth for mutations and reads that touch the DB.

## Conventions

- Component files: PascalCase (`UserProfile.tsx`). Hooks: `useX.ts`.
- One default export per route file (TanStack convention). Named exports otherwise.
- Keep client components lean; push data work to server functions.
- Always run `pnpm lint && pnpm typecheck` after UI changes.
