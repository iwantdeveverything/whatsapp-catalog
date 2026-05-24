import type { ThemeDefinition } from "@/lib/themes/types";
import { THEME_TOKEN_KEYS } from "@/lib/themes/types";

/** The CSS custom property name prefix. */
const PROP_PREFIX = "--theme-";

/**
 * Generates a `[data-theme="id"]` CSS block from a ThemeDefinition.
 * Includes font @import, `--theme-font-family`, all 10 tokens, and `--theme-surfaceHover`.
 */
export function generateThemeCSSBlock(theme: ThemeDefinition): string {
  const lines: string[] = [];

  // Font import
  if (theme.fonts.googleFontsUrl) {
    lines.push(`@import url(${theme.fonts.googleFontsUrl});`);
  }

  // Theme block
  lines.push(`[data-theme="${theme.id}"] {`);

  // Font family — CSS format: "Family Name", fallback1, fallback2
  const fontStackParts: string[] = [JSON.stringify(theme.fonts.family)];
  if (theme.fonts.fallback) {
    fontStackParts.push(theme.fonts.fallback);
  }
  const fontStack = fontStackParts.join(", ");
  lines.push(`  /* ${theme.name} — ${theme.fonts.family} */`);
  lines.push(
    `  ${PROP_PREFIX}font-family: ${fontStack};`,
  );

  // All 10 semantic tokens
  for (const key of THEME_TOKEN_KEYS) {
    lines.push(`  ${PROP_PREFIX}${key}: ${theme.tokens[key]};`);
  }

  // surfaceHover — derived from surface3 (the closest elevated surface)
  lines.push(`  ${PROP_PREFIX}surfaceHover: ${theme.tokens.surface3};`);

  lines.push("}");

  return lines.join("\n");
}

/**
 * Generates the complete theme CSS file:
 * - `:root` fallback from the first theme
 * - All `[data-theme]` blocks
 * Returns the full CSS string (no wrapping).
 */
export function generateAllThemeCSS(themes: ThemeDefinition[]): string {
  const blocks: string[] = [];

  // :root fallback from the first theme
  if (themes.length > 0) {
    const rootTokens = themes[0].tokens;
    const rootLines: string[] = [":root {"];
    for (const key of THEME_TOKEN_KEYS) {
      rootLines.push(`  ${PROP_PREFIX}${key}: ${rootTokens[key]};`);
    }
    rootLines.push(`  ${PROP_PREFIX}surfaceHover: ${rootTokens.surface3};`);
    rootLines.push("}");
    blocks.push(rootLines.join("\n"));
  }

  // Each theme's [data-theme] block
  for (const theme of themes) {
    blocks.push(generateThemeCSSBlock(theme));
  }

  return blocks.join("\n\n");
}
