import { describe, it, expect } from "vitest";
import type {
  ThemeDefinition,
  ThemeTokens,
} from "@/lib/themes/types";
import { ThemeCategory } from "@/lib/themes/types";

describe("CSS Generator", () => {
  let generateThemeCSSBlock: (
    theme: ThemeDefinition,
  ) => string;
  let generateAllThemeCSS: (
    themes: ThemeDefinition[],
  ) => string;

  beforeAll(async () => {
    const mod = await import("@/lib/themes/css-generator");
    generateThemeCSSBlock = mod.generateThemeCSSBlock;
    generateAllThemeCSS = mod.generateAllThemeCSS;
  });

  const sampleTokens: ThemeTokens = {
    canvas: "#FAFAFA",
    ink: "#1C1C1C",
    surface1: "#F0F0F0",
    surface2: "#E0E0E0",
    surface3: "#CCCCCC",
    hairline: "#BBBBBB",
    muted: "#888888",
    primary: "#FF6600",
    onPrimary: "#FFFFFF",
    accent: "#FF3300",
  };

  const sampleTheme: ThemeDefinition = {
    id: "test-brand",
    name: "Test Brand",
    category: ThemeCategory.Ecommerce,
    tokens: sampleTokens,
    fonts: {
      family: "Roboto",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
      fallback: "sans-serif",
    },
    description: "A test theme",
    metadata: {
      source: "https://github.com/voltagent/awesome-design-md/test",
    },
  };

  // ── Single block generation ──

  it("generates a valid [data-theme] CSS block", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain('[data-theme="test-brand"]');
    expect(css).toContain("{");
    expect(css).toContain("}");
  });

  it("includes all 10 token custom properties", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain("--theme-canvas:");
    expect(css).toContain("--theme-ink:");
    expect(css).toContain("--theme-surface1:");
    expect(css).toContain("--theme-surface2:");
    expect(css).toContain("--theme-surface3:");
    expect(css).toContain("--theme-hairline:");
    expect(css).toContain("--theme-muted:");
    expect(css).toContain("--theme-primary:");
    expect(css).toContain("--theme-onPrimary:");
    expect(css).toContain("--theme-accent:");
  });

  it("maps token values to correct CSS values", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain("--theme-canvas: #FAFAFA;");
    expect(css).toContain("--theme-ink: #1C1C1C;");
    expect(css).toContain("--theme-accent: #FF3300;");
  });

  it("includes surfaceHover derived from surface3", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain("--theme-surfaceHover:");
    // surfaceHover should equal surface3 for the sample theme
    expect(css).toContain("--theme-surfaceHover: #CCCCCC;");
  });

  it("generates font @import when googleFontsUrl is provided", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain(
      "@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap);",
    );
  });

  it("includes font-family CSS variable when googleFontsUrl is provided", () => {
    const css = generateThemeCSSBlock(sampleTheme);
    expect(css).toContain("--theme-font-family:");
    expect(css).toContain('"Roboto", sans-serif');
  });

  it("does NOT include @import when googleFontsUrl is undefined", () => {
    const noFontTheme: ThemeDefinition = {
      ...sampleTheme,
      id: "no-font",
      fonts: { family: "System", googleFontsUrl: undefined, fallback: "sans-serif" },
    };
    const css = generateThemeCSSBlock(noFontTheme);
    expect(css).not.toContain("@import");
  });

  it("still includes font-family when googleFontsUrl is undefined", () => {
    const noFontTheme: ThemeDefinition = {
      ...sampleTheme,
      id: "no-font",
      fonts: { family: "System", googleFontsUrl: undefined, fallback: "sans-serif" },
    };
    const css = generateThemeCSSBlock(noFontTheme);
    expect(css).toContain('--theme-font-family: "System", sans-serif');
  });

  // ── Full CSS generation ──

  it("generates all themes at once", () => {
    const themes: ThemeDefinition[] = [
      { ...sampleTheme, id: "brand-a", name: "Brand A", tokens: { ...sampleTokens, canvas: "#AAA" } },
      { ...sampleTheme, id: "brand-b", name: "Brand B", tokens: { ...sampleTokens, canvas: "#BBB" } },
    ];
    const css = generateAllThemeCSS(themes);
    expect(css).toContain('[data-theme="brand-a"]');
    expect(css).toContain('[data-theme="brand-b"]');
  });

  it("includes the :root fallback block from the first theme", () => {
    const themes: ThemeDefinition[] = [
      { ...sampleTheme, id: "default-theme", tokens: { ...sampleTokens, canvas: "#DEFAULT" } },
    ];
    const css = generateAllThemeCSS(themes);
    expect(css).toContain(":root {");
    expect(css).toContain("--theme-canvas: #DEFAULT;");
  });

  it("separates blocks with a blank line for readability", () => {
    const themes: ThemeDefinition[] = [
      { ...sampleTheme, id: "t1", tokens: { ...sampleTokens } },
      { ...sampleTheme, id: "t2", tokens: { ...sampleTokens } },
    ];
    const css = generateAllThemeCSS(themes);
    // There should be blank lines separating blocks
    expect(css).toContain("\n\n");
  });
});
