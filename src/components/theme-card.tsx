"use client";

import type { ThemeTokens, ThemeFonts } from "@/lib/themes/types";

/** Lightweight theme shape for the card — avoids pulling in the full ThemeDefinition. */
export interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    category: string;
    description: string;
    tokens: ThemeTokens;
    fonts: ThemeFonts;
  };
  isActive: boolean;
  onClick: () => void;
}

/** The 5 color swatches shown on the card: canvas, ink, primary, accent, surface2 */
const SWATCH_KEYS: (keyof ThemeTokens)[] = [
  "canvas",
  "ink",
  "primary",
  "accent",
  "surface2",
];

const CATEGORY_LABELS: Record<string, string> = {
  ecommerce: "E-commerce",
  media: "Media",
  devtools: "DevTools",
  design: "Design",
  fintech: "Fintech",
  ai: "AI",
};

export function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  const categoryLabel =
    CATEGORY_LABELS[theme.category] ?? theme.category;

  return (
    <button
      type="button"
      onClick={onClick}
      data-active={String(isActive)}
      className={`
        group relative flex flex-col gap-3 rounded-xl border bg-canvas p-4 text-left
        transition-all duration-150
        hover:shadow-md hover:scale-[1.02]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${
          isActive
            ? "border-primary ring-2 ring-primary shadow-sm"
            : "border-hairline"
        }
      `.trim()}
    >
      {/* Active checkmark */}
      {isActive && (
        <span
          data-testid="active-indicator"
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-onPrimary"
          aria-hidden="true"
        >
          ✓
        </span>
      )}

      {/* Color swatches */}
      <div className="flex gap-1.5" data-testid="swatch-row">
        {SWATCH_KEYS.map((key) => (
          <span
            key={key}
            data-testid="color-swatch"
            className="h-5 w-5 rounded-full border border-hairline"
            style={{ backgroundColor: theme.tokens[key] }}
          />
        ))}
      </div>

      {/* Name + category */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-ink leading-tight">
          {theme.name}
        </span>
        <span className="shrink-0 rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
          {categoryLabel}
        </span>
      </div>

      {/* Font name */}
      <span className="text-[11px] text-muted leading-none">
        {theme.fonts.family}
      </span>
    </button>
  );
}
