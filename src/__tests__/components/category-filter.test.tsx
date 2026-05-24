import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@/components/category-filter";
import { useCatalogStore } from "@/lib/store";

const SAMPLE_CATEGORIES = ["Calzado", "Ropa", "Accesorios", "Servicios"];

describe("CategoryFilter", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      searchQuery: "",
      activeCategory: null,
      isMobileMenuOpen: false,
    });
  });

  // --- Rendering ---

  it("renders all categories as clickable buttons", () => {
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    for (const cat of SAMPLE_CATEGORIES) {
      expect(
        screen.getByRole("button", { name: cat }),
      ).toBeInTheDocument();
    }
  });

  it("renders an 'All' button to clear the filter", () => {
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    expect(
      screen.getByRole("button", { name: "Todos" }),
    ).toBeInTheDocument();
  });

  it("renders correct number of buttons (categories + 1 for All)", () => {
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(SAMPLE_CATEGORIES.length + 1);
  });

  // --- Active state ---

  it('highlights "Todos" when no category is active', () => {
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    const allButton = screen.getByRole("button", { name: "Todos" });
    // "Todos" should have visual distinction — check for aria-pressed or data attribute
    expect(allButton).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights the active category button", () => {
    useCatalogStore.setState({ activeCategory: "Ropa" });
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    expect(
      screen.getByRole("button", { name: "Ropa" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("does not highlight inactive category buttons", () => {
    useCatalogStore.setState({ activeCategory: "Ropa" });
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    expect(
      screen.getByRole("button", { name: "Calzado" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  // --- Interaction ---

  it("sets activeCategory in the store when a category is clicked", async () => {
    const user = userEvent.setup();
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    await user.click(screen.getByRole("button", { name: "Calzado" }));
    expect(useCatalogStore.getState().activeCategory).toBe("Calzado");
  });

  it("clears activeCategory when the active category is clicked again", async () => {
    const user = userEvent.setup();
    useCatalogStore.setState({ activeCategory: "Calzado" });
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    await user.click(screen.getByRole("button", { name: "Calzado" }));
    expect(useCatalogStore.getState().activeCategory).toBeNull();
  });

  it('clears activeCategory when "Todos" is clicked', async () => {
    const user = userEvent.setup();
    useCatalogStore.setState({ activeCategory: "Ropa" });
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    await user.click(screen.getByRole("button", { name: "Todos" }));
    expect(useCatalogStore.getState().activeCategory).toBeNull();
  });

  it("switches activeCategory when a different category is clicked", async () => {
    const user = userEvent.setup();
    useCatalogStore.setState({ activeCategory: "Calzado" });
    render(<CategoryFilter categories={SAMPLE_CATEGORIES} />);
    await user.click(screen.getByRole("button", { name: "Ropa" }));
    expect(useCatalogStore.getState().activeCategory).toBe("Ropa");
  });

  // --- Empty state ---

  it("renders only 'Todos' when categories list is empty", () => {
    render(<CategoryFilter categories={[]} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
  });
});
