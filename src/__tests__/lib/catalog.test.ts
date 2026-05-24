import { describe, it, expect } from "vitest";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
} from "@/lib/data/catalog";

describe("getAllProducts", () => {
  it("returns all products with correct types", () => {
    const products = getAllProducts();
    expect(products.length).toBeGreaterThanOrEqual(5);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("description");
    expect(products[0]).toHaveProperty("price");
    expect(products[0]).toHaveProperty("images");
    expect(products[0]).toHaveProperty("category");
    expect(products[0].images.length).toBeGreaterThanOrEqual(1);
  });

  it("returns only active products (isActive = true)", () => {
    const products = getAllProducts();
    const inactiveProducts = products.filter((p) => !p.isActive);
    expect(inactiveProducts).toHaveLength(0);
  });
});

describe("getProductById", () => {
  it("returns a product by its id", () => {
    const product = getProductById("zapatillas-running");
    expect(product).toBeDefined();
    expect(product!.id).toBe("zapatillas-running");
    expect(product!.name).toBe("Zapatillas Running");
  });

  it("returns undefined for a non-existent id", () => {
    const product = getProductById("nonexistent-product-id");
    expect(product).toBeUndefined();
  });
});

describe("getProductsByCategory", () => {
  it("returns products filtered by category", () => {
    const products = getProductsByCategory("Calzado");
    expect(products.length).toBeGreaterThan(0);
    products.forEach((p) => {
      expect(p.category).toBe("Calzado");
    });
  });

  it("returns empty array for category with no products", () => {
    const products = getProductsByCategory("NonExistentCategory");
    expect(products).toEqual([]);
  });

  it("is case-sensitive (exact match)", () => {
    const productsLower = getProductsByCategory("calzado");
    const productsUpper = getProductsByCategory("CALZADO");
    // "calzado" (lowercase) does NOT match "Calzado" — case-sensitive by design
    expect(productsLower).toEqual([]);
    expect(productsUpper).toEqual([]);
  });
});
