import { describe, it, expect } from "vitest";
import { resolveProductContact } from "@/lib/sharing/contact-fallback";
import type { Product } from "@/lib/schemas";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-product",
    name: "Test Product",
    description: "A test product",
    price: 10000,
    images: ["https://example.com/photo.jpg"],
    category: "Test",
    isActive: true,
    ...overrides,
  };
}

describe("resolveProductContact", () => {
  it("returns whatsapp when product has whatsapp contact", () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678", phone: "+541112345678" },
    });
    const result = resolveProductContact(product);
    expect(result.type).toBe("whatsapp");
    expect(result.value).toBe("5491112345678");
  });

  it("returns phone when product has phone but no whatsapp", () => {
    const product = createProduct({
      contact: { phone: "+541112345678" },
    });
    const result = resolveProductContact(product);
    expect(result.type).toBe("phone");
    expect(result.value).toBe("+541112345678");
  });

  it("returns none when product has no contact info at all", () => {
    const product = createProduct();
    const result = resolveProductContact(product);
    expect(result.type).toBe("none");
    expect(result.value).toBeNull();
  });

  it("returns whatsapp even when both whatsapp and phone are present (whatsapp priority)", () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678", phone: "+541112345678" },
    });
    const result = resolveProductContact(product);
    expect(result.type).toBe("whatsapp");
  });

  it("falls back to DEFAULT_WHATSAPP env var when no product contact exists", () => {
    const product = createProduct();
    const result = resolveProductContact(product, "5499999999999");
    expect(result.type).toBe("whatsapp");
    expect(result.value).toBe("5499999999999");
  });

  it("skip empty/defaults when product contact is an empty object", () => {
    const product = createProduct({ contact: {} });
    const result = resolveProductContact(product);
    expect(result.type).toBe("none");
  });
});
