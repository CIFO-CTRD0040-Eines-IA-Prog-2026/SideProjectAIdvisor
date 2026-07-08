# AI

Loaded when touching model calls, streaming, or AI output handling.

## Vercel AI SDK (model-agnostic)

- Swapping providers = changing the model string / provider keys, not rewriting code.
- Provider/model chosen via env (`AI_MODEL`, provider API keys) — keep in Vercel env.
- Never ship API keys to the client bundle.

## Streaming

- Server-side: `streamText` for text, `streamObject` for structured JSON.
- Client-side: `useChat` / `useCompletion` for UI streaming (see `docs/frontend.md`).
- Keep prompt construction and model config in server functions, not the client.

## Structured output

- When returning structured AI output, validate it with a Zod schema before use
  (see `docs/backend/api.md`). Treat model output as untrusted input.

## Conventions

- Wrap provider calls in `src/server/ai.ts` so model/temperature/prompt config stays centralized.
- Log token usage / latency to Sentry/PostHog for cost monitoring.
