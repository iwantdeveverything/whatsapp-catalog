import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search-bar";
import { useCatalogStore } from "@/lib/store";

/** Render component wrapped in the Shopify theme context */
function renderWithTheme(ui: React.ReactElement) {
  return render(<div data-theme="shopify">{ui}</div>);
}

describe("SearchBar", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      searchQuery: "",
      activeCategory: null,
      isMobileMenuOpen: false,
    });
  });

  // --- Rendering ---

  it("renders a search input with a label", () => {
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Buscar productos...");
  });

  it("displays the current searchQuery from the store", () => {
    useCatalogStore.setState({ searchQuery: "zap" });
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("zap");
  });

  it("displays empty input when store has empty searchQuery", () => {
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("");
  });

  // --- Interaction ---

  it("updates store searchQuery when user types", async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "camisa");
    expect(useCatalogStore.getState().searchQuery).toBe("camisa");
  });

  it("clears store searchQuery when input is cleared", async () => {
    const user = userEvent.setup();
    useCatalogStore.setState({ searchQuery: "zap" });
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.clear(input);
    expect(useCatalogStore.getState().searchQuery).toBe("");
  });

  it("updates store for each keystroke", async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "z");
    expect(useCatalogStore.getState().searchQuery).toBe("z");
    await user.type(input, "a");
    expect(useCatalogStore.getState().searchQuery).toBe("za");
    await user.type(input, "p");
    expect(useCatalogStore.getState().searchQuery).toBe("zap");
  });

  // --- Accessibility ---

  it("has an accessible label via aria-label", () => {
    renderWithTheme(<SearchBar />);
    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-label", "Buscar productos");
  });
});
