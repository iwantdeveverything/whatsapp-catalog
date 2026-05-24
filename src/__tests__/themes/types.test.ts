import { describe, it, expect } from "vitest";

describe("ThemeTokens", () => {
  it("requires all 10 semantic token keys", async () => {
    const { THEME_TOKEN_KEYS } = await import("@/lib/themes/types");

    expect(THEME_TOKEN_KEYS).toHaveLength(10);
    expect(THEME_TOKEN_KEYS).toContain("canvas");
    expect(THEME_TOKEN_KEYS).toContain("ink");
    expect(THEME_TOKEN_KEYS).toContain("surface1");
    expect(THEME_TOKEN_KEYS).toContain("surface2");
    expect(THEME_TOKEN_KEYS).toContain("surface3");
    expect(THEME_TOKEN_KEYS).toContain("hairline");
    expect(THEME_TOKEN_KEYS).toContain("muted");
    expect(THEME_TOKEN_KEYS).toContain("primary");
    expect(THEME_TOKEN_KEYS).toContain("onPrimary");
    expect(THEME_TOKEN_KEYS).toContain("accent");
  });

  it("validates a ThemeTokens object has correct token values", async () => {
    const { validateThemeTokens } = await import("@/lib/themes/types");

    const valid = validateThemeTokens({
      canvas: "#ffffff",
      ink: "#171717",
      surface1: "#f5f5f5",
      surface2: "#e5e5e5",
      surface3: "#d4d4d4",
      hairline: "#d1d5db",
      muted: "#737373",
      primary: "#0a0a0a",
      onPrimary: "#ffffff",
      accent: "#e63946",
    });
    expect(valid).toBe(true);

    const invalid = validateThemeTokens({
      canvas: "not-a-hex",
      ink: "#171717",
      surface1: "#f5f5f5",
      surface2: "#e5e5e5",
      surface3: "#d4d4d4",
      hairline: "#d1d5db",
      muted: "#737373",
      primary: "#0a0a0a",
      onPrimary: "#ffffff",
      accent: "#e63946",
    });
    expect(invalid).toBe(false);
  });

  it("rejects tokens with missing keys", async () => {
    const { validateThemeTokens } = await import("@/lib/themes/types");

    const missing = validateThemeTokens({
      canvas: "#ffffff",
      // missing ink
      surface1: "#f5f5f5",
      surface2: "#e5e5e5",
      surface3: "#d4d4d4",
      hairline: "#d1d5db",
      muted: "#737373",
      primary: "#0a0a0a",
      onPrimary: "#ffffff",
      accent: "#e63946",
    } as Record<string, string>);
    expect(missing).toBe(false);
  });
});

describe("ThemeDefinition", () => {
  it("requires id, name, category, tokens fields", async () => {
    const { ThemeCategory } = await import("@/lib/themes/types");

    // Verify ThemeCategory has expected values
    const categories = Object.values(ThemeCategory);
    expect(categories).toContain("ecommerce");
    expect(categories).toContain("design");
    expect(categories).toContain("devtools");
    expect(categories).toContain("media");
    expect(categories).toContain("fintech");
  });
});

describe("DEFAULT_THEME", () => {
  it('equals "shopify"', async () => {
    const { DEFAULT_THEME } = await import("@/lib/themes/types");
    expect(DEFAULT_THEME).toBe("shopify");
  });
});
