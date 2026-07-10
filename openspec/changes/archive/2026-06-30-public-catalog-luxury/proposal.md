# Proposal: Apply Luxury / Boutique Theme to Public Catalog

## Intent
The public catalog needs to convey a premium, luxury aesthetic for boutiques. The current implementation lacks the required structure and styling. This change ensures the public catalog forces the Luxury theme and updates all public components (ProductCard, CatalogHeader, etc.) to structurally and visually reflect a boutique aesthetic.

## Scope

### In Scope
- Force the Luxury theme on all public catalog views.
- Add `luxury` to `VALID_THEMES` and `AVAILABLE_THEMES` registries if missing.
- Modify `ProductCard` component structure and typography for a premium look (e.g., serif fonts for titles).
- Modify `CatalogHeader` component structure and styling for a premium look.

### Out of Scope
- Changes to the admin dashboard or private views.
- Introduction of other new themes besides Luxury.

## Capabilities

### New Capabilities
- `luxury-theme`: Force luxury theme on public catalog and restructure components for a boutique aesthetic.

### Modified Capabilities
- None

## Approach
1. Register the `luxury` theme in the theme registry (`AVAILABLE_THEMES` and `VALID_THEMES`).
2. Update the public catalog layout to enforce the `luxury` theme context.
3. Update `ProductCard` and `CatalogHeader` components to apply structural changes and serif typography explicitly when the luxury theme is active, ensuring other themes are not broken by global typography changes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| Theme registry | Modified | Register the luxury theme |
| Public Catalog Layout | Modified | Enforce luxury theme |
| `ProductCard` | Modified | Structural and typography updates |
| `CatalogHeader` | Modified | Structural and typography updates |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Typography bleeding | Medium | Scope `font-serif` and structural changes exclusively to the public catalog context or component-level logic, avoiding global CSS overrides. |

## Rollback Plan
Revert the commits introducing the theme registry updates and structural changes to the public components, falling back to the previous default theme.

## Dependencies
- None

## Success Criteria
- [ ] Public catalog loads with the Luxury theme by default.
- [ ] `ProductCard` and `CatalogHeader` display premium structural layouts.
- [ ] `ProductCard` titles use a serif font.
- [ ] Other themes (if viewed in admin/elsewhere) do not accidentally inherit the serif typography or luxury structural overrides.

## Proposal question round
* Assumptions needing review: We assume the luxury theme only applies to the public-facing catalog and not the store management dashboard. We assume the serif typography should be tightly scoped to avoid affecting other components.
* Question 1: Should the luxury theme also affect the checkout flow or only the browsing experience?
* Question 2: Are there specific serif fonts preferred for the boutique aesthetic, or should we rely on a standard premium fallback like `Playfair Display` or `Merriweather`?
* Question 3: Should we also adjust image aspect ratios in the ProductCard for a more "editorial" luxury look?
