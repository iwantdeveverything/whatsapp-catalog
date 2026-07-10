import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CatalogHeader } from "@/components/catalog-header";

describe("CatalogHeader", () => {
  it("renders the business name", () => {
    render(<CatalogHeader />);
    expect(screen.getByRole("heading", { level: 1, name: "Catálogo Digital" })).toBeInTheDocument();
  });

  // Luxury styling is driven purely by the `luxury:` Tailwind variant
  // (ancestor-scoped to [data-theme="luxury"]). No Zustand store involved.
  it("applies luxury variant classes on the heading", () => {
    render(<div data-theme="luxury"><CatalogHeader /></div>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("luxury:font-serif");
    expect(heading).toHaveClass("luxury:tracking-wide");
  });

  // Public catalog is luxury-only: the theme-picker entry point is removed.
  it("does not render a link to the /ajustes theme picker", () => {
    render(<CatalogHeader />);
    const link = screen.queryByRole("link", { name: /tema/i });
    expect(link).not.toBeInTheDocument();
  });
});
