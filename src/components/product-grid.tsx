"use client";

import { useMemo } from "react";
import { useCatalogStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import type { Product } from "@/lib/schemas";

/**
 * Normalize a string for diacritic-insensitive comparison.
 * "Algodón" → "algodon", "Camisón" → "camison"
 */
function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const searchQuery = useCatalogStore((s) => s.searchQuery);
  const activeCategory = useCatalogStore((s) => s.activeCategory);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeForSearch(searchQuery);

    return products.filter((p) => {
      const matchesSearch =
        !normalizedQuery ||
        normalizeForSearch(p.name).includes(normalizedQuery);
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      <SearchBar />
      <CategoryFilter categories={uniqueCategories} />
      {filteredProducts.length === 0 ? (
        <p className="text-center text-muted py-12">
          No se encontraron productos
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
