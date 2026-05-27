import { test, expect, type Page } from "@playwright/test";
import { loginAsAdmin } from "./_helpers";

/**
 * Admin mobile-responsive behaviour.
 * Runs on mobile-viewport projects only (iPhone SE / iPhone 14 / iPhone 14 Pro Max).
 */
test.describe("Admin mobile responsiveness", () => {
  const DESKTOP_PROJECTS = ["chromium"];

  test.beforeEach(({}, testInfo) => {
    test.skip(
      DESKTOP_PROJECTS.includes(testInfo.project.name),
      "Mobile tests skip desktop projects",
    );
  });

  // ── UI-001: Sidebar toggle on mobile ──────────────────────

  test("sidebar toggles via hamburger and closes on overlay tap", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    // Sidebar should be hidden by default on mobile (translated off-screen)
    const sidebar = page.locator("aside");
    await expect(sidebar).toHaveCSS("transform", /translateX\(-/);

    // Tap hamburger — sidebar slides in
    await page.getByRole("button", { name: /open sidebar/i }).first().click();

    // Wait for transition — sidebar should now be visible (translateX(0))
    await expect(sidebar).toHaveCSS("transform", "none", { timeout: 1000 });

    // Overlay visible
    const overlay = page.locator('[aria-hidden="true"]').first();
    await expect(overlay).toBeVisible();

    // Tap overlay — sidebar closes
    await overlay.click();
    await expect(sidebar).toHaveCSS("transform", /translateX\(-/, {
      timeout: 1000,
    });
  });

  // ── UI-001: Sidebar navigation works on mobile ────────────

  test("sidebar nav links navigate and close sidebar", async ({ page }) => {
    await loginAsAdmin(page);

    // Open sidebar
    await page.getByRole("button", { name: /open sidebar/i }).first().click();
    const sidebar = page.locator("aside");
    await expect(sidebar).toHaveCSS("transform", "none", { timeout: 1000 });

    // Click "Categories" link inside sidebar
    await sidebar.getByRole("link", { name: /categories/i }).click();
    await page.waitForURL("**/admin/categories");

    // Sidebar should auto-close after navigation
    await expect(sidebar).toHaveCSS("transform", /translateX\(-/, {
      timeout: 1000,
    });
  });

  // ── UI-002: DataTable renders as cards on mobile ──────────

  test("DataTable renders card layout on mobile", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    // Desktop table should be hidden
    const desktopTable = page.locator("table");
    await expect(desktopTable).not.toBeVisible();

    // Mobile card container should be visible (block md:hidden)
    const mobileCards = page.locator(".block.md\\:hidden");
    await expect(mobileCards.first()).toBeVisible();
  });

  // ── UI-002: Touch targets ≥ 44px ──────────────────────────

  test("interactive elements meet 44px touch target", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");

    await assertTouchTargets(page);
  });
});

/**
 * Check that all visible interactive elements (buttons, links) meet
 * the 44×44px minimum touch-target guideline.
 */
async function assertTouchTargets(page: Page): Promise<void> {
  const interactives = page.locator(
    'button:visible, a:visible, [role="button"]:visible',
  );
  const count = await interactives.count();

  for (let i = 0; i < count; i++) {
    const el = interactives.nth(i);
    const box = await el.boundingBox();

    // Skip zero-size / off-screen elements
    if (!box || box.width < 1 || box.height < 1) continue;

    // Allow small inline text links but flag interactive controls
    const tag = await el.evaluate((e) => e.tagName.toLowerCase());
    if (tag === "a") {
      // Only check link-buttons (those styled with min-h)
      const cls = (await el.getAttribute("class")) ?? "";
      if (!cls.includes("min-h-")) continue;
    }

    expect(
      box.height,
      `Touch target too short (${tag} at y=${Math.round(box.y)})`,
    ).toBeGreaterThanOrEqual(44);
  }
}
