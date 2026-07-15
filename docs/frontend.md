# Frontend

Loaded when touching UI, routing, components, styling, or client-side AI streaming.
Read this before editing anything in `src/app/` (or `src/components/`, `src/features/`).

## Framework: Next.js (App Router)

- File-based routing under `src/app/`. Each folder is a route segment; `page.tsx`
  defines the route UI, `layout.tsx` wraps nested segments.
- Server logic: Next.js Server Actions (`"use server"`) and Route Handlers
  (`src/app/api/*/route.ts`). Read the session/env/DB only server-side.
- Client components must start with `"use client"` (hooks, event handlers, state).
- Do NOT spin up Express/FastAPI/etc. All backend logic lives in Server Actions / Route Handlers.
- Build target: Next.js on Vercel. Server components and Route Handlers run on
  Vercel's Node runtime; static segments prerender at build time.

## UI

- **React 18** + **TypeScript** (strict). No `any` without a justifying comment.
- **Tailwind v4** for styling (via `@tailwindcss/postcss`). Keep utility-first;
  avoid premature abstraction.
- **shadcn/ui** — components are copied into the repo (owned), NOT a dependency.
  Tweak their source freely. Do NOT re-wrap them in a generic component layer.
- **lucide-react** for icons. Prefer over ad-hoc SVGs.

## AI SDK (client streaming)

- Vercel AI SDK, model-agnostic. Swapping providers = changing the model string.
- Use `useChat` / `useCompletion` for UI streaming; pair with server-side `streamText`
  (exposed via a Route Handler or Server Action).
- Keep prompt/model config server-side; never ship API keys to the client.

## Validation & shared schemas

- **Zod** for all external/IO boundaries (form input, API args, AI JSON output).
- Define schemas once and import them from shared modules on both FE and BE.

## Utilities

- **Day.js** for date formatting (lightweight, immutable).
- **Lodash** for complex transforms (`groupBy`, `difference`, deep clone). Avoid
  reinventing array/object helpers.

## Routing & data loading

- Prefer Server Components for route data; fetch data directly in `page.tsx`
  (async server components) and cache/revalidate via Next.js `fetch` options.
- Mutations go through Server Actions; keep them as the source of truth for writes
  that touch the DB.

## Conventions

- Component files: PascalCase (`UserProfile.tsx`). Hooks: `useX.ts`.
- One default export per `page.tsx`/`layout.tsx`; named exports otherwise.
- Keep `"use client"` components lean; push data work to Server Components / Actions.
- Always run `pnpm lint && pnpm typecheck` after UI changes.
