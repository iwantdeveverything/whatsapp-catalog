import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "@/lib/sharing/whatsapp-url";
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

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the phone number (stripping non-digits)", () => {
    const product = createProduct({ name: "Camisa Oxford", price: 45000 });
    const url = buildWhatsAppUrl("+54 9 11 1234-5678", product);
    expect(url).toContain("https://wa.me/5491112345678");
  });

  it("encodes the product name in the message", () => {
    const product = createProduct({ name: "Camisa Oxford", price: 45000 });
    const url = buildWhatsAppUrl("5491112345678", product);
    expect(url).toContain(encodeURIComponent("Camisa Oxford"));
  });

  it("encodes the product price in the message", () => {
    const product = createProduct({ name: "Camisa", price: 45000 });
    const url = buildWhatsAppUrl("5491112345678", product);
    expect(url).toContain(encodeURIComponent("$45.000"));
  });

  it("encodes the full message with product name and price", () => {
    const product = createProduct({ name: "Zapatillas Running", price: 85000 });
    const url = buildWhatsAppUrl("5491112345678", product);
    const expectedMessage = encodeURIComponent(
      "Hola! Me interesa Zapatillas Running - $85.000",
    );
    expect(url).toContain(expectedMessage);
  });

  it('renders "Consultar" when price is "Consultar"', () => {
    const product = createProduct({
      name: "Diseño",
      price: "Consultar" as const,
    });
    const url = buildWhatsAppUrl("5491112345678", product);
    expect(url).toContain(encodeURIComponent("Consultar"));
    expect(url).not.toContain(encodeURIComponent("$"));
  });

  it("strips all non-digit characters from the phone number", () => {
    const product = createProduct({ name: "Test", price: 1000 });
    const url = buildWhatsAppUrl("  +54 (9) 11-1234.5678  ", product);
    expect(url).toContain("https://wa.me/5491112345678");
  });

  it("encodes the product URL in the message when provided", () => {
    const product = createProduct({
      id: "mochila-viajera",
      name: "Mochila Viajera",
      price: 32000,
    });
    const url = buildWhatsAppUrl(
      "5491112345678",
      product,
      "https://catalog.com/mochila-viajera",
    );
    const productUrlEncoded = encodeURIComponent(
      "https://catalog.com/mochila-viajera",
    );
    expect(url).toContain(productUrlEncoded);
  });

  it("does not include URL when no productUrl is provided", () => {
    const product = createProduct({ name: "Test", price: 1000 });
    const url = buildWhatsAppUrl("5491112345678", product);
    // Should not have "%0Ahttp" (bare URL without full message) in the query
    const params = new URL(url).searchParams;
    const text = params.get("text") ?? "";
    // The message should contain name and price, not a URL
    expect(text).toContain("Test");
    expect(text).toContain("$1.000");
    // Should not have any URL-looking content beyond what's expected
    expect(text).not.toMatch(/https?:\/\//);
  });
});
