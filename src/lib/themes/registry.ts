import {
  type ThemeDefinition,
  type ThemeTokens,
  ThemeCategory,
} from "@/lib/themes/types";

const SHOPIFY: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#121212",
  surface1: "#F6F6F7",
  surface2: "#E4E5E7",
  surface3: "#D2D4D6",
  hairline: "#C9CCCF",
  muted: "#6D7175",
  primary: "#008060",
  onPrimary: "#FFFFFF",
  accent: "#C4320A",
};

const NIKE_TK: ThemeTokens = {
  canvas: "#111111",
  ink: "#FFFFFF",
  surface1: "#1A1A1A",
  surface2: "#222222",
  surface3: "#333333",
  hairline: "#333333",
  muted: "#999999",
  primary: "#FFFFFF",
  onPrimary: "#111111",
  accent: "#FF5000",
};

const AIRBNB_TK: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#222222",
  surface1: "#F7F7F7",
  surface2: "#EBEBEB",
  surface3: "#DDDDDD",
  hairline: "#DDDDDD",
  muted: "#717171",
  primary: "#FF385C",
  onPrimary: "#FFFFFF",
  accent: "#FF385C",
};

const STARBUCKS_TK: ThemeTokens = {
  canvas: "#F5F0E8",
  ink: "#1E3932",
  surface1: "#E8E2D8",
  surface2: "#D4CBBC",
  surface3: "#C0B6A5",
  hairline: "#D4CBBC",
  muted: "#6B7B73",
  primary: "#006241",
  onPrimary: "#FFFFFF",
  accent: "#006241",
};

const APPLE_TK: ThemeTokens = {
  canvas: "#F5F5F7",
  ink: "#1D1D1F",
  surface1: "#FFFFFF",
  surface2: "#E8E8ED",
  surface3: "#D2D2D7",
  hairline: "#D2D2D7",
  muted: "#86868B",
  primary: "#0071E3",
  onPrimary: "#FFFFFF",
  accent: "#0071E3",
};

const SPOTIFY_TK: ThemeTokens = {
  canvas: "#191414",
  ink: "#FFFFFF",
  surface1: "#282828",
  surface2: "#333333",
  surface3: "#404040",
  hairline: "#404040",
  muted: "#B3B3B3",
  primary: "#1DB954",
  onPrimary: "#FFFFFF",
  accent: "#1DB954",
};

const TESLA_TK: ThemeTokens = {
  canvas: "#000000",
  ink: "#FFFFFF",
  surface1: "#111111",
  surface2: "#1A1A1A",
  surface3: "#222222",
  hairline: "#333333",
  muted: "#999999",
  primary: "#FFFFFF",
  onPrimary: "#000000",
  accent: "#E82127",
};

const VERCEL_TK: ThemeTokens = {
  canvas: "#000000",
  ink: "#FFFFFF",
  surface1: "#111111",
  surface2: "#1A1A1A",
  surface3: "#333333",
  hairline: "#333333",
  muted: "#888888",
  primary: "#FFFFFF",
  onPrimary: "#000000",
  accent: "#0070F3",
};

const LINEAR_TK: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#1A1A1A",
  surface1: "#F7F7F8",
  surface2: "#EDEDEF",
  surface3: "#E0E0E2",
  hairline: "#E0E0E2",
  muted: "#6E6E77",
  primary: "#5E6AD2",
  onPrimary: "#FFFFFF",
  accent: "#5E6AD2",
};

const SUPABASE_TK: ThemeTokens = {
  canvas: "#1C1C1C",
  ink: "#E0E0E0",
  surface1: "#242424",
  surface2: "#2A2A2A",
  surface3: "#333333",
  hairline: "#333333",
  muted: "#808080",
  primary: "#3ECF8E",
  onPrimary: "#1C1C1C",
  accent: "#3ECF8E",
};

const FIGMA_TK: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#000000",
  surface1: "#F5F5F5",
  surface2: "#E6E6E6",
  surface3: "#D9D9D9",
  hairline: "#E6E6E6",
  muted: "#888888",
  primary: "#0D0D0D",
  onPrimary: "#FFFFFF",
  accent: "#9747FF",
};

