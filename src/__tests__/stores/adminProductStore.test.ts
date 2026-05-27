import { describe, it, expect, beforeEach } from "vitest";
import { reset as resetProducts } from "@/lib/services/mock/mockProductService";
import { useAdminProductStore } from "@/lib/stores/adminProductStore";
import type { Product } from "@/lib/schemas";

describe("adminProductStore", () => {
  beforeEach(() => {
    resetProducts();
    useAdminProductStore.setState({ products: [], loading: false, error: null });
  });

  // ─── initial state ──────────────────────────────────────

  it("starts with empty products, loading false, error null", () => {
    const state = useAdminProductStore.getState();
    expect(state.products).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ─── fetchProducts() ────────────────────────────────────

  describe("fetchProducts()", () => {
    it("populates products from the service", async () => {
      await useAdminProductStore.getState().fetchProducts();

      const state = useAdminProductStore.getState();
      expect(state.products.length).toBeGreaterThan(0);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("sets loading to true while fetching and false after", async () => {
      const fetchPromise = useAdminProductStore.getState().fetchProducts();
      // loading should be true immediately after calling (async but synchronous start)
      expect(useAdminProductStore.getState().loading).toBe(true);

      await fetchPromise;
      expect(useAdminProductStore.getState().loading).toBe(false);
    });

    it("filters products by search term", async () => {
      await useAdminProductStore.getState().fetchProducts({ search: "zapatillas" });

      const state = useAdminProductStore.getState();
      expect(state.products.length).toBeGreaterThan(0);
      for (const p of state.products) {
        expect(p.name.toLowerCase()).toContain("zapatillas");
      }
    });

    it("returns empty list when search matches nothing", async () => {
      await useAdminProductStore.getState().fetchProducts({ search: "xyznonexistent" });

      const state = useAdminProductStore.getState();
      expect(state.products).toHaveLength(0);
      expect(state.error).toBeNull();
    });

    it("filters by category", async () => {
      await useAdminProductStore.getState().fetchProducts({ category: "Calzado" });

      const state = useAdminProductStore.getState();
      expect(state.products.length).toBeGreaterThan(0);
      for (const p of state.products) {
        expect(p.category).toBe("Calzado");
      }
    });
  });

  // ─── createProduct() ────────────────────────────────────

  describe("createProduct()", () => {
    it("creates a product and shows it in the list", async () => {
      const created = await useAdminProductStore
        .getState()
        .createProduct({
          name: "New Test Product",
          price: 99.99,
          category: "Test",
        });

      expect(created.name).toBe("New Test Product");
      expect(created.price).toBe(99.99);

      // The list should now include the new product
      const state = useAdminProductStore.getState();
      const names = state.products.map((p: Product) => p.name);
      expect(names).toContain("New Test Product");
    });

    it("rejects invalid product data and sets error", async () => {
      // Missing required `name` field — cast to bypass TS
      await expect(
        useAdminProductStore.getState().createProduct({ price: 10, category: "X" } as unknown as Product),
      ).rejects.toThrow();

      const state = useAdminProductStore.getState();
      // Products list should not have changed from its initial empty state
      expect(state.products).toHaveLength(0);
    });
  });

  // ─── updateProduct() ────────────────────────────────────

  describe("updateProduct()", () => {
    it("updates an existing product name", async () => {
      // First, create a product so we have an ID
      const created = await useAdminProductStore
        .getState()
        .createProduct({
          name: "Original Name",
          price: 50,
          category: "Test",
        });

      const updated = await useAdminProductStore
        .getState()
        .updateProduct(created.id, { name: "Updated Name" });

      expect(updated.name).toBe("Updated Name");

      // Verify it's updated in the list
      const product = useAdminProductStore
        .getState()
        .products.find((p: Product) => p.id === created.id);
      expect(product?.name).toBe("Updated Name");
    });

    it("throws when updating non-existent product", async () => {
      await expect(
        useAdminProductStore.getState().updateProduct("nonexistent-id", { name: "Nope" }),
      ).rejects.toThrow("Product not found");
    });
  });

  // ─── deleteProduct() ────────────────────────────────────

  describe("deleteProduct()", () => {
    it("soft-deletes a product and marks it as inactive", async () => {
      const created = await useAdminProductStore
        .getState()
        .createProduct({
          name: "To Delete",
          price: 10,
          category: "Test",
        });

      await useAdminProductStore.getState().deleteProduct(created.id);

      // After soft-delete, the product remains in the admin list but is inactive
      const state = useAdminProductStore.getState();
      const deletedProduct = state.products.find((p: Product) => p.id === created.id);
      expect(deletedProduct).toBeDefined();
      expect(deletedProduct?.isActive).toBe(false);
    });

    it("throws when deleting non-existent product", async () => {
      await expect(
        useAdminProductStore.getState().deleteProduct("nonexistent-id"),
      ).rejects.toThrow("Product not found");
    });
  });

  // ─── loading + error states ─────────────────────────────

  describe("loading and error states", () => {
    it("loading goes false after fetchProducts completes", async () => {
      await useAdminProductStore.getState().fetchProducts();
      expect(useAdminProductStore.getState().loading).toBe(false);
    });

    it("loading goes false after createProduct completes", async () => {
      await useAdminProductStore
        .getState()
        .createProduct({ name: "Test", price: 10, category: "X" });
      expect(useAdminProductStore.getState().loading).toBe(false);
    });

    it("error is null after successful operations", async () => {
      await useAdminProductStore.getState().fetchProducts();
      expect(useAdminProductStore.getState().error).toBeNull();

      await useAdminProductStore
        .getState()
        .createProduct({ name: "Test", price: 10, category: "X" });
      expect(useAdminProductStore.getState().error).toBeNull();
    });
  });
});
