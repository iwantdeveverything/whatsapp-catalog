/** Semantic color tokens that every theme must define. */
export interface ThemeTokens {
  /** Page background */
  canvas: string;
  /** Primary text */
  ink: string;
  /** Card background, inactive pills */
  surface1: string;
  /** Hover states, secondary surfaces */
  surface2: string;
  /** Elevated surfaces */
  surface3: string;
  /** Borders, dividers */
  hairline: string;
  /** Secondary text, placeholders */
  muted: string;
  /** Active pills, CTAs */
  primary: string;
  /** Text on primary */
  onPrimary: string;
  /** Price highlight, special emphasis */
  accent: string;
}

export const THEME_TOKEN_KEYS: readonly (keyof ThemeTokens)[] = [
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
] as const;

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

/** Validates that an arbitrary object has all required ThemeTokens with valid hex colors. */
export function validateThemeTokens(obj: unknown): obj is ThemeTokens {
  if (typeof obj !== "object" || obj === null) return false;
  const record = obj as Record<string, unknown>;
  return THEME_TOKEN_KEYS.every((key) => {
    const value = record[key];
    return typeof value === "string" && HEX_RE.test(value);
  });
}

export enum ThemeCategory {
  Ecommerce = "ecommerce",
  Design = "design",
  Devtools = "devtools",
  Media = "media",
  Fintech = "fintech",
  AI = "ai",
}

/** Font configuration for a theme. */
export interface ThemeFonts {
  /** Primary font family name */
  family: string;
  /** Google Fonts CSS import URL (optional) */
  googleFontsUrl?: string;
  /** Fallback font stack */
  fallback: string;
}

/** Theme metadata — source and attribution. */
export interface ThemeMetadata {
  /** URL to the original DESIGN.md source on GitHub */
  source: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  category: ThemeCategory;
  tokens: ThemeTokens;
  /** Font configuration */
  fonts: ThemeFonts;
  /** Brief one-line description */
  description: string;
  /** Attribution metadata */
  metadata: ThemeMetadata;
}

/** The default theme ID used when no preference is stored. */
export const DEFAULT_THEME = "shopify" as const;