const NOTION_TK: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#37352F",
  surface1: "#F7F6F3",
  surface2: "#EDECE9",
  surface3: "#E3E2E0",
  hairline: "#E3E2E0",
  muted: "#9B9A97",
  primary: "#2383E2",
  onPrimary: "#FFFFFF",
  accent: "#E16259",
};

const STRIPE_TK: ThemeTokens = {
  canvas: "#FFFFFF",
  ink: "#0A2540",
  surface1: "#F6F9FC",
  surface2: "#E6EBF1",
  surface3: "#D4D9E2",
  hairline: "#D4D9E2",
  muted: "#697386",
  primary: "#635BFF",
  onPrimary: "#FFFFFF",
  accent: "#635BFF",
};

const CLAUDE_TK: ThemeTokens = {
  canvas: "#FAFAF9",
  ink: "#1C1917",
  surface1: "#F5F5F4",
  surface2: "#E7E5E4",
  surface3: "#D6D3D1",
  hairline: "#D6D3D1",
  muted: "#78716C",
  primary: "#D97706",
  onPrimary: "#FFFFFF",
  accent: "#D97706",
};

const MISTRAL_TK: ThemeTokens = {
  canvas: "#0D0D0D",
  ink: "#F5F5F5",
  surface1: "#1A1A1A",
  surface2: "#242424",
  surface3: "#333333",
  hairline: "#333333",
  muted: "#888888",
  primary: "#F97316",
  onPrimary: "#0D0D0D",
  accent: "#F97316",
};

// Must match the [data-theme="luxury"] block in globals.css (single source of truth).
const LUXURY_TK: ThemeTokens = {
  canvas: "#0F0D0C", // Espresso Black
  ink: "#F9F6F0", // Cream / Ivory
  surface1: "#1A1715",
  surface2: "#24201D",
  surface3: "#302B27",
  hairline: "#3D3732",
  muted: "#8A7E73",
  primary: "#D4AF37", // Muted Gold / Brass
  onPrimary: "#0F0D0C",
  accent: "#C48B62", // Copper
};

const BASE_URL = "https://github.com/voltagent/awesome-design-md";

