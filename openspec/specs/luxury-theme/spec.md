# luxury-theme Specification

## Purpose

Define the "Luxury / Boutique" frontend aesthetic and apply it to the public catalog view, cart, and checkout flows. This theme provides a premium, editorial visual experience.

## Requirements

### Requirement: Enforce Luxury Theme

The system MUST load the public catalog, cart, and checkout flows with the Luxury theme by default.

#### Scenario: User visits public catalog
- GIVEN a user accesses the public catalog URL
- WHEN the page loads
- THEN the luxury theme MUST be active
- AND the `ProductCard` and `CatalogHeader` MUST display premium structural layouts

#### Scenario: User proceeds to checkout
- GIVEN a user has items in their cart
- WHEN they navigate to the cart or checkout flow
- THEN the luxury theme MUST remain active

### Requirement: Typography and Aesthetics

The system MUST use a serif font for `ProductCard` titles and `CatalogHeader` when the luxury theme is active, without affecting other themes.

#### Scenario: Theme isolation
- GIVEN the luxury theme is active
- WHEN a `ProductCard` is rendered
- THEN its title MUST use a serif font (e.g., Playfair Display or Merriweather)

#### Scenario: Non-luxury themes remain unaffected
- GIVEN a non-luxury theme is active (e.g., in the admin dashboard)
- WHEN a `ProductCard` or other component is rendered
- THEN it MUST NOT inherit the serif typography or luxury structural overrides

### Requirement: Editorial Product Images

The system MUST display product images with an editorial aspect ratio (e.g., 3:4 or 4:5) when the luxury theme is active.

#### Scenario: Viewing product images
- GIVEN a user views a product in the public catalog
- WHEN the product image is displayed
- THEN the image MUST have a 3:4 or 4:5 aspect ratio
