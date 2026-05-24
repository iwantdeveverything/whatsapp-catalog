import { describe, it, expect } from "vitest";
import { generateProductJsonLd } from "@/lib/jsonld";
import type { Product } from "@/lib/schemas";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-product",
    name: "Test Product",
    description: "A test product description",
    price: 10000,
    images: ["https://example.com/photo.jpg"],
    category: "Test",
    isActive: true,
    ...overrides,
  };
}

describe("generateProductJsonLd", () => {
  it("returns a JSON-LD object with @context and @type Product", () => {
    const product = createProduct();
    const jsonld = generateProductJsonLd(product);
    expect(jsonld["@context"]).toBe("https://schema.org");
    expect(jsonld["@type"]).toBe("Product");
  });

  it("includes the product name", () => {
    const product = createProduct({ name: "Mochila Viajera" });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.name).toBe("Mochila Viajera");
  });

  it("includes the product description", () => {
    const product = createProduct({
      description: "Una mochila impermeable 40L",
    });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.description).toBe("Una mochila impermeable 40L");
  });

  it("includes the primary image URL", () => {
    const product = createProduct({
      images: [
        "https://example.com/zapas.jpg",
        "https://example.com/zapas2.jpg",
      ],
    });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.image).toBe("https://example.com/zapas.jpg");
  });

  it("includes an Offer with numeric price", () => {
    const product = createProduct({ price: 85000 });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.offers).toBeDefined();
    expect(jsonld.offers["@type"]).toBe("Offer");
    expect(jsonld.offers.price).toBe(85000);
    expect(jsonld.offers.priceCurrency).toBe("ARS");
  });

  it('sets price to 0 when price is "Consultar"', () => {
    const product = createProduct({ price: "Consultar" as const });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.offers.price).toBe(0);
  });

  it("includes the category", () => {
    const product = createProduct({ category: "Calzado" });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.category).toBe("Calzado");
  });

  it("includes availability as InStock for active products", () => {
    const product = createProduct({ isActive: true });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld.offers.availability).toBe("https://schema.org/InStock");
  });

  it("does not include isActive field in the JSON-LD output (it's internal)", () => {
    const product = createProduct({ isActive: false });
    const jsonld = generateProductJsonLd(product);
    expect(jsonld).not.toHaveProperty("isActive");
  });
});