/** The curated register of 16 DESIGN.md themes. */
export const AVAILABLE_THEMES: ThemeDefinition[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: ThemeCategory.Ecommerce,
    tokens: SHOPIFY,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Clean commerce palette — green primary on white canvas",
    metadata: { source: `${BASE_URL}/blob/main/design-md/shopify/DESIGN.md` },
  },
  {
    id: "nike",
    name: "Nike",
    category: ThemeCategory.Ecommerce,
    tokens: NIKE_TK,
    fonts: {
      family: "Futura",
      googleFontsUrl: undefined,
      fallback: "sans-serif",
    },
    description: "Dark monochrome canvas with bold white typography",
    metadata: { source: `${BASE_URL}/blob/main/design-md/nike/DESIGN.md` },
  },
  {
    id: "airbnb",
    name: "Airbnb",
    category: ThemeCategory.Ecommerce,
    tokens: AIRBNB_TK,
    fonts: {
      family: "Circular",
      googleFontsUrl: undefined,
      fallback: "-apple-system, sans-serif",
    },
    description: "Warm coral accents on clean white — photography-driven",
    metadata: { source: `${BASE_URL}/blob/main/design-md/airbnb/DESIGN.md` },
  },
  {
    id: "starbucks",
    name: "Starbucks",
    category: ThemeCategory.Ecommerce,
    tokens: STARBUCKS_TK,
    fonts: {
      family: "SoDoSans",
      googleFontsUrl: undefined,
      fallback: "sans-serif",
    },
    description: "Warm cream canvas with signature green accents",
    metadata: {
      source: `${BASE_URL}/blob/main/design-md/starbucks/DESIGN.md`,
    },
  },
  {
    id: "apple",
    name: "Apple",
    category: ThemeCategory.Media,
    tokens: APPLE_TK,
    fonts: {
      family: "SF Pro",
      googleFontsUrl: undefined,
      fallback: "-apple-system, sans-serif",
    },
    description: "Premium white space with cool gray typography",
    metadata: { source: `${BASE_URL}/blob/main/design-md/apple/DESIGN.md` },
  },
  {
    id: "spotify",
    name: "Spotify",
    category: ThemeCategory.Media,
    tokens: SPOTIFY_TK,
    fonts: {
      family: "Circular",
      googleFontsUrl: undefined,
      fallback: "sans-serif",
    },
    description: "Dark immersive canvas with vibrant green highlights",
    metadata: { source: `${BASE_URL}/blob/main/design-md/spotify/DESIGN.md` },
  },
  {
    id: "tesla",
    name: "Tesla",
    category: ThemeCategory.Media,
    tokens: TESLA_TK,
    fonts: {
      family: "Gotham",
      googleFontsUrl: undefined,
      fallback: "sans-serif",
    },
    description: "Radical subtraction — black canvas, cinematic imagery",
    metadata: { source: `${BASE_URL}/blob/main/design-md/tesla/DESIGN.md` },
  },
  {
    id: "vercel",
    name: "Vercel",
    category: ThemeCategory.Devtools,
    tokens: VERCEL_TK,
    fonts: {
      family: "Geist",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap",
      fallback: "sans-serif",
    },
    description: "Black/white precision with Geist font",
    metadata: { source: `${BASE_URL}/blob/main/design-md/vercel/DESIGN.md` },
  },
  {
    id: "linear",
    name: "Linear",
    category: ThemeCategory.Devtools,
    tokens: LINEAR_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Ultra-minimal — purple accent, precise spacing",
    metadata: { source: `${BASE_URL}/blob/main/design-md/linear/DESIGN.md` },
  },
  {
    id: "supabase",
    name: "Supabase",
    category: ThemeCategory.Devtools,
    tokens: SUPABASE_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Dark canvas with emerald green accents",
    metadata: {
      source: `${BASE_URL}/blob/main/design-md/supabase/DESIGN.md`,
    },
  },
  {
    id: "figma",
    name: "Figma",
    category: ThemeCategory.Design,
    tokens: FIGMA_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Vibrant multi-color accent — playful yet professional",
    metadata: { source: `${BASE_URL}/blob/main/design-md/figma/DESIGN.md` },
  },
  {
    id: "notion",
    name: "Notion",
    category: ThemeCategory.Design,
    tokens: NOTION_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Warm minimalism — serif headings, soft surfaces",
    metadata: { source: `${BASE_URL}/blob/main/design-md/notion/DESIGN.md` },
  },
  {
    id: "stripe",
    name: "Stripe",
    category: ThemeCategory.Fintech,
    tokens: STRIPE_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Purple gradient elegance with weight-300 typography",
    metadata: { source: `${BASE_URL}/blob/main/design-md/stripe/DESIGN.md` },
  },
  {
    id: "claude",
    name: "Claude",
    category: ThemeCategory.AI,
    tokens: CLAUDE_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Warm terracotta accent — clean editorial layout",
    metadata: { source: `${BASE_URL}/blob/main/design-md/claude/DESIGN.md` },
  },
  {
    id: "mistral",
    name: "Mistral",
    category: ThemeCategory.AI,
    tokens: MISTRAL_TK,
    fonts: {
      family: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      fallback: "system-ui, sans-serif",
    },
    description: "Dark technical canvas with orange accent",
    metadata: { source: `${BASE_URL}/blob/main/design-md/mistral/DESIGN.md` },
  },
  {
    id: "luxury",
    name: "Luxury",
    category: ThemeCategory.Ecommerce,
    tokens: LUXURY_TK,
    fonts: {
      family: "Cormorant Garamond",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
      fallback: "serif",
    },
    description: "Premium boutique aesthetic with serif typography",
    metadata: { source: `${BASE_URL}/blob/main/design-md/luxury/DESIGN.md` },
  },
];

/** Look up a theme by its ID. Returns undefined if not found. */
export function getThemeById(id: string): ThemeDefinition | undefined {
  return AVAILABLE_THEMES.find((t) => t.id === id);
}
