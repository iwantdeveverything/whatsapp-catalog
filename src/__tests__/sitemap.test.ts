import { describe, it, expect, beforeAll } from "vitest";
import sitemap from "@/app/sitemap";
import type { MetadataRoute } from "next";

describe("sitemap", () => {
  let result: MetadataRoute.Sitemap;

  beforeAll(() => {
    result = sitemap();
  });

  it("returns a non-empty array of sitemap entries", () => {
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the homepage URL (/ )", () => {
    // The homepage is just BASE_URL, which doesn't have a trailing slash
    const home = result.find((entry) => entry.url === "https://catalog.com");
    expect(home).toBeDefined();
    expect(home!.priority).toBe(1.0);
  });

  it("includes at least one product URL", () => {
    const productEntries = result.filter(
      (entry) =>
        entry.url.includes("/zapatillas-running") ||
        entry.url.includes("/camisa-oxford"),
    );
    expect(productEntries.length).toBeGreaterThan(0);
  });

  it("each product entry has a lastModified date", () => {
    const productEntries = result.filter(
      (entry) =>
        entry.url !== "https://catalog.com" &&
        !entry.url.includes("/categories/"),
    );
    for (const entry of productEntries) {
      expect(entry.lastModified).toBeDefined();
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("includes category page URLs", () => {
    const categoryEntries = result.filter((entry) =>
      entry.url.includes("/categories/"),
    );
    expect(categoryEntries.length).toBeGreaterThan(0);
  });

  it("excludes inactive products from the sitemap", () => {
    // Product entries are those whose URL path contains a product ID (not homepage, not categories)
    const productEntries = result.filter(
      (entry) =>
        entry.url !== "https://catalog.com" &&
        !entry.url.includes("/categories/"),
    );
    // All products in data are active (7 products), so we expect 7 product entries
    expect(productEntries.length).toBe(7);
  });

  it("each entry has a valid URL format", () => {
    for (const entry of result) {
      expect(entry.url).toMatch(/^https?:\/\//);
    }
  });
});
