import type { Page, BrowserContext } from "@playwright/test";

/**
 * Ensure the page has a guaranteed UNAUTHENTICATED session: no `sb-` cookies.
 * Clears all cookies, then navigates to the given URL.
 */
export async function asUnauthenticated(
  context: BrowserContext,
  page: Page,
  url = "/",
): Promise<void> {
  await context.clearCookies();
  await page.goto(url);
}