# Email

Loaded when touching transactional or broadcast email.

## Resend

- Developer-friendly API for transactional (welcome, receipts) and broadcast campaigns.
- `RESEND_API_KEY` lives in Vercel env — never in the client bundle.

## Templates

- Use **React Email**; templates live in `src/emails/` (one file per email type).
- Keep templates pure (props in, markup out) — no DB or API calls inside them.

## Sending

- Send from server functions or background jobs (see `docs/backend/jobs.md`).
- For broadcast/segment sends, prefer Resend's broadcast API over per-recipient loops.

## Conventions

- All Resend calls go through `src/server/email.ts`.
- Never log full message bodies or PII to Sentry/PostHog.
