import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock next/image and next/link (needed by ProductCard inside ProductGrid)
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
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("HomePage", () => {
  it("renders the business name as an h1 heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Catálogo Digital" }),
    ).toBeInTheDocument();
  });

  it("renders product cards from the catalog", () => {
    render(<HomePage />);
    // The real products.ts has 7 products, so we should see product names
    expect(screen.getByText("Zapatillas Running")).toBeInTheDocument();
    expect(screen.getByText("Camisa Oxford")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<HomePage />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders category filter buttons", () => {
    render(<HomePage />);
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calzado" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ropa" })).toBeInTheDocument();
  });

  it("renders all 7 active products", () => {
    render(<HomePage />);
    const productNames = [
      "Zapatillas Running",
      "Zapatos de Cuero",
      "Camisa Oxford",
      "Remera Algodón Premium",
      "Mochila Viajera 40L",
      "Gorro de Invierno",
      "Servicio de Diseño Personalizado",
    ];
    for (const name of productNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders a link to the settings page", () => {
    render(<HomePage />);
    const settingsLink = screen.getByRole("link", { name: /ajustes|tema/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/ajustes");
  });
});
