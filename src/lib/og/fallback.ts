import type { Product } from "@/lib/schemas";

export interface FallbackOgData {
  width: number;
  height: number;
  name: string;
  price: string;
  background: string;
  foreground: string;
  businessName: string;
}

function formatPrice(price: Product["price"]): string {
  if (price === "Consultar") return "Consultar";
  return "$" + price.toLocaleString("es-AR");
}

/**
 * Generate fallback OG image data when the product image is unavailable.
 * Returns structured data for rendering a branded gradient placeholder.
 */
export function generateFallbackOgImage(product: Product): FallbackOgData {
  return {
    width: 1200,
    height: 630,
    name: product.name,
    price: formatPrice(product.price),
    background: "#1a1a2e",
    foreground: "#ffffff",
    businessName: "Catálogo Digital",
  };
}
