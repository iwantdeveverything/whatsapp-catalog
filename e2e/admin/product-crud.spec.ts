import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./_helpers";

test.describe("Admin product CRUD", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Admin product CRUD runs only on desktop Chromium",
    );
  });

  test("create → list → edit → soft-delete", async ({ page }) => {
    // Unique name so the product is uniquely identifiable in a shared
    // mock service across parallel workers.
    const unique = `E2E Product ${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
    const updatedName = `${unique} (updated)`;

    await loginAsAdmin(page);

    // ── Create ──────────────────────────────────────────
    await page.goto("/admin/products/new");
    await expect(
      page.getByRole("heading", { name: /new product/i }),
    ).toBeVisible();

    await page.getByLabel("Name").fill(unique);
    await page.getByLabel("Price").fill("12345");
    await page.getByLabel("Category").selectOption({ index: 1 });
    await page.getByRole("button", { name: /create/i }).click();

    // Redirected to products list with a success toast.
    await page.waitForURL("**/admin/products");
    await expect(
      page.getByRole("heading", { name: /^products$/i }),
    ).toBeVisible();

    // PROD-001: product visible in list (search to scope the assertion)
    await page.getByLabel("Search").fill(unique);
    const desktopTable = page.locator("table");
    await expect(desktopTable.getByText(unique).first()).toBeVisible();

    // ── Edit ────────────────────────────────────────────
    await desktopTable
      .getByRole("link", { name: new RegExp(`edit ${escapeRegExp(unique)}`, "i") })
      .click();
    await page.waitForURL(/\/admin\/products\/[^/]+$/);
    await expect(
      page.getByRole("heading", { name: /edit product/i }),
    ).toBeVisible();

    const nameInput = page.getByLabel("Name");
    await expect(nameInput).toHaveValue(unique);
    await nameInput.fill(updatedName);
    await page.getByRole("button", { name: /update|save/i }).click();
    await page.waitForURL("**/admin/products");

    await page.getByLabel("Search").fill(updatedName);
    await expect(desktopTable.getByText(updatedName).first()).toBeVisible();

    // ── Soft-delete ─────────────────────────────────────
    await desktopTable
      .getByRole("button", {
        name: new RegExp(`delete ${escapeRegExp(updatedName)}`, "i"),
      })
      .click();
    await page.getByRole("button", { name: /^confirm$/i }).click();

    // PROD-004: after soft-delete the row's status renders "Inactive"
    await page.getByLabel("Search").fill(updatedName);
    await expect(desktopTable.getByText(/inactive/i).first()).toBeVisible();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
