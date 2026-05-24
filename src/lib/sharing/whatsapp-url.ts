import type { Product } from "@/lib/schemas";

function formatPrice(price: Product["price"]): string {
  if (price === "Consultar") return "Consultar";
  return "$" + price.toLocaleString("es-AR");
}

/**
 * Build a WhatsApp deep-link URL for a product inquiry.
 * Follows wa.me URL scheme: https://wa.me/{phone}?text={encoded-message}
 */
export function buildWhatsAppUrl(
  phone: string,
  product: Product,
  productUrl?: string,
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const priceStr = formatPrice(product.price);
  let message = `Hola! Me interesa ${product.name} - ${priceStr}`;

  if (productUrl) {
    message += `\n${productUrl}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
