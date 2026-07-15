# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Conventional Commits](https://www.conventionalcommits.org/)
with squash merges.

## [Unreleased]

### Added

- **Public home page**: the home page (`/`) is now accessible without logging
  in. Unauthenticated visitors reach the full experience with no redirect to
  `/login`. Protected (non-public) routes are still protected.
- **Header login button**: a shared site header now appears on every page with a
  "Log in" button (top-right) for anonymous visitors. Clicking it navigates to
  `/login` in a single step; the control is keyboard-reachable and has an
  accessible name.
- **State-aware account control**: signed-in users see an account indicator
  (email initial / avatar) and a "Sign Out" control in the header instead of the
  login button. Signing out keeps the user on the home page and reverts the
  header to the logged-out state.
- **Playwright e2e suite** for the public-home/header behavior, including a new
  `tests/e2e/public-home.spec.ts` and unauthenticated/authenticated helpers. The
  `pnpm test` gate now runs the Playwright suite (`test:e2e` kept as an alias).

### Changed

- Authenticated users visiting auth pages (`/login`, `/signup`,
  `/reset-password`, `/update-password`) are redirected to `/`. Authenticated
  users are no longer redirected away from the public home page.
- The shared site header is now rendered in the root layout; the home-grown
  `<header>` previously baked into the `Advisor` feature component has been
  removed so chrome is not duplicated.
- The Supabase session is now resolved server-side in the root layout to avoid a
  logged-out→logged-in flash on first paint.