import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getAllProducts } from "@/lib/data/catalog";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("CategoryPage", () => {
  it("renders the category name as a heading", async () => {
    const page = await import("@/app/categories/[category]/page");
    const CategoryPage = page.default;
    render(
      await CategoryPage({
        params: Promise.resolve({ category: "Calzado" }),
      }),
    );
    expect(
      screen.getByRole("heading", { name: /calzado/i }),
    ).toBeInTheDocument();
  });

  it("renders products in the specified category", async () => {
    const page = await import("@/app/categories/[category]/page");
    const CategoryPage = page.default;
    const products = getAllProducts();
    const calzadoCount = products.filter(
      (p) => p.category === "Calzado",
    ).length;

    render(
      await CategoryPage({
        params: Promise.resolve({ category: "Calzado" }),
      }),
    );

    const cards = screen.getAllByRole("link");
    // Each product card is a link
    expect(cards.length).toBeGreaterThanOrEqual(calzadoCount);
  });

  it("renders only products from the specified category", async () => {
    const page = await import("@/app/categories/[category]/page");
    const CategoryPage = page.default;

    render(
      await CategoryPage({
        params: Promise.resolve({ category: "Calzado" }),
      }),
    );

    // Should show Calzado products
    expect(screen.getByText(/zapatillas running/i)).toBeInTheDocument();
    expect(screen.getByText(/zapatos de cuero/i)).toBeInTheDocument();
    // Should NOT show Ropa products
    expect(screen.queryByText(/camisa oxford/i)).not.toBeInTheDocument();
  });

  it("shows a message when no products exist in the category", async () => {
    const page = await import("@/app/categories/[category]/page");
    const CategoryPage = page.default;

    render(
      await CategoryPage({
        params: Promise.resolve({ category: "Inexistente" }),
      }),
    );

    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
  });

  it("renders a back link to the catalog", async () => {
    const page = await import("@/app/categories/[category]/page");
    const CategoryPage = page.default;

    render(
      await CategoryPage({
        params: Promise.resolve({ category: "Ropa" }),
      }),
    );

    const backLink = screen.getByRole("link", { name: /catálogo/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});

describe("generateStaticParams (category)", () => {
  it("returns params for all unique categories", async () => {
    const { generateStaticParams } =
      await import("@/app/categories/[category]/page");
    const params = generateStaticParams();
    const products = getAllProducts();
    const uniqueCategories = [
      ...new Set(products.filter((p) => p.isActive).map((p) => p.category)),
    ];
    expect(params.length).toBe(uniqueCategories.length);
  });

  it("each param has a category string", async () => {
    const { generateStaticParams } =
      await import("@/app/categories/[category]/page");
    const params = generateStaticParams();
    for (const param of params) {
      expect(param.category).toBeDefined();
      expect(typeof param.category).toBe("string");
    }
  });
});
