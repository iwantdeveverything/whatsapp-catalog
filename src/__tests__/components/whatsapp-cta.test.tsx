import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppCta } from "@/components/whatsapp-cta";
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

describe("WhatsAppCta", () => {
  // --- Basic rendering ---

  it('renders a "Consultar por WhatsApp" button', () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678" },
    });
    render(<WhatsAppCta product={product} />);
    expect(
      screen.getByRole("link", { name: /consultar por whatsapp/i }),
    ).toBeInTheDocument();
  });

  it("renders the WhatsApp icon (span with ♿ accessible label)", () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678" },
    });
    render(<WhatsAppCta product={product} />);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });
    // The link should contain an icon element
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  // --- WhatsApp link (primary CTA) ---

  it("opens a wa.me link when product has whatsapp contact", () => {
    const product = createProduct({
      name: "Camisa Oxford",
      price: 45000,
      contact: { whatsapp: "5491112345678" },
    });
    render(<WhatsAppCta product={product} />);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).toContain("https://wa.me/");
  });

  it("builds the correct WhatsApp URL with product info", () => {
    const product = createProduct({
      name: "Zapatillas Running",
      price: 85000,
      contact: { whatsapp: "5491112345678" },
    });
    render(<WhatsAppCta product={product} />);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });
    const href = link.getAttribute("href")!;
    expect(href).toContain("5491112345678");
    expect(href).toContain(encodeURIComponent("Zapatillas Running"));
    expect(href).toContain(encodeURIComponent("$85.000"));
  });

  it("opens in a new tab with target=_blank and rel=noopener", () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678" },
    });
    render(<WhatsAppCta product={product} />);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  // --- Phone fallback (secondary CTA) ---

  it("shows phone call button when product has phone but no whatsapp", () => {
    const product = createProduct({
      name: "Remera Algodón",
      price: 18000,
      contact: { phone: "+541112345678" },
    });
    render(<WhatsAppCta product={product} />);
    const link = screen.getByRole("link", { name: /llamar/i });
    expect(link).toHaveAttribute("href", "tel:+541112345678");
  });

  it("does not show WhatsApp button when no whatsapp contact", () => {
    const product = createProduct({
      contact: { phone: "+541112345678" },
    });
    render(<WhatsAppCta product={product} />);
    expect(
      screen.queryByRole("link", { name: /consultar por whatsapp/i }),
    ).not.toBeInTheDocument();
  });

  it("renders CTA with default WhatsApp from env when no product contact", () => {
    const product = createProduct();
    render(<WhatsAppCta product={product} defaultPhone="5499999999999" />);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).toContain("5499999999999");
  });

  // --- No contact at all ---

  it("renders nothing when no contact and no default phone", () => {
    const product = createProduct();
    const { container } = render(<WhatsAppCta product={product} />);
    // Should render an empty fragment or nothing visible
    expect(container.firstChild).toBeNull();
  });

  // --- Luxury Theme overrides ---
  // Luxury styling is driven purely by the `luxury:` Tailwind variant
  // (ancestor-scoped to [data-theme="luxury"]). The component no longer reads
  // the Zustand store; the base green style + luxury overrides coexist in markup.
  it("applies premium minimalist luxury variant classes on the CTA", () => {
    const product = createProduct({
      contact: { whatsapp: "5491112345678" },
    });

    render(<div data-theme="luxury"><WhatsAppCta product={product} /></div>);
    const link = screen.getByRole("link", { name: /consultar por whatsapp/i });

    // Base (non-luxury) style present, luxury variant overrides layered on top
    expect(link).toHaveClass("bg-green-600");
    expect(link).toHaveClass("luxury:bg-ink");
    expect(link).toHaveClass("luxury:text-canvas");
    expect(link).toHaveClass("luxury:rounded-none");
  });
});
