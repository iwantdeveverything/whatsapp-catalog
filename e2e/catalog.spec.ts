import { test, expect } from "@playwright/test";

test.describe("Catalog browsing", () => {
  test("homepage loads with products visible", async ({ page }) => {
    await page.goto("/");

    // Page title
    await expect(page).toHaveTitle(/catálogo/i);

    // Heading visible
    await expect(
      page.getByRole("heading", { name: /catálogo/i }),
    ).toBeVisible();

    // Products are rendered (ProductCard links)
    const productLinks = page.locator('a[href^="/"]').filter({
      has: page.locator("img"),
    });
    const count = await productLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // At least one known product is visible
    await expect(page.getByText(/zapatillas running/i)).toBeVisible();
  });

  test("search filters products by name", async ({ page }) => {
    await page.goto("/");

    // Type in search bar
    const searchInput = page.getByRole("searchbox", { name: /buscar/i });
    await searchInput.fill("zap");

    // Only matching products visible
    await expect(page.getByText(/zapatillas running/i)).toBeVisible();
    await expect(page.getByText(/zapatos de cuero/i)).toBeVisible();

    // Non-matching products hidden
    await expect(page.getByText(/camisa oxford/i)).not.toBeVisible();
    await expect(page.getByText(/remera algodón/i)).not.toBeVisible();
  });

  test("category filter shows only selected category", async ({ page }) => {
    await page.goto("/");

    // Click "Calzado" filter
    const calzadoButton = page.getByRole("button", { name: /calzado/i });
    await calzadoButton.click();

    // Only Calzado products visible
    await expect(page.getByText(/zapatillas running/i)).toBeVisible();
    await expect(page.getByText(/zapatos de cuero/i)).toBeVisible();

    // Ropa products not visible
    await expect(page.getByText(/camisa oxford/i)).not.toBeVisible();
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/zapatillas-running");

    // Product heading
    await expect(
      page.getByRole("heading", { name: /zapatillas running/i }),
    ).toBeVisible();

    // Price visible
    await expect(page.getByText(/\$85\.000/)).toBeVisible();

    // Description visible
    await expect(page.getByText(/ultralivianas/)).toBeVisible();

    // Image loaded
    const img = page.getByRole("img").first();
    await expect(img).toBeVisible();
  });

  test("WhatsApp CTA button renders on product detail", async ({ page }) => {
    await page.goto("/zapatillas-running");

    // WhatsApp CTA link
    const waLink = page.getByRole("link", {
      name: /consultar por whatsapp/i,
    });
    await expect(waLink).toBeVisible();

    // Verify wa.me URL
    const href = await waLink.getAttribute("href");
    expect(href).toContain("https://wa.me/");
  });
});
