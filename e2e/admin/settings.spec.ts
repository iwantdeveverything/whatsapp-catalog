import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./_helpers";

test.describe("Admin settings", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Admin settings runs only on desktop Chromium",
    );
  });

  test("change catalog name → save → reload → value persisted", async ({
    page,
  }) => {
    const newName = `Test Catalog ${Date.now()}`;

    await loginAsAdmin(page);
    await page.goto("/admin/settings");

    await expect(
      page.getByRole("heading", { name: /^settings$/i }),
    ).toBeVisible();

    // SET-001: update catalog name
    const catalogInput = page.getByLabel("Catalog name");
    await catalogInput.fill(newName);
    await page.getByRole("button", { name: /save/i }).click();

    // Wait for the success toast
    await expect(page.getByText(/settings saved/i)).toBeVisible();

    // SET-003: reload the page and verify the value persisted
    await page.reload();
    await expect(page.getByLabel("Catalog name")).toHaveValue(newName);
  });

  test("theme picker lists available themes", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/settings");

    const themeSelect = page.locator("#settings-theme");
    await expect(themeSelect).toBeVisible();

    // At least one theme option should be present
    const optionCount = await themeSelect.locator("option").count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test("WhatsApp template field accepts variables", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/settings");

    const templateField = page.locator("#settings-template");
    await expect(templateField).toBeVisible();

    const template = "Hi! Check {product} at {url}";
    await templateField.fill(template);
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText(/settings saved/i)).toBeVisible();

    await page.reload();
    await expect(templateField).toHaveValue(template);
  });
});
