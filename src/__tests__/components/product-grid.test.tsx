import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGrid } from "@/components/product-grid";
import { useCatalogStore } from "@/lib/store";
import type { Product } from "@/lib/schemas";

// Mock next/image and next/link (needed by ProductCard rendered inside ProductGrid)
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: `product-${overrides.id ?? Math.random().toString(36).slice(2)}`,
    name: "Default Product",
    description: "A test product",
    price: 10000,
    images: ["https://example.com/img.jpg"],
    category: "General",
    isActive: true,
    ...overrides,
  };
}

const MOCK_PRODUCTS: Product[] = [
  createProduct({
    id: "zapatillas",
    name: "Zapatillas Running",
    price: 85000,
    category: "Calzado",
  }),
  createProduct({
    id: "zapatos",
    name: "Zapatos de Cuero",
    price: 120000,
    category: "Calzado",
  }),
  createProduct({
    id: "camisa",
    name: "Camisa Oxford",
    price: 45000,
    category: "Ropa",
  }),
  createProduct({
    id: "remera",
    name: "Remera Algodón",
    price: 18000,
    category: "Ropa",
  }),
  createProduct({
    id: "mochila",
    name: "Mochila Viajera",
    price: 32000,
    category: "Accesorios",
  }),
];

/** Render component wrapped in the Shopify theme context */
function renderWithTheme(ui: React.ReactElement) {
  return render(<div data-theme="shopify">{ui}</div>);
}

describe("ProductGrid", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      searchQuery: "",
      activeCategory: null,
      isMobileMenuOpen: false,
    });
  });

  // --- Basic rendering ---

  it("renders all products when no filters are active", () => {
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    for (const product of MOCK_PRODUCTS) {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    }
  });

  it("renders SearchBar component", () => {
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders category filter with unique categories", () => {
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calzado" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ropa" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Accesorios" }),
    ).toBeInTheDocument();
  });

  // --- Search filtering ---

  it("filters products by search query (case-insensitive)", () => {
    useCatalogStore.setState({ searchQuery: "zapatillas" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("Zapatillas Running")).toBeInTheDocument();
    expect(screen.queryByText("Zapatos de Cuero")).not.toBeInTheDocument();
  });

  it("filters products by partial name match", () => {
    useCatalogStore.setState({ searchQuery: "zap" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("Zapatillas Running")).toBeInTheDocument();
    expect(screen.getByText("Zapatos de Cuero")).toBeInTheDocument();
    expect(screen.queryByText("Camisa Oxford")).not.toBeInTheDocument();
  });

  it("shows all products when search query is empty", () => {
    useCatalogStore.setState({ searchQuery: "" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    for (const product of MOCK_PRODUCTS) {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    }
  });

  // --- Category filtering ---

  it("filters products by active category", () => {
    useCatalogStore.setState({ activeCategory: "Calzado" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("Zapatillas Running")).toBeInTheDocument();
    expect(screen.getByText("Zapatos de Cuero")).toBeInTheDocument();
    expect(screen.queryByText("Camisa Oxford")).not.toBeInTheDocument();
  });

  it("combines search and category filters", () => {
    useCatalogStore.setState({
      searchQuery: "cuero",
      activeCategory: "Calzado",
    });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("Zapatos de Cuero")).toBeInTheDocument();
    expect(screen.queryByText("Zapatillas Running")).not.toBeInTheDocument();
  });

  // --- Empty state ---

  it("shows empty state message when no products match", () => {
    useCatalogStore.setState({ searchQuery: "zzzzz" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("No se encontraron productos")).toBeInTheDocument();
  });

  // --- Product card links ---

  it("renders product links pointing to correct detail pages", () => {
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS.slice(0, 2)} />);
    expect(
      screen.getByRole("link", { name: /zapatillas running/i }),
    ).toHaveAttribute("href", "/zapatillas");
    expect(
      screen.getByRole("link", { name: /zapatos de cuero/i }),
    ).toHaveAttribute("href", "/zapatos");
  });

  // --- Responsive grid ---

  it("renders products in a grid container", () => {
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    // The grid div should have grid classes
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  // --- Category pills update store ---

  it("updates store when category pill is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    await user.click(screen.getByRole("button", { name: "Calzado" }));
    expect(useCatalogStore.getState().activeCategory).toBe("Calzado");
  });

  // --- Diacritic-insensitive search ---

  it("filters products with diacritic-insensitive search", () => {
    useCatalogStore.setState({ searchQuery: "algodon" });
    renderWithTheme(<ProductGrid products={MOCK_PRODUCTS} />);
    expect(screen.getByText("Remera Algodón")).toBeInTheDocument();
  });
});
