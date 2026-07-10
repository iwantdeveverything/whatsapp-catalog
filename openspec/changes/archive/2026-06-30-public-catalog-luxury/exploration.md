## Exploration: Apply the "Luxury / Boutique" frontend aesthetic to the public catalog view and configuration

### Current State
The application uses a semantic CSS variable system (`data-theme`) driven by `globals.css` and a theme registry (`src/lib/themes/registry.ts`). A "luxury" theme is already defined in `globals.css` using `[data-theme="luxury"]` and imports its fonts (`Outfit`, `Cormorant Garamond`) in `src/app/layout.tsx`. However, the "luxury" theme is not registered in the `VALID_THEMES` set in `src/components/theme-provider.tsx` nor in the `AVAILABLE_THEMES` list in `src/lib/themes/registry.ts`, meaning it cannot be selected via the `/ajustes` configuration page or properly initialized during SSR. Additionally, components like `ProductCard` do not use `font-serif`, which is required to fully leverage the luxury aesthetic.

### Affected Areas
- `src/components/theme-provider.tsx` — The `VALID_THEMES` Set must be updated to include `"luxury"` to allow SSR sync.
- `src/lib/themes/registry.ts` — The `AVAILABLE_THEMES` array must be updated to include the luxury theme definition so it is selectable in `/ajustes`.
- `src/components/product-card.tsx` — Requires semantic typographic updates to apply the serif font (`Cormorant Garamond`) to headings or prices where appropriate for a boutique feel.
- `src/app/page.tsx` — The main header typography could be enhanced.
- `src/app/globals.css` — Ensure `--theme-font-serif` is mapped to Tailwind's `--font-serif` or `font-serif` utility.

### Approaches
1. **Full Integration with Semantic Enhancements**
   - Register `"luxury"` in `theme-provider.tsx` and `registry.ts` under a new or existing category.
   - Refactor `ProductCard` (and potentially `page.tsx` headings) to use a `font-serif` utility for titles/prices to maximize the boutique aesthetic. Ensure other themes fall back gracefully (e.g. mapping `--font-serif` to their sans font if they don't have one).
   - Pros: Full visibility in configuration, deeply improved boutique typography.
   - Cons: Slight component styling changes; requires verifying font fallbacks for other themes.
   - Effort: Low

2. **Basic Registration Only**
   - Only add `"luxury"` to `VALID_THEMES` and `AVAILABLE_THEMES`.
   - Pros: Minimal code changes, enables the theme colors.
   - Cons: Misses the opportunity to utilize the serif font (`Cormorant Garamond`) effectively, falling short of a true luxury aesthetic.
   - Effort: Low

### Recommendation
**Approach 1: Full Integration with Semantic Enhancements**. We should register the luxury theme fully so it appears in the configuration page. In addition, we should apply a `font-serif` utility to product titles or section headers in the catalog views (e.g., `ProductCard` titles, `HomePage` H1) so the "Cormorant Garamond" font included in the luxury theme takes effect, creating a true boutique experience.

### Risks
- Changes to typography (applying `font-serif`) might affect other themes if they don't have a specific `font-serif` fallback defined. We must ensure `font-serif` falls back to `font-sans` or the system font for themes that do not define a distinct serif font.

### Ready for Proposal
Yes. The changes are straightforward, confined to the theme registry and some minor component typography classes.
