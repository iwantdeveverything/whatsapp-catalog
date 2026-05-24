import { products } from "@/lib/data/products";
import type { Product } from "@/lib/schemas";

/**
 * Returns all active products in the catalog.
 * Inactive products (isActive = false) are filtered out.
 */
export function getAllProducts(): Product[] {
  return products.filter((p) => p.isActive);
}

/**
 * Returns a single product by its unique id.
 * Returns undefined if no product matches.
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id && p.isActive);
}

/**
 * Returns all active products in a given category.
 * Matching is case-sensitive (exact string equality).
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && p.isActive);
}
