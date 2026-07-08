# Auth

Loaded when touching login, sessions, protected routes, or user sync.

## Provider: Clerk (hosted)

- Clerk is a hosted auth service — it owns users, sessions, and OAuth flows.
- No local password hashes and no session table of our own; Clerk issues JWTs we verify.
- Social sign-in (Google, GitHub, etc.) is configured in the Clerk dashboard.
- Free tier covers up to 10K MAUs.

## Integration (TanStack Start)

- Use Clerk's TanStack Start adapter (`@clerk/tanstack-start`): middleware for route
  protection, `getAuth` to read the session inside server functions.
- Public routes: `/sign-in/*`, `/sign-up/*`, marketing pages.
- Protected routes: an authenticated layout redirects to `/login` when unauthenticated.
- Admin actions: check the `privateMetadata.role` claim server-side — never trust client state.

## Protecting server functions

- Every server function returning non-public data calls a `requireUser()` helper built
  on Clerk's `getAuth`; throws/redirects if there's no session.
- Re-check roles/plan server-side for any authorization decision.

## DB sync (Clerk → Postgres)

- Keep a `users` table for app-only data (plan, preferences), keyed by Clerk's `userId`.
- Sync via Clerk webhooks (`user.created`, `user.updated`, `user.deleted`) at
  `/api/clerk/webhook` — verify the signature with `CLERK_WEBHOOK_SECRET`.
- Clerk is the source of truth for identity; our row holds app-only fields.

## Env

- `CLERK_SECRET_KEY` (server) and `VITE_CLERK_PUBLISHABLE_KEY` (client) in Vercel env.
- `CLERK_WEBHOOK_SECRET` for webhook verification.
- Allowed origins / redirect URLs in the Clerk dashboard must match the Vercel domain
  (see `docs/infra.md`).

## Security

- Never log JWTs or session tokens to Sentry/PostHog.
- Rotate keys in the Clerk dashboard if compromised; update Vercel env to match.

## Conventions

- All auth helpers exported from `src/server/auth.ts`.
- Never log JWTs, session tokens, or full user objects to Sentry/PostHog.
