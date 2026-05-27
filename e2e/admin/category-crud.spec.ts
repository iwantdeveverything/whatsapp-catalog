import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./_helpers";

test.describe("Admin category CRUD", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Admin category CRUD runs only on desktop Chromium",
    );
  });

  test("create category → slug auto-generated → visible in list", async ({
    page,
  }) => {
    const unique = `E2E Category ${Date.now()}`;

    await loginAsAdmin(page);
    await page.goto("/admin/categories/new");

    await expect(
      page.getByRole("heading", { name: /new category/i }),
    ).toBeVisible();

    // Fill name — slug field should auto-populate
    await page.getByLabel("Name").fill(unique);
    const slugInput = page.getByLabel("Slug");
    await expect(slugInput).not.toHaveValue("");
    await expect(slugInput).toHaveAttribute("readonly");

    await page.getByRole("button", { name: /create/i }).click();

    // Redirected to categories list
    await page.waitForURL("**/admin/categories");
    await expect(
      page.getByRole("heading", { name: /^categories$/i }),
    ).toBeVisible();

    // CAT-001: new category visible in list
    const desktopTable = page.locator("table");
    await expect(desktopTable.getByText(unique).first()).toBeVisible();
  });

  test("delete category with products → toast error", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/categories");

    await expect(
      page.getByRole("heading", { name: /^categories$/i }),
    ).toBeVisible();

    // Seed categories have products — pick the first one with productCount > 0.
    // The "Products" column renders the count; look for a row whose count is > 0.
    const desktopTable = page.locator("table");
    const firstDeleteBtn = desktopTable
      .getByRole("button", { name: /^delete /i })
      .first();

    await firstDeleteBtn.click();

    // CAT-003: should see an error toast (NOT the ConfirmDialog)
    // The ConfirmDialog should NOT open because requestDelete short-circuits.
    await expect(page.getByText(/cannot delete/i)).toBeVisible();
  });

  test("delete category with zero products → success", async ({ page }) => {
    const unique = `Deletable ${Date.now()}`;

    await loginAsAdmin(page);

    // First create a category with 0 products
    await page.goto("/admin/categories/new");
    await page.getByLabel("Name").fill(unique);
    await page.getByRole("button", { name: /create/i }).click();
    await page.waitForURL("**/admin/categories");

    // Now delete it
    const desktopTable = page.locator("table");
    await desktopTable
      .getByRole("button", {
        name: new RegExp(`delete ${escapeRegExp(unique)}`, "i"),
      })
      .click();

    // ConfirmDialog opens — confirm
    await page.getByRole("button", { name: /^confirm$/i }).click();

    // CAT-004: category gone from list
    await expect(desktopTable.getByText(unique)).not.toBeVisible();
  });

  test("edit category → name updated in list", async ({ page }) => {
    const unique = `Editable ${Date.now()}`;
    const updatedName = `${unique} (edited)`;

    await loginAsAdmin(page);

    // Create a category to edit
    await page.goto("/admin/categories/new");
    await page.getByLabel("Name").fill(unique);
    await page.getByRole("button", { name: /create/i }).click();
    await page.waitForURL("**/admin/categories");

    // Click edit on that category
    const desktopTable = page.locator("table");
    await desktopTable
      .getByRole("link", {
        name: new RegExp(`edit ${escapeRegExp(unique)}`, "i"),
      })
      .click();
    await page.waitForURL(/\/admin\/categories\/[^/]+$/);

    await expect(
      page.getByRole("heading", { name: /edit category/i }),
    ).toBeVisible();

    const nameInput = page.getByLabel("Name");
    await expect(nameInput).toHaveValue(unique);
    await nameInput.fill(updatedName);
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForURL("**/admin/categories");

    // CAT-002: updated name visible in list
    await expect(desktopTable.getByText(updatedName).first()).toBeVisible();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
