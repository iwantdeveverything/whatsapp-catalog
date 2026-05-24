import { describe, it, expect } from "vitest";
import { CatalogSchema } from "@/lib/schemas";

describe("CatalogSchema", () => {
  const validProduct = {
    id: "test-product",
    name: "Test Product",
    description: "A test product",
    price: 100 as const,
    images: ["https://example.com/test.jpg"],
    category: "Testing",
  };

  it("validates a complete catalog with products", () => {
    const catalog = {
      businessName: "Mi Tienda",
      description: "Catálogo de productos",
      products: [validProduct],
    };

    const result = CatalogSchema.parse(catalog);
    expect(result.businessName).toBe("Mi Tienda");
    expect(result.description).toBe("Catálogo de productos");
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe("Test Product");
  });

  it("rejects a catalog with missing businessName", () => {
    const invalidCatalog = {
      description: "Catálogo de productos",
      products: [validProduct],
    };

    expect(() => CatalogSchema.parse(invalidCatalog)).toThrow();
  });

  it("rejects a catalog with missing description", () => {
    const invalidCatalog = {
      businessName: "Mi Tienda",
      products: [validProduct],
    };

    expect(() => CatalogSchema.parse(invalidCatalog)).toThrow();
  });

  it("rejects a catalog with missing products array", () => {
    const invalidCatalog = {
      businessName: "Mi Tienda",
      description: "Catálogo de productos",
    };

    expect(() => CatalogSchema.parse(invalidCatalog)).toThrow();
  });

  it("rejects a catalog with an invalid product in the array", () => {
    const invalidCatalog = {
      businessName: "Mi Tienda",
      description: "Catálogo de productos",
      products: [
        {
          id: "bad-product",
          name: "",
          description: "No name",
          price: 50,
          images: ["https://example.com/img.jpg"],
          category: "Test",
        },
      ],
    };

    expect(() => CatalogSchema.parse(invalidCatalog)).toThrow();
  });

  it("allows an empty products array", () => {
    const catalog = {
      businessName: "Mi Tienda",
      description: "Catálogo de productos",
      products: [],
    };

    const result = CatalogSchema.parse(catalog);
    expect(result.products).toHaveLength(0);
  });
});
