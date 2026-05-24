import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock ThemeCard to simplify assertions — tested separately
vi.mock("@/components/theme-card", () => ({
  ThemeCard: ({
    theme,
    isActive,
    onClick,
  }: {
    theme: { id: string; name: string; category: string };
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      data-testid="theme-card"
      data-theme-id={theme.id}
      data-active={String(isActive)}
      onClick={onClick}
    >
      {theme.name}
    </button>
  ),
}));

// Mock the store
const mockSetTheme = vi.fn();
const mockResetToDefault = vi.fn();
let mockCurrentTheme = "shopify";

vi.mock("@/lib/store", () => ({
  useCatalogStore: (selector?: (s: unknown) => unknown) => {
    const state = {
      currentTheme: mockCurrentTheme,
      setTheme: mockSetTheme,
      resetToDefault: mockResetToDefault,
    };
    return selector ? selector(state) : state;
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link (for "Restaurar predeterminado")
vi.mock("next/link", () => ({
  default: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
  }) => <a {...rest}>{children}</a>,
}));

beforeEach(() => {
  mockCurrentTheme = "shopify";
  mockSetTheme.mockClear();
  mockResetToDefault.mockClear();
});

describe("AjustesPage", () => {
  it("renders the page title 'Temas'", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    expect(screen.getByText("Temas")).toBeInTheDocument();
  });

  it('renders "Restaurar predeterminado" button', async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    expect(
      screen.getByText(/Restaurar predeterminado/i),
    ).toBeInTheDocument();
  });

  it("renders category tabs", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    expect(screen.getByRole("tab", { name: /Todos/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /E-commerce/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Media/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /DevTools/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Design/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Fintech/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /AI/i })).toBeInTheDocument();
  });

  it("renders theme cards from the registry", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    // Should render at least some theme cards
    const cards = screen.getAllByTestId("theme-card");
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it("marks the active theme card with data-active=true", async () => {
    mockCurrentTheme = "nike";
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    const nikeCard = screen.getAllByTestId("theme-card").find(
      (c) => c.dataset.themeId === "nike",
    );
    expect(nikeCard).toBeDefined();
    expect(nikeCard!.dataset.active).toBe("true");
  });

  it("calls setTheme when a theme card is clicked", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    const card = screen.getAllByTestId("theme-card").find(
      (c) => c.dataset.themeId === "nike",
    );
    fireEvent.click(card!);
    expect(mockSetTheme).toHaveBeenCalledWith("nike");
  });

  it("resets to default when 'Restaurar predeterminado' is clicked", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);
    const resetButton = screen.getByText(/Restaurar predeterminado/i);
    fireEvent.click(resetButton);
    expect(mockResetToDefault).toHaveBeenCalled();
  });

  it("filters themes by category when a tab is clicked", async () => {
    const { default: AjustesPage } = await import("@/app/ajustes/page");
    render(<AjustesPage />);

    // Initially all themes shown (Todos tab)
    const allCards = screen.getAllByTestId("theme-card");
    expect(allCards.length).toBeGreaterThan(5);

    // Click AI tab
    const aiTab = screen.getByRole("tab", { name: /AI/i });
    fireEvent.click(aiTab);

    // After filtering, fewer cards should be shown
    const filteredCards = screen.getAllByTestId("theme-card");
    expect(filteredCards.length).toBeGreaterThan(0);
    expect(filteredCards.length).toBeLessThan(allCards.length);
  });
});
