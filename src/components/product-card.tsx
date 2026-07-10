import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/schemas";

function formatPrice(price: Product["price"]): string {
  if (price === "Consultar") return "Consultar";
  return "$" + price.toLocaleString("es-AR");
}

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images[0];

  return (
    <Link
      href={`/${product.id}`}
      className="group block rounded-lg border border-hairline bg-canvas overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative bg-surface2 aspect-square luxury:aspect-[4/5]">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 space-y-1">
        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-surface2 text-muted">
          {product.category}
        </span>
        <h3 className="font-semibold text-sm text-ink line-clamp-2 luxury:font-serif">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-ink">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
