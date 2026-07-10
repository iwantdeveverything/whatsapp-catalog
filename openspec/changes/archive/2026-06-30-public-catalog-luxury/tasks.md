# Tasks: Apply Luxury / Boutique Theme to Public Catalog

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150-200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

Not needed, as the change is small enough to fit comfortably within the 400-line budget in a single PR.

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Update `src/lib/themes/registry.ts` to add `luxury` to `VALID_THEMES` and `AVAILABLE_THEMES` with appropriate metadata.
- [x] 1.2 Update `src/__tests__/themes/registry.test.ts` to include tests for the new `luxury` theme.

## Phase 2: Core Implementation

- [x] 2.1 Update `src/app/layout.tsx` or public catalog layout files (like `src/app/categories/[category]/page.tsx` or `src/app/page.tsx`) to enforce the `luxury` theme context for public views.
- [x] 2.2 Modify `src/components/product-card.tsx` to conditionally apply a serif font (e.g., `font-serif`) to the product title when the `luxury` theme is active.
- [x] 2.3 Modify `src/components/product-card.tsx` to conditionally use an "editorial" image aspect ratio (e.g., `aspect-[3/4]` or `aspect-[4/5]`) for the `luxury` theme.

## Phase 3: Integration / Styling

- [x] 3.1 Update `src/components/whatsapp-cta.tsx` (which acts as the cart/checkout action) to apply a premium, minimalist button styling (e.g., dark colors, elegant hover effects) when the `luxury` theme is active.
- [x] 3.2 Update public layout containers (e.g., in `src/app/page.tsx` or category pages) to ensure adequate spacing, refined borders, and premium structural feel for the `luxury` theme.

## Phase 4: Testing

- [x] 4.1 Verify that the public catalog loads with the `luxury` theme by default.
- [x] 4.2 Verify that `ProductCard` and checkout actions display the premium structural layouts and typography.
- [x] 4.3 Verify that the `luxury` theme typography (`font-serif`) does not bleed into other themes or the admin dashboard (e.g., `src/app/admin/settings/page.tsx`).

## Phase 5: Fix Tests

- [x] 5.1 Fix failing tests in `ProductList` and `DataTable` caused by recent admin UI changes.
- [x] 5.2 Write unit tests for `src/middleware.ts` covering theme forcing logic on public and admin routes.
