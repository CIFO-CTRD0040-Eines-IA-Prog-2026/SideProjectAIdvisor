# Payments

Loaded when touching billing, subscriptions, checkout, or Polar webhooks.

## Provider: Polar (Merchant of Record)

- Polar handles subscriptions, one-off charges, invoices, and **tax/VAT globally**
  (we do not calculate or remit tax ourselves).
- Map Polar's `customer_id` to our `users` table; never store card data ourselves.
- Plans/products are configured in the Polar dashboard, referenced by product/price ID
  stored as env vars (so plan changes don't require a deploy).

## Entities (Drizzle schema)

- `subscriptions` table: `userId`, `polarSubscriptionId`, `status`, `plan`, current period.
- `users.plan` / `users.subscriptionStatus` denormalized for fast client reads — keep in sync via webhooks.
- Idempotency: store processed webhook event IDs to avoid double-handling.

## Checkout & portal

- Create a Polar checkout session from a server function; redirect the user to the hosted URL.
- Use Polar's customer portal for plan changes / cancellation — don't build our own.

## Webhooks

- Endpoint is a Next.js Route Handler at `/api/polar/webhook` (`src/app/api/polar/webhook/route.ts`).
- **Verify the signature** with `POLAR_WEBHOOK_SECRET` on every request — reject otherwise.
- Handle at least: `subscription.created`, `subscription.updated`, `subscription.deleted`,
  `checkout.completed`.
- Update local state synchronously; offload email/notifications to after the response.

## Failure modes

- Webhook retries are Polar's responsibility — design handlers to be idempotent.
- If local state and Polar diverge, Polar is the source of truth; reconcile from its API.

## Conventions

- All Polar API calls go through a small `src/server/polar.ts` wrapper.
- Never expose `POLAR_API_KEY` to the client; only the checkout URL is client-visible.
