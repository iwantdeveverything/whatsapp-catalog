import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoriesPage from "@/app/admin/categories/page";
import type { Category } from "@/lib/services/interfaces";

// ── Store mocks ────────────────────────────────────────────

const mockCategoryStore = {
  categories: [] as Category[],
  loading: false,
  error: null as string | null,
  fetchCategories: vi.fn(),
  deleteCategory: vi.fn(),
};

const mockAddToast = vi.fn();

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("CategoriesPage", () => {
  beforeEach(() => {
    mockCategoryStore.categories = [
      {
        id: "drinks",
        name: "Drinks",
        slug: "drinks",
        description: "Hot and cold drinks",
        productCount: 2,
      },
      {
        id: "food",
        name: "Food",
        slug: "food",
        description: "All food items",
        productCount: 1,
      },
      {
        id: "empty",
        name: "Empty",
        slug: "empty",
        description: undefined,
        productCount: 0,
      },
    ];
    mockCategoryStore.loading = false;
    mockCategoryStore.error = null;
    mockCategoryStore.fetchCategories = vi.fn();
    mockCategoryStore.deleteCategory = vi.fn().mockResolvedValue(undefined);
    mockAddToast.mockClear();
  });

  it("fetches categories on mount", () => {
    render(<CategoriesPage />);
    expect(mockCategoryStore.fetchCategories).toHaveBeenCalled();
  });

  it("renders categories table with all CAT-001 fields", () => {
    render(<CategoriesPage />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Drinks")).toBeInTheDocument();
    expect(within(table).getByText("drinks")).toBeInTheDocument();
    expect(within(table).getByText("Hot and cold drinks")).toBeInTheDocument();
    // productCount appears as a number
    expect(within(table).getByText("Food")).toBeInTheDocument();
    expect(within(table).getByText("Empty")).toBeInTheDocument();
  });

  it("renders a link to create a new category", () => {
    render(<CategoriesPage />);
    const link = screen.getByRole("link", { name: /new category/i });
    expect(link).toHaveAttribute("href", "/admin/categories/new");
  });

  it("renders edit links per category", () => {
    render(<CategoriesPage />);
    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks.length).toBeGreaterThanOrEqual(3);
    // First edit link points to first category id
    expect(editLinks[0]).toHaveAttribute("href", "/admin/categories/drinks");
  });

  it("blocks delete with error toast when productCount > 0", async () => {
    const user = userEvent.setup();
    render(<CategoriesPage />);

    // DataTable renders BOTH mobile card view and desktop table — pick first
    const drinksDelete = screen.getAllByRole("button", {
      name: /delete drinks/i,
    })[0];
    await user.click(drinksDelete);

    expect(mockCategoryStore.deleteCategory).not.toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        message: expect.stringMatching(/2 products/i),
      }),
    );
  });

  it("opens confirm dialog when delete is clicked on empty category", async () => {
    const user = userEvent.setup();
    render(<CategoriesPage />);

    const emptyDelete = screen.getAllByRole("button", {
      name: /delete empty/i,
    })[0];
    await user.click(emptyDelete);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it("calls deleteCategory when delete is confirmed for empty category", async () => {
    const user = userEvent.setup();
    render(<CategoriesPage />);

    const emptyDelete = screen.getAllByRole("button", {
      name: /delete empty/i,
    })[0];
    await user.click(emptyDelete);

    const confirm = screen.getByRole("button", { name: /^confirm$/i });
    await user.click(confirm);

    expect(mockCategoryStore.deleteCategory).toHaveBeenCalledWith("empty");
    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("does not call deleteCategory when cancel clicked", async () => {
    const user = userEvent.setup();
    render(<CategoriesPage />);

    const emptyDelete = screen.getAllByRole("button", {
      name: /delete empty/i,
    })[0];
    await user.click(emptyDelete);

    const cancel = screen.getByRole("button", { name: /^cancel$/i });
    await user.click(cancel);

    expect(mockCategoryStore.deleteCategory).not.toHaveBeenCalled();
  });

  it("shows loading indicator while fetching with no data", () => {
    mockCategoryStore.loading = true;
    mockCategoryStore.categories = [];
    render(<CategoriesPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
