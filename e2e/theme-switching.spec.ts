import { test, expect } from "@playwright/test";

test.describe("Theme switching", () => {
  test("navigating to /ajustes shows theme cards", async ({ page }) => {
    await page.goto("/ajustes");

    // Header visible
    await expect(page.getByRole("heading", { name: "Temas" })).toBeVisible();

    // Category tabs visible
    await expect(page.getByRole("tab", { name: "Todos" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "E-commerce" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Design" })).toBeVisible();

    // Theme cards loaded (at least 10 visible)
    const cards = page.locator("[data-active]");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test("clicking a theme card changes data-theme on <html>", async ({
    page,
  }) => {
    await page.goto("/ajustes");

    // Default theme is shopify
    await expect(page.locator("html")).toHaveAttribute("data-theme", "shopify");

    // Click the Figma card
    const figmaCard = page.getByText("Figma", { exact: true });
    await figmaCard.click();

    // Verify data-theme updated
    await expect(page.locator("html")).toHaveAttribute("data-theme", "figma");

    // The card should now show active state
    const figmaButton = page.locator("button[data-active='true']");
    await expect(figmaButton).toContainText("Figma");
  });

  test("clicking back to Shopify restores default data-theme", async ({
    page,
  }) => {
    await page.goto("/ajustes");

    // Switch to Stripe first
    await page.getByText("Stripe", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "stripe");

    // Click Shopify to go back
    await page.getByText("Shopify", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "shopify");
  });

  test("category tabs filter theme cards", async ({ page }) => {
    await page.goto("/ajustes");

    // Click Fintech tab
    await page.getByRole("tab", { name: "Fintech" }).click();

    // Only Stripe should be visible (only fintech theme in registry)
    await expect(page.getByText("Stripe", { exact: true })).toBeVisible();
    // Shopify (ecommerce) should not be visible
    await expect(page.getByText("Shopify", { exact: true })).not.toBeVisible();
  });

  test("restore default button resets to shopify", async ({ page }) => {
    await page.goto("/ajustes");

    // Switch to Tesla
    await page.getByText("Tesla", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "tesla");

    // Click restore default
    await page.getByText("Restaurar predeterminado").click();

    // Should be back to shopify
    await expect(page.locator("html")).toHaveAttribute("data-theme", "shopify");
  });
});

test.describe("Theme persistence", () => {
  test("selected theme persists across page reload", async ({ page }) => {
    await page.goto("/ajustes");

    // Select Linear theme
    await page.getByText("Linear", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "linear");

    // Reload the page
    await page.reload();

    // Theme should persist
    await expect(page.locator("html")).toHaveAttribute("data-theme", "linear");

    // Linear card should be marked active after reload
    const activeCard = page.locator("button[data-active='true']");
    await expect(activeCard).toContainText("Linear");
  });

  test("theme cookie is set correctly after selection", async ({ page }) => {
    await page.goto("/ajustes");

    // Select Mistral theme
    await page.getByText("Mistral", { exact: true }).click();

    // Verify cookie is set
    const cookies = await page.context().cookies();
    const themeCookie = cookies.find((c) => c.name === "theme");
    expect(themeCookie).toBeDefined();
    expect(themeCookie!.value).toBe("mistral");
    expect(themeCookie!.path).toBe("/");
  });
});

test.describe("FOUC prevention", () => {
  test("page loads with correct data-theme when cookie is pre-set", async ({
    page,
  }) => {
    // Set the cookie before navigating
    await page.context().addCookies([
      {
        name: "theme",
        value: "spotify",
        path: "/",
        domain: "localhost",
      },
    ]);

    // Navigate to homepage — data-theme should be spotify from SSR
    await page.goto("/");

    // Check data-theme is correct immediately
    await expect(page.locator("html")).toHaveAttribute("data-theme", "spotify");
  });

  test("settings page loads with correct data-theme from pre-set cookie", async ({
    page,
  }) => {
    await page.context().addCookies([
      {
        name: "theme",
        value: "apple",
        path: "/",
        domain: "localhost",
      },
    ]);

    await page.goto("/ajustes");

    // data-theme from SSR
    await expect(page.locator("html")).toHaveAttribute("data-theme", "apple");

    // Apple card should be active
    const activeCard = page.locator("button[data-active='true']");
    await expect(activeCard).toContainText("Apple");
  });
});
