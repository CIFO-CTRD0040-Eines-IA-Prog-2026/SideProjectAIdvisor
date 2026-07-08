# Testing — Frontend

Loaded when writing or modifying UI/component tests or E2E flows.
Runner: **Vitest** + **Testing Library** (`@testing-library/react`).

## Component tests

- Colocated: `*.test.tsx` next to the component, or `src/**/*.test.tsx`.
- Render with Testing Library; query by role/label, not implementation detail.
- Avoid snapshot tests — assert behavior, not markup shape.
- Mock server functions with `vi.mock` so component tests don't hit the DB/API.

## E2E (optional, later)

- **Playwright** under `tests/e2e/`, covering critical user flows (signup, checkout).
- Run against the built app, not `pnpm dev`, for realistic results.

## Conventions

- Test names read as sentences: `it("shows the plan badge after checkout")`.
- Keep one user-interaction concept per test.
- Shared render helpers (e.g. `renderWithRouter`) live in `tests/helpers/`.
