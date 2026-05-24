import type { Product } from "@/lib/schemas";

export interface ContactResult {
  type: "whatsapp" | "phone" | "none";
  value: string | null;
}

/**
 * Resolve the best contact method for a product.
 * Priority: whatsapp → phone → default WhatsApp (from env) → none.
 */
export function resolveProductContact(
  product: Product,
  defaultWhatsapp?: string,
): ContactResult {
  if (product.contact?.whatsapp) {
    return { type: "whatsapp", value: product.contact.whatsapp };
  }

  if (product.contact?.phone) {
    return { type: "phone", value: product.contact.phone };
  }

  if (defaultWhatsapp) {
    return { type: "whatsapp", value: defaultWhatsapp };
  }

  return { type: "none", value: null };
}
