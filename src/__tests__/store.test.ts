import { describe, it, expect, beforeEach } from "vitest";
import { useCatalogStore } from "@/lib/store";

describe("useCatalogStore", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      searchQuery: "",
      activeCategory: null,
      isMobileMenuOpen: false,
    });
  });

  // --- Initial state ---

  it("has correct initial state", () => {
    const state = useCatalogStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.activeCategory).toBeNull();
    expect(state.isMobileMenuOpen).toBe(false);
  });

  // --- setSearchQuery ---

  it("updates searchQuery when setSearchQuery is called", () => {
    useCatalogStore.getState().setSearchQuery("zap");
    expect(useCatalogStore.getState().searchQuery).toBe("zap");
  });

  it("clears searchQuery when setSearchQuery('') is called", () => {
    useCatalogStore.getState().setSearchQuery("zap");
    useCatalogStore.getState().setSearchQuery("");
    expect(useCatalogStore.getState().searchQuery).toBe("");
  });

  // --- setActiveCategory ---

  it("updates activeCategory when setActiveCategory is called", () => {
    useCatalogStore.getState().setActiveCategory("Calzado");
    expect(useCatalogStore.getState().activeCategory).toBe("Calzado");
  });

  it("clears activeCategory when setActiveCategory(null) is called", () => {
    useCatalogStore.getState().setActiveCategory("Calzado");
    useCatalogStore.getState().setActiveCategory(null);
    expect(useCatalogStore.getState().activeCategory).toBeNull();
  });

  it("overwrites activeCategory when set to different category", () => {
    useCatalogStore.getState().setActiveCategory("Calzado");
    useCatalogStore.getState().setActiveCategory("Ropa");
    expect(useCatalogStore.getState().activeCategory).toBe("Ropa");
  });

  // --- toggleMobileMenu ---

  it("toggles isMobileMenuOpen from false to true", () => {
    useCatalogStore.getState().toggleMobileMenu();
    expect(useCatalogStore.getState().isMobileMenuOpen).toBe(true);
  });

  it("toggles isMobileMenuOpen from true to false", () => {
    useCatalogStore.getState().toggleMobileMenu();
    useCatalogStore.getState().toggleMobileMenu();
    expect(useCatalogStore.getState().isMobileMenuOpen).toBe(false);
  });

  // --- Multiple toggles ---

  it("handles multiple toggleMobileMenu calls correctly", () => {
    useCatalogStore.getState().toggleMobileMenu();
    useCatalogStore.getState().toggleMobileMenu();
    useCatalogStore.getState().toggleMobileMenu();
    expect(useCatalogStore.getState().isMobileMenuOpen).toBe(true);
  });
});
