import { describe, it, expect } from "vitest";
import { generateFallbackOgImage } from "@/lib/og/fallback";
import type { Product } from "@/lib/schemas";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-product",
    name: "Test Product",
    description: "A test product",
    price: 10000,
    images: ["https://example.com/photo.jpg"],
    category: "Test",
    isActive: true,
    ...overrides,
  };
}

describe("generateFallbackOgImage", () => {
  it("returns the configured fallback dimensions (1200×630)", () => {
    const product = createProduct();
    const result = generateFallbackOgImage(product);
    expect(result).toHaveProperty("width", 1200);
    expect(result).toHaveProperty("height", 630);
  });

  it("includes the product name in the fallback data", () => {
    const product = createProduct({ name: "Zapatillas Running" });
    const result = generateFallbackOgImage(product);
    expect(result.name).toBe("Zapatillas Running");
  });

  it('includes "Consultar" when price is "Consultar"', () => {
    const product = createProduct({
      name: "Diseño",
      price: "Consultar" as const,
    });
    const result = generateFallbackOgImage(product);
    expect(result.price).toBe("Consultar");
  });

  it("formats numeric price with es-AR locale", () => {
    const product = createProduct({ name: "Zapatillas", price: 85000 });
    const result = generateFallbackOgImage(product);
    expect(result.price).toBe("$85.000");
  });

  it("uses a branded color scheme (defines background and foreground)", () => {
    const product = createProduct();
    const result = generateFallbackOgImage(product);
    expect(result.background).toBeDefined();
    expect(result.foreground).toBeDefined();
    expect(result.background).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(result.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("includes the business name as a watermark", () => {
    const product = createProduct();
    const result = generateFallbackOgImage(product);
    expect(result.businessName).toBe("Catálogo Digital");
  });
});
