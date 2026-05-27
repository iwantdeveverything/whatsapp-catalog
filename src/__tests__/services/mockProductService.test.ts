import { describe, it, expect, beforeEach } from "vitest";
import {
  mockProductService,
  reset as resetProducts,
} from "@/lib/services/mock/mockProductService";
import type { Product } from "@/lib/schemas";

describe("mockProductService", () => {
  beforeEach(() => {
    resetProducts();
  });

  // ─── list() ───────────────────────────────────────────

  describe("list()", () => {
    it("returns all active products by default", async () => {
      const result = await mockProductService.list();
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.total).toBe(result.products.length);
      // All products should be active
      for (const p of result.products) {
        expect(p.isActive).toBe(true);
      }
    });

    it("filters by search term (case-insensitive name match)", async () => {
      const result = await mockProductService.list({ search: "zapatillas" });
      expect(result.products.length).toBeGreaterThan(0);
      for (const p of result.products) {
        expect(p.name.toLowerCase()).toContain("zapatillas");
      }
      expect(result.total).toBe(result.products.length);
    });

    it("returns empty list when search matches nothing", async () => {
      const result = await mockProductService.list({ search: "xyznonexistent" });
      expect(result.products).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("filters by category", async () => {
      const result = await mockProductService.list({ category: "Calzado" });
      expect(result.products.length).toBeGreaterThan(0);
      for (const p of result.products) {
        expect(p.category).toBe("Calzado");
      }
    });

    it("combines search and category filters", async () => {
      const result = await mockProductService.list({
        search: "zapatillas",
        category: "Calzado",
      });
      expect(result.products.length).toBeGreaterThan(0);
      for (const p of result.products) {
        expect(p.name.toLowerCase()).toContain("zapatillas");
        expect(p.category).toBe("Calzado");
      }
    });

    it("sorts by name ascending", async () => {
      const result = await mockProductService.list({
        sortBy: "name",
        sortOrder: "asc",
      });
      const names = result.products.map((p) => p.name.toLowerCase());
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });

    it("sorts by name descending", async () => {
      const result = await mockProductService.list({
        sortBy: "name",
        sortOrder: "desc",
      });
      const names = result.products.map((p) => p.name.toLowerCase());
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    });

    it("sorts by price ascending", async () => {
      const result = await mockProductService.list({
        sortBy: "price",
        sortOrder: "asc",
      });
      const prices = result.products.map((p) =>
        typeof p.price === "number" ? p.price : Infinity,
      );
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it("sorts by price descending", async () => {
      const result = await mockProductService.list({
        sortBy: "price",
        sortOrder: "desc",
      });
      const prices = result.products.map((p) =>
        typeof p.price === "number" ? p.price : Infinity,
      );
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    it('puts "Consultar" products last when sorting by price', async () => {
      const result = await mockProductService.list({
        sortBy: "price",
        sortOrder: "asc",
      });
      const lastPrice = result.products[result.products.length - 1].price;
      expect(lastPrice).toBe("Consultar");
    });

    it("excludes soft-deleted products", async () => {
      // First delete one product
      const initial = await mockProductService.list();
      const firstProduct = initial.products[0];
      await mockProductService.delete(firstProduct.id);

      const after = await mockProductService.list();
      expect(after.products.every((p) => p.id !== firstProduct.id)).toBe(true);
      expect(after.total).toBe(after.products.length);
    });

    it("returns empty search for empty string", async () => {
      const result = await mockProductService.list({ search: "" });
      // Empty search string should not filter
      expect(result.products.length).toBeGreaterThan(0);
    });
  });

  // ─── getById() ────────────────────────────────────────

  describe("getById()", () => {
    it("returns a product by id", async () => {
      const product = await mockProductService.getById("zapatillas-running");
      expect(product).not.toBeNull();
      expect(product!.name).toBe("Zapatillas Running");
    });

    it("returns null for non-existent id", async () => {
      const product = await mockProductService.getById("non-existent");
      expect(product).toBeNull();
    });
  });

  // ─── create() ─────────────────────────────────────────

  describe("create()", () => {
    it("creates a product and returns it with generated id", async () => {
      const data = {
        name: "New Product",
        price: 5000,
        category: "NewCat",
        isActive: true,
      };

      const product = await mockProductService.create(data);
      expect(product.name).toBe("New Product");
      expect(product.price).toBe(5000);
      expect(product.category).toBe("NewCat");
      expect(product.id).toBeTruthy();
      expect(product.isActive).toBe(true);
    });

    it("generates a slug-based ID from the product name", async () => {
      const product = await mockProductService.create({
        name: "Hello World Product",
        price: 100,
        category: "Test",
        isActive: true,
      });

      expect(product.id).toContain("hello");
      expect(product.id).toContain("world");
      expect(product.id).toContain("product");
    });

    it("validates input with ProductFormSchema and throws on invalid data", async () => {
      await expect(
        mockProductService.create({
          name: "", // empty name should fail
          price: -100, // negative price should fail
          category: "",
          isActive: true,
        }),
      ).rejects.toThrow();
    });

    it("validates that name is required", async () => {
      await expect(
        mockProductService.create({
          name: "",
          price: 100,
          category: "Cat",
          isActive: true,
        }),
      ).rejects.toThrow();
    });

    it("stores the new product so list() includes it", async () => {
      const before = await mockProductService.list();
      await mockProductService.create({
        name: "Added Product",
        price: 999,
        category: "Test",
        isActive: true,
      });
      const after = await mockProductService.list();
      expect(after.total).toBe(before.total + 1);
      expect(
        after.products.some((p) => p.name === "Added Product"),
      ).toBe(true);
    });
  });

  // ─── update() ─────────────────────────────────────────

  describe("update()", () => {
    it("updates only provided fields", async () => {
      const updated = await mockProductService.update("zapatillas-running", {
        name: "Zapatillas Actualizadas",
      });

      expect(updated.name).toBe("Zapatillas Actualizadas");
      // Price should be preserved
      expect(updated.price).toBe(85000);
      // Category should be preserved
      expect(updated.category).toBe("Calzado");
    });

    it("preserves fields not in update data", async () => {
      const original = await mockProductService.getById("zapatillas-running");
      const updated = await mockProductService.update("zapatillas-running", {});

      expect(updated.name).toBe(original!.name);
      expect(updated.price).toBe(original!.price);
      expect(updated.category).toBe(original!.category);
    });

    it("throws on non-existent product", async () => {
      await expect(
        mockProductService.update("nonexistent", { name: "X" }),
      ).rejects.toThrow("not found");
    });

    it("update persists so getById returns updated data", async () => {
      await mockProductService.update("zapatillas-running", {
        price: 99999,
      });
      const product = await mockProductService.getById("zapatillas-running");
      expect(product!.price).toBe(99999);
    });
  });

  // ─── delete() ─────────────────────────────────────────

  describe("delete()", () => {
    it("soft-deletes by setting isActive to false", async () => {
      await mockProductService.delete("zapatillas-running");
      const product = await mockProductService.getById("zapatillas-running");
      expect(product).not.toBeNull();
      expect(product!.isActive).toBe(false);
    });

    it("removes deleted product from list() results", async () => {
      const before = await mockProductService.list();
      await mockProductService.delete("zapatillas-running");
      const after = await mockProductService.list();
      expect(after.total).toBe(before.total - 1);
      expect(
        after.products.some((p) => p.id === "zapatillas-running"),
      ).toBe(false);
    });

    it("getById still returns soft-deleted product", async () => {
      await mockProductService.delete("zapatillas-running");
      const product = await mockProductService.getById("zapatillas-running");
      expect(product).not.toBeNull();
    });

    it("throws on non-existent product", async () => {
      await expect(
        mockProductService.delete("nonexistent"),
      ).rejects.toThrow("not found");
    });
  });

  // ─── reset() ──────────────────────────────────────────

  describe("reset()", () => {
    it("restores products to initial state after mutations", async () => {
      await mockProductService.create({
        name: "Temp",
        price: 1,
        category: "T",
        isActive: true,
      });
      await mockProductService.delete("zapatillas-running");

      resetProducts();
      const result = await mockProductService.list();

      // Original products should be back
      const zapatillas = result.products.find(
        (p) => p.id === "zapatillas-running",
      );
      expect(zapatillas).toBeDefined();
      expect(zapatillas!.isActive).toBe(true);

      // Temp product should be gone
      const temp = result.products.find((p) => p.name === "Temp");
      expect(temp).toBeUndefined();
    });
  });
});
