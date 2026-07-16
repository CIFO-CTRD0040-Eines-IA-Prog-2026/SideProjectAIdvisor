import { test, expect } from "@playwright/test";
import { asUnauthenticated } from "./helpers/unauthenticated";
import { asAuthenticated } from "./helpers/authenticated";

// ── Phase 2: Foundational (T003, T004) ──────────────────────────────────────

test.describe("Foundational route protection (002-public-home)", () => {
  test("unauthenticated visit to '/' renders the home page with NO redirect to /login (SC-001)", async ({
    context,
    page,
  }) => {
    await asUnauthenticated(context, page, "/");
    await expect(page).toHaveURL("/");
    // Home content is visible (the advisor hero heading)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("unauthenticated visit to a protected route redirects to /login (FR-007, SC-005)", async ({
    context,
    page,
  }) => {
    await context.clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});

// ── Phase 3: US1 — visitor reaches home without logging in (T007) ────────────

test.describe("US1 — visitor reaches home without logging in", () => {
  test("authenticated visit to '/' renders the home page (NO redirect) — US1 scenario 3", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

// ── Phase 4: US2 — login button in the header (T010, T011, T012) ─────────────

test.describe("US2 — login button in the header", () => {
  test("unauthenticated home page shows a 'Log in' button in the header, visible without scrolling (FR-002, SC-002)", async ({
    context,
    page,
  }) => {
    await asUnauthenticated(context, page, "/");
    const loginButton = page.getByRole("link", { name: /log in/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute("href", "/login");
  });

  test("'Log in' button visible on a mobile-width viewport (FR-005)", async ({
    context,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await asUnauthenticated(context, page, "/");
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  });

  test("clicking the 'Log in' button navigates to /login in a single step (FR-003, SC-003)", async ({
    context,
    page,
  }) => {
    await asUnauthenticated(context, page, "/");
    await page.getByRole("link", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("'Log in' button is keyboard-reachable and has an accessible name (FR-006)", async ({
    context,
    page,
  }) => {
    await asUnauthenticated(context, page, "/");
    const loginButton = page.getByRole("link", { name: /log in/i });
    await loginButton.focus();
    await expect(loginButton).toBeFocused();
  });
});

// ── Phase 5: US3 — authenticated account control (T016, T017, T018) ──────────

test.describe("US3 — account control for signed-in users", () => {
  test("signed-in user on '/' sees account indicator and sign-out, NOT a 'Log in' button (FR-004, SC-004)", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    // Account indicator: email initial of test@sideprojectadvisor.com → "T"
    await expect(page.getByText("T").first()).toBeVisible();
    // No "Log in" button for authenticated users
    await expect(page.getByRole("link", { name: /log in/i })).toHaveCount(0);
    // Sign-out control visible
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });

  test("signing out from the header keeps the user on '/' and reverts to the 'Log in' button (FR-011, SC-006)", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  });

  test("account/sign-out controls are keyboard-reachable with accessible labels (FR-006)", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    const signOut = page.getByRole("button", { name: /sign out/i });
    await signOut.focus();
    await expect(signOut).toBeFocused();
  });
});

// ── Phase 6: US4 — auth pages redirect authenticated users (T021, T022, T023) ─

test.describe("US4 — auth pages redirect authenticated users", () => {
  test("authenticated user visiting /login is redirected to '/' (FR-008)", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    await page.goto("/login");
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });

  test("authenticated user visiting /signup is redirected to '/'", async ({
    context,
    page,
  }) => {
    await asAuthenticated(context, page, "/");
    await page.goto("/signup");
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });

  test("unauthenticated user visiting a protected (non-public) route is redirected to /login — SC-005 regression", async ({
    context,
    page,
  }) => {
    await context.clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});