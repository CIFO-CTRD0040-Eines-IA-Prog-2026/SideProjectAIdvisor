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

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(TEST_USER.email)).toBeVisible();
  });

  test("shows error with wrong password", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', "WrongPass1");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("home page is public — unauthenticated visit to '/' renders home (feature 002)", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/");

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("can sign out after login and stays on the public home (feature 002)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/", { timeout: 10000 });

    await page.getByRole("button", { name: /sign out/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
