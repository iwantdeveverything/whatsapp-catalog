import { describe, it, expect } from "vitest";
import {
  validateThemeTokens,
  ThemeCategory,
} from "@/lib/themes/types";

describe("Theme Registry", () => {
  let AVAILABLE_THEMES: Array<{
    id: string;
    name: string;
    category: ThemeCategory;
    tokens: Record<string, string>;
    fonts: { family: string; googleFontsUrl?: string; fallback: string };
    description: string;
    metadata: { source: string };
  }>;
  let getThemeById: (id: string) =>
    | {
        id: string;
        name: string;
        category: ThemeCategory;
        tokens: Record<string, string>;
        description: string;
      }
    | undefined;

  beforeAll(async () => {
    const registry = await import("@/lib/themes/registry");
    AVAILABLE_THEMES = registry.AVAILABLE_THEMES;
    getThemeById = registry.getThemeById;
  });

  // ── Size and uniqueness ──

  it("contains exactly 16 curated themes", () => {
    expect(AVAILABLE_THEMES).toHaveLength(16);
  });

  it("has all unique theme IDs", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // ── Token validation ──

  it("every theme has valid tokens passing validateThemeTokens", () => {
    for (const theme of AVAILABLE_THEMES) {
      expect(
        validateThemeTokens(theme.tokens),
        `Theme "${theme.id}" tokens are not valid`,
      ).toBe(true);
    }
  });

  it("every theme has 10 token keys (no more, no less)", () => {
    const expectedKeys = [
      "canvas",
      "ink",
      "surface1",
      "surface2",
      "surface3",
      "hairline",
      "muted",
      "primary",
      "onPrimary",
      "accent",
    ];
    for (const theme of AVAILABLE_THEMES) {
      const actualKeys = Object.keys(theme.tokens).sort();
      expect(
        actualKeys,
        `Theme "${theme.id}" has wrong token keys`,
      ).toEqual([...expectedKeys].sort());
    }
  });

  it('every theme defines primary text color contrast (ink vs canvas are different)', () => {
    for (const theme of AVAILABLE_THEMES) {
      expect(
        theme.tokens.ink.toLowerCase(),
        `Theme "${theme.id}" ink and canvas must differ: both are ${theme.tokens.ink}`,
      ).not.toBe(theme.tokens.canvas.toLowerCase());
    }
  });

  // ── Structure ──

  it("every theme has required structural fields", () => {
    for (const theme of AVAILABLE_THEMES) {
      expect(typeof theme.id).toBe("string");
      expect(theme.id.length).toBeGreaterThan(0);
      expect(typeof theme.name).toBe("string");
      expect(theme.name.length).toBeGreaterThan(0);
      expect(Object.values(ThemeCategory)).toContain(theme.category);
      expect(typeof theme.description).toBe("string");
      expect(theme.description.length).toBeGreaterThan(0);
      expect(typeof theme.metadata.source).toBe("string");
      expect(theme.metadata.source).toContain("github.com/voltagent/awesome-design-md");
    }
  });

  it("every theme has font configuration", () => {
    for (const theme of AVAILABLE_THEMES) {
      expect(typeof theme.fonts.family).toBe("string");
      expect(theme.fonts.family.length).toBeGreaterThan(0);
      expect(typeof theme.fonts.fallback).toBe("string");
      expect(theme.fonts.fallback.length).toBeGreaterThan(0);
    }
  });

  // ── Shopify is the default (first in array) ──

  it('has "shopify" as the first theme in the array', () => {
    expect(AVAILABLE_THEMES[0].id).toBe("shopify");
  });

  // ── getThemeById ──

  it("getThemeById returns the correct theme for valid IDs", () => {
    const nike = getThemeById("nike");
    expect(nike).toBeDefined();
    expect(nike!.name).toBe("Nike");
  });

  it("getThemeById returns undefined for non-existent IDs", () => {
    expect(getThemeById("nonexistent-theme-id")).toBeUndefined();
  });

  it("returns every theme by calling getThemeById for each ID", () => {
    for (const theme of AVAILABLE_THEMES) {
      const found = getThemeById(theme.id);
      expect(found, `getThemeById("${theme.id}") returned undefined`).toBeDefined();
      expect(found!.id).toBe(theme.id);
      expect(found!.name).toBe(theme.name);
    }
  });

  // ── Well-known themes exist ──

  it("includes well-known e-commerce themes", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("nike");
    expect(ids).toContain("airbnb");
    expect(ids).toContain("starbucks");
    expect(ids).toContain("luxury");
  });

  it("includes well-known devtools themes", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("vercel");
    expect(ids).toContain("linear");
    expect(ids).toContain("supabase");
  });

  it("includes well-known design themes", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("figma");
    expect(ids).toContain("notion");
  });

  it("includes well-known media themes", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("apple");
    expect(ids).toContain("spotify");
    expect(ids).toContain("tesla");
  });

  it("includes fintech theme", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("stripe");
  });

  it("includes AI themes", () => {
    const ids = AVAILABLE_THEMES.map((t) => t.id);
    expect(ids).toContain("claude");
    expect(ids).toContain("mistral");
  });

  // ── Category grouping ──

  it("themes are categorized correctly", () => {
    const byCategory = new Map<string, number>();
    for (const theme of AVAILABLE_THEMES) {
      byCategory.set(
        theme.category,
        (byCategory.get(theme.category) ?? 0) + 1,
      );
    }
    expect(byCategory.get("ecommerce")).toBe(5);
    expect(byCategory.get("media")).toBe(3);
    expect(byCategory.get("devtools")).toBe(3);
    expect(byCategory.get("design")).toBe(2);
    expect(byCategory.get("fintech")).toBe(1);
    expect(byCategory.get("ai")).toBe(2);
  });
});
