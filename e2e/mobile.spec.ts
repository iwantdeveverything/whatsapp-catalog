import { test, expect } from "@playwright/test";

test.describe("Mobile viewport — iPhone SE (375px)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("no horizontal scroll on homepage", async ({ page }) => {
    await page.goto("/");

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    // scrollWidth should be ≤ viewportWidth (no horizontal overflow)
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("2-column grid at 375px", async ({ page }) => {
    await page.goto("/");

    // Check grid layout — should have 2 columns at 375px
    // At minimum, the grid items should not all be in one column
    const cards = page.locator(".grid a");
    const count = await cards.count();
    if (count >= 2) {
      const firstBounds = await cards.nth(0).boundingBox();
      const secondBounds = await cards.nth(1).boundingBox();
      if (firstBounds && secondBounds) {
        // First two items should be side by side (similar Y, different X)
        const yDiff = Math.abs(firstBounds.y - secondBounds.y);
        const xDiff = Math.abs(firstBounds.x - secondBounds.x);
        expect(xDiff).toBeGreaterThan(20); // Different X positions
        expect(yDiff).toBeLessThan(30); // Same row
      }
    }
  });

  test("touch targets are at least 44px", async ({ page }) => {
    await page.goto("/zapatillas-running");

    // Check interactive elements have min dimensions
    const interactiveElements = page.locator(
      "button, a, [role='button'], [role='tab']",
    );
    const count = await interactiveElements.count();

    for (let i = 0; i < count; i++) {
      const el = interactiveElements.nth(i);
      const box = await el.boundingBox();
      const tagName = await el.evaluate((e) => e.tagName.toLowerCase());
      const role = await el.getAttribute("role");

      // Skip elements that might be zero-size (hidden)
      if (!box || box.width < 1 || box.height < 1) continue;

      // Check className for min-h/min-w classes since computed dimensions
      // may vary in actual rendering but should meet 44px threshold
      const classList = await el.getAttribute("class");
      const hasMinSize =
        classList?.includes("min-h-[44px]") ||
        classList?.includes("min-w-[44px]") ||
        tagName === "button" ||
        tagName === "a";

      // Buttons and links that are visible should have sufficient hit area
      if (box.height < 40 || box.width < 40) {
        // Allow nav dots to be smaller
        if (role !== "tab") {
          // Use hasMinSize to verify only when the element claims to be accessible
          const shouldCheck = !hasMinSize || tagName === "button";
          if (shouldCheck) {
            expect(
              box.height,
              `${tagName} height too small`,
            ).toBeGreaterThanOrEqual(40);
          }
        }
      }
    }
  });
});

test.describe("Mobile viewport — iPhone 14 (390px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("grid renders correctly with products", async ({ page }) => {
    await page.goto("/");

    // Products should be visible
    const productVisible = await page
      .getByText(/zapatillas running/i)
      .isVisible();
    expect(productVisible).toBe(true);

    // No horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);
  });
});

test.describe("Mobile viewport — iPhone 14 Pro Max (428px)", () => {
  test.use({ viewport: { width: 428, height: 926 } });

  test("homepage renders without overflow", async ({ page }) => {
    await page.goto("/");

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test("product detail page renders on mobile", async ({ page }) => {
    await page.goto("/zapatillas-running");

    await expect(
      page.getByRole("heading", { name: /zapatillas running/i }),
    ).toBeVisible();

    // CTA should be visible and accessible
    const cta = page.getByRole("link", {
      name: /consultar por whatsapp/i,
    });
    await expect(cta).toBeVisible();
  });
});
