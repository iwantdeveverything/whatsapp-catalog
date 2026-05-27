import { describe, it, expect, beforeEach } from "vitest";
import { reset as resetCategories } from "@/lib/services/mock/mockCategoryService";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import type { Category } from "@/lib/services/interfaces";

describe("adminCategoryStore", () => {
  beforeEach(() => {
    resetCategories();
    useAdminCategoryStore.setState({ categories: [], loading: false, error: null });
  });

  // ─── initial state ──────────────────────────────────────

  it("starts with empty categories, loading false, error null", () => {
    const state = useAdminCategoryStore.getState();
    expect(state.categories).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ─── fetchCategories() ──────────────────────────────────

  describe("fetchCategories()", () => {
    it("populates categories from the service", async () => {
      await useAdminCategoryStore.getState().fetchCategories();

      const state = useAdminCategoryStore.getState();
      expect(state.categories.length).toBeGreaterThan(0);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("sets loading to true while fetching", async () => {
      const fetchPromise = useAdminCategoryStore.getState().fetchCategories();
      expect(useAdminCategoryStore.getState().loading).toBe(true);

      await fetchPromise;
      expect(useAdminCategoryStore.getState().loading).toBe(false);
    });

    it("each category has expected shape", async () => {
      await useAdminCategoryStore.getState().fetchCategories();

      for (const cat of useAdminCategoryStore.getState().categories) {
        expect(cat).toHaveProperty("id");
        expect(cat).toHaveProperty("name");
        expect(cat).toHaveProperty("slug");
        expect(cat).toHaveProperty("productCount");
      }
    });
  });

  // ─── createCategory() ───────────────────────────────────

  describe("createCategory()", () => {
    it("creates a category and shows it in the list", async () => {
      const created = await useAdminCategoryStore
        .getState()
        .createCategory({ name: "Electrónica" });

      expect(created.name).toBe("Electrónica");
      expect(created.slug).toBe("electronica");
      expect(created.productCount).toBe(0);

      const names = useAdminCategoryStore
        .getState()
        .categories.map((c: Category) => c.name);
      expect(names).toContain("Electrónica");
    });

    it("rejects category with empty name", async () => {
      await expect(
        useAdminCategoryStore.getState().createCategory({ name: "" }),
      ).rejects.toThrow();
    });
  });

  // ─── updateCategory() ───────────────────────────────────

  describe("updateCategory()", () => {
    it("updates an existing category name and regenerates slug", async () => {
      const created = await useAdminCategoryStore
        .getState()
        .createCategory({ name: "Original" });

      const updated = await useAdminCategoryStore
        .getState()
        .updateCategory(created.id, { name: "Renamed" });

      expect(updated.name).toBe("Renamed");
      expect(updated.slug).toBe("renamed");

      const cat = useAdminCategoryStore
        .getState()
        .categories.find((c: Category) => c.id === created.id);
      expect(cat?.name).toBe("Renamed");
    });

    it("throws when updating non-existent category", async () => {
      await expect(
        useAdminCategoryStore.getState().updateCategory("bad-id", { name: "X" }),
      ).rejects.toThrow();
    });
  });

  // ─── deleteCategory() ───────────────────────────────────

  describe("deleteCategory()", () => {
    it("deletes a category with no products", async () => {
      const created = await useAdminCategoryStore
        .getState()
        .createCategory({ name: "Vacía" });

      await useAdminCategoryStore.getState().deleteCategory(created.id);

      const ids = useAdminCategoryStore
        .getState()
        .categories.map((c: Category) => c.id);
      expect(ids).not.toContain(created.id);
    });

    it("throws when trying to delete category that has products", async () => {
      // Seed categories include product counts > 0 from seed data
      await useAdminCategoryStore.getState().fetchCategories();
      const state = useAdminCategoryStore.getState();
      const catWithProducts = state.categories.find(
        (c: Category) => c.productCount > 0,
      );

      if (catWithProducts) {
        await expect(
          useAdminCategoryStore.getState().deleteCategory(catWithProducts.id),
        ).rejects.toThrow("Cannot delete category with existing products");
      }
    });

    it("throws when deleting non-existent category", async () => {
      await expect(
        useAdminCategoryStore.getState().deleteCategory("not-real"),
      ).rejects.toThrow();
    });
  });

  // ─── loading + error ────────────────────────────────────

  describe("loading and error states", () => {
    it("loading goes false after fetchCategories completes", async () => {
      await useAdminCategoryStore.getState().fetchCategories();
      expect(useAdminCategoryStore.getState().loading).toBe(false);
    });

    it("error is null after successful operations", async () => {
      await useAdminCategoryStore.getState().fetchCategories();
      expect(useAdminCategoryStore.getState().error).toBeNull();

      await useAdminCategoryStore
        .getState()
        .createCategory({ name: "Test" });
      expect(useAdminCategoryStore.getState().error).toBeNull();
    });
  });
});
