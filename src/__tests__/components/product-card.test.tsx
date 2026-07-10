import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/schemas";

// Mock next/image — render as plain <img> in test environment
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />
  ),
}));

// Mock next/link — render as plain <a>
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-product",
    name: "Test Product",
    description: "A test product for unit tests",
    price: 10000,
    images: ["https://example.com/photo.jpg"],
    category: "Test",
    isActive: true,
    ...overrides,
  };
}

/** Render component wrapped in the Shopify theme context */
function renderWithTheme(ui: React.ReactElement) {
  return render(<div data-theme="shopify">{ui}</div>);
}

describe("ProductCard", () => {
  // --- Basic rendering ---

  it("renders the product name", () => {
    const product = createProduct({ name: "Zapatillas Running" });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("Zapatillas Running")).toBeInTheDocument();
  });

  it("renders the product price formatted with thousands separator", () => {
    const product = createProduct({ price: 85000 });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("$85.000")).toBeInTheDocument();
  });

  it('renders "Consultar" when price is "Consultar"', () => {
    const product = createProduct({ price: "Consultar" as const });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("Consultar")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    const product = createProduct({ category: "Calzado" });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("Calzado")).toBeInTheDocument();
  });

  // --- Link behavior ---

  it("wraps the card in a link to the product detail page", () => {
    const product = createProduct({ id: "zapatillas-running" });
    renderWithTheme(<ProductCard product={product} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/zapatillas-running");
  });

  it("link includes the product id in the href", () => {
    const product = createProduct({ id: "mochila-viajera" });
    renderWithTheme(<ProductCard product={product} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/mochila-viajera");
  });

  // --- Image ---

  it("renders the product image with correct src and alt text", () => {
    const product = createProduct({
      images: ["https://example.com/zapas.jpg"],
      name: "Zapatillas",
    });
    renderWithTheme(<ProductCard product={product} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/zapas.jpg");
    expect(img).toHaveAttribute("alt", "Zapatillas");
  });

  // --- Themed card: semantic tokens preserve all content ---

  it("renders all content correctly inside shopify theme", () => {
    const product = createProduct({
      name: "Camisa Oxford",
      price: 45000,
      category: "Ropa",
    });
    renderWithTheme(<ProductCard product={product} />);
    // Name, price, and category must all be visible
    expect(screen.getByText("Camisa Oxford")).toBeInTheDocument();
    expect(screen.getByText("$45.000")).toBeInTheDocument();
    expect(screen.getByText("Ropa")).toBeInTheDocument();
    // Link still navigates correctly
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test-product");
  });

  // --- Price edge cases ---

  it("formats small prices correctly", () => {
    const product = createProduct({ price: 9500 });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("$9.500")).toBeInTheDocument();
  });

  it("formats prices with six digits correctly", () => {
    const product = createProduct({ price: 120000 });
    renderWithTheme(<ProductCard product={product} />);
    expect(screen.getByText("$120.000")).toBeInTheDocument();
  });

  // --- Luxury Theme Overrides ---
  // Luxury styling is driven purely by the `luxury:` Tailwind variant, which is
  // ancestor-scoped to [data-theme="luxury"] on <html> (set at SSR). The component
  // is a server component and does NOT read the Zustand store.

  it("applies luxury variant classes so the card styles under [data-theme=luxury]", () => {
    const product = createProduct({ name: "Vestido Elegante", price: 150000 });

    render(<div data-theme="luxury"><ProductCard product={product} /></div>);

    const title = screen.getByText("Vestido Elegante");
    // Serif is applied only when inside a luxury ancestor, via the variant class
    expect(title).toHaveClass("luxury:font-serif");

    const imageContainer = title.parentElement?.previousElementSibling;
    // Base aspect stays square; luxury variant overrides it to 4/5
    expect(imageContainer).toHaveClass("aspect-square");
    expect(imageContainer).toHaveClass("luxury:aspect-[4/5]");
  });
});
