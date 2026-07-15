import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "test@sideprojectadvisor.com",
  password: "Test1234",
};

test.describe("Test user login", () => {
  test("logs in with valid credentials and sees the authenticated home", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/", { timeout: 10000 });

    await expect(page.locator("text=Welcome")).toBeVisible();
    await expect(page.getByText(TEST_USER.email)).toBeVisible();
  });

  test("shows error with wrong password", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', "WrongPass1");
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toContainText(
      "Invalid email or password",
    );
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/login", { timeout: 10000 });
  });

  test("can sign out after login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/", { timeout: 10000 });

    await page.click('button[type="submit"]');

    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });
});
