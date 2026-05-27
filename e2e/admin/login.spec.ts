import { test, expect } from "@playwright/test";

test.describe("Admin login flow", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Admin login flow runs only on desktop Chromium",
    );
  });

  test("unauthenticated visit to /admin/dashboard redirects to /admin/login", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/admin/dashboard");

    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(
      page.getByRole("heading", { name: /log in/i }),
    ).toBeVisible();
  });

  test("valid credentials redirect to /admin/dashboard", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: /dashboard/i }),
    ).toBeVisible();
  });

  test("password shorter than 6 chars surfaces validation error", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("123");
    await page.getByRole("button", { name: /log in/i }).click();

    // Still on the login page — no navigation to dashboard
    await expect(page).toHaveURL(/\/admin\/login$/);
    // Zod surfaces a message containing "6" via the Password input's error slot
    await expect(page.getByText(/6/)).toBeVisible();
  });
});
