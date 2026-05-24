import type { Product } from "@/lib/schemas";

interface JsonLdProduct {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string;
  category: string;
  offers: {
    "@type": string;
    price: number;
    priceCurrency: string;
    availability: string;
  };
}

export function generateProductJsonLd(product: Product): JsonLdProduct {
  const price = typeof product.price === "number" ? product.price : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0],
    category: product.category,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
    },
  };
}
