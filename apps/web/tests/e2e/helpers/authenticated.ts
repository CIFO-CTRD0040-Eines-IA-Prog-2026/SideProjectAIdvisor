import type { Page, BrowserContext } from "@playwright/test";

const TEST_USER = {
  email: "test@sideprojectadvisor.com",
  password: "Test1234",
} as const;

/**
 * Establish a seeded AUTHENTICATED session for the test user by logging in
 * through the UI (same surface feature 001 uses), then navigating to `url`.
 * Reuse across tests via the returned page (cookies are session-scoped by
 * Playwright's per-test context isolation).
 */
export async function asAuthenticated(
  context: BrowserContext,
  page: Page,
  url = "/",
): Promise<void> {
  await context.clearCookies();
  await page.goto("/login");
  await page.fill('input[name="email"]', TEST_USER.email);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  // Wait for the client-side router to complete navigation to the target URL.
  await page.waitForURL(url === "/" ? "/" : url, { timeout: 15_000 });
  // If a specific non-home URL was requested, navigate there after auth.
  if (url !== "/") {
    await page.goto(url);
  }
}