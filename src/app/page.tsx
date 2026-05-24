import { getAllProducts } from "@/lib/data/catalog";
import { ProductGrid } from "@/components/product-grid";

export default function HomePage() {
  const products = getAllProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        Catálogo Digital
      </h1>
      <ProductGrid products={products} />
    </main>
  );
}
