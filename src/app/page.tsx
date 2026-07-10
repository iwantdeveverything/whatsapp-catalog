import { CatalogHeader } from "@/components/catalog-header";
import Link from "next/link";
import { getAllProducts } from "@/lib/data/catalog";
import { ProductGrid } from "@/components/product-grid";

export default function HomePage() {
  const products = getAllProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 luxury:py-16">
      <CatalogHeader />
      <ProductGrid products={products} />
    </main>
  );
}
