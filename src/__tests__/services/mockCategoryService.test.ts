import { describe, it, expect, beforeEach } from "vitest";
import {
  mockCategoryService,
  reset as resetCategories,
} from "@/lib/services/mock/mockCategoryService";

describe("mockCategoryService", () => {
  beforeEach(() => {
    resetCategories();
  });

  // ─── list() ───────────────────────────────────────────

  describe("list()", () => {
    it("returns all categories", async () => {
      const categories = await mockCategoryService.list();
      expect(categories.length).toBeGreaterThan(0);
      // Each category should have required fields
      for (const cat of categories) {
        expect(cat.id).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.slug).toBeTruthy();
        expect(typeof cat.productCount).toBe("number");
      }
    });

    it("includes productCount for each category", async () => {
      const categories = await mockCategoryService.list();
      for (const cat of categories) {
        expect(cat.productCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ─── getById() ────────────────────────────────────────

  describe("getById()", () => {
    it("returns a category by id", async () => {
      const categories = await mockCategoryService.list();
      const first = categories[0];
      const found = await mockCategoryService.getById(first.id);
      expect(found).not.toBeNull();
      expect(found!.name).toBe(first.name);
      expect(found!.slug).toBe(first.slug);
    });

    it("returns null for non-existent id", async () => {
      const found = await mockCategoryService.getById("nonexistent");
      expect(found).toBeNull();
    });
  });

  // ─── create() ─────────────────────────────────────────

  describe("create()", () => {
    it("creates a category with auto-generated slug", async () => {
      const category = await mockCategoryService.create({
        name: "Running Shoes",
      });

      expect(category.name).toBe("Running Shoes");
      expect(category.slug).toBe("running-shoes");
      expect(category.id).toBeTruthy();
      expect(category.productCount).toBe(0);
    });

    it("slug is lowercase with hyphens replacing spaces", async () => {
      const category = await mockCategoryService.create({
        name: "High End Fashion",
      });

      expect(category.slug).toBe("high-end-fashion");
    });

    it("slug strips special characters", async () => {
      const category = await mockCategoryService.create({
        name: "Men's & Women's Wear",
      });

      // slug should not contain apostrophes or ampersands
      expect(category.slug).not.toContain("'");
      expect(category.slug).not.toContain("&");
    });

    it("slug handles accented characters", async () => {
      const category = await mockCategoryService.create({
        name: "Calzado Deportivo",
      });

      expect(category.slug).toBe("calzado-deportivo");
    });

    it("generates unique id from slug when duplicate names are used", async () => {
      const first = await mockCategoryService.create({
        name: "Unique",
      });
      const second = await mockCategoryService.create({
        name: "Unique",
      });

      expect(second.id).not.toBe(first.id);
      // The second should have a suffix
      expect(second.id).toContain("unique");
    });

    it("validates input with CategoryFormSchema", async () => {
      await expect(
        mockCategoryService.create({ name: "" }),
      ).rejects.toThrow();
    });

    it("new category appears in list()", async () => {
      const before = await mockCategoryService.list();
      await mockCategoryService.create({ name: "New Category" });
      const after = await mockCategoryService.list();
      expect(after.length).toBe(before.length + 1);
      expect(after.some((c) => c.name === "New Category")).toBe(true);
    });
  });

  // ─── update() ─────────────────────────────────────────

  describe("update()", () => {
    it("updates category name and regenerates slug", async () => {
      const categories = await mockCategoryService.list();
      const target = categories[0];

      const updated = await mockCategoryService.update(target.id, {
        name: "New Name",
      });

      expect(updated.name).toBe("New Name");
      expect(updated.slug).toBe("new-name");
      expect(updated.id).toBe(target.id); // id unchanged
    });

    it("preserves fields not in update data", async () => {
      const categories = await mockCategoryService.list();
      const target = categories[0];

      const updated = await mockCategoryService.update(target.id, {});
      expect(updated.name).toBe(target.name);
      expect(updated.slug).toBe(target.slug);
    });

    it("throws on non-existent category", async () => {
      await expect(
        mockCategoryService.update("nonexistent", { name: "X" }),
      ).rejects.toThrow("not found");
    });

    it("update persists so getById returns updated data", async () => {
      const categories = await mockCategoryService.list();
      const target = categories[0];

      await mockCategoryService.update(target.id, {
        description: "Updated desc",
      });

      const found = await mockCategoryService.getById(target.id);
      expect(found!.description).toBe("Updated desc");
    });
  });

  // ─── delete() ─────────────────────────────────────────

  describe("delete()", () => {
    it("deletes a category with no products", async () => {
      // Create a fresh category with productCount = 0
      const created = await mockCategoryService.create({
        name: "Empty Category",
      });

      const before = await mockCategoryService.list();
      await mockCategoryService.delete(created.id);
      const after = await mockCategoryService.list();

      expect(after.length).toBe(before.length - 1);
      const found = await mockCategoryService.getById(created.id);
      expect(found).toBeNull();
    });

    it("blocks delete when productCount > 0", async () => {
      // Find a category that has products (from seed data)
      const categories = await mockCategoryService.list();
      const withProducts = categories.find((c) => c.productCount > 0);
      expect(withProducts).toBeDefined();

      await expect(
        mockCategoryService.delete(withProducts!.id),
      ).rejects.toThrow("Cannot delete category with existing products");
    });

    it("throws on non-existent category", async () => {
      await expect(
        mockCategoryService.delete("nonexistent"),
      ).rejects.toThrow("not found");
    });
  });

  // ─── reset() ──────────────────────────────────────────

  describe("reset()", () => {
    it("restores categories to initial state after mutations", async () => {
      const original = await mockCategoryService.list();
      await mockCategoryService.create({ name: "Temp" });

      resetCategories();
      const restored = await mockCategoryService.list();

      expect(restored.length).toBe(original.length);
      expect(restored.some((c) => c.name === "Temp")).toBe(false);
    });
  });
});
