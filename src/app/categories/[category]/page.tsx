import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts, getProductsByCategory } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product-card";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  const products = getAllProducts();
  const uniqueCategories = [...new Set(products.map((p) => p.category))];
  return uniqueCategories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} — Catálogo Digital`,
    description: `Productos en la categoría ${category}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = getProductsByCategory(category);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 luxury:py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Catálogo
      </Link>

      {/* Category heading */}
      <h1 className="text-3xl font-bold text-ink luxury:font-serif luxury:tracking-wide luxury:text-4xl">{category}</h1>

      {/* Product grid or empty state */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          No hay productos en esta categoría.
        </p>
      )}
    </main>
  );
}
