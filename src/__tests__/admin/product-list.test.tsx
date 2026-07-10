import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsPage from "@/app/admin/products/page";
import type { Product } from "@/lib/schemas";

// ── Store mocks ────────────────────────────────────────────

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Product One",
  description: "desc",
  price: 100,
  images: ["https://example.com/p1.jpg"],
  category: "Drinks",
  isActive: true,
  ...overrides,
});

const mockProductStore = {
  products: [] as Product[],
  loading: false,
  error: null as string | null,
  fetchProducts: vi.fn(),
  deleteProduct: vi.fn(),
};

const mockCategoryStore = {
  categories: [] as Array<{ id: string; name: string; slug: string; productCount: number }>,
  fetchCategories: vi.fn(),
};

const mockAddToast = vi.fn();

vi.mock("@/lib/stores/adminProductStore", () => ({
  useAdminProductStore: vi.fn(() => mockProductStore),
}));

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    mockProductStore.products = [
      makeProduct({ id: "p1", name: "Coffee", category: "Drinks", price: 100 }),
      makeProduct({ id: "p2", name: "Tea", category: "Drinks", price: 50 }),
      makeProduct({ id: "p3", name: "Cake", category: "Food", price: 200 }),
    ];
    mockProductStore.loading = false;
    mockProductStore.error = null;
    mockProductStore.fetchProducts = vi.fn();
    mockProductStore.deleteProduct = vi.fn().mockResolvedValue(undefined);
    mockCategoryStore.categories = [
      { id: "drinks", name: "Drinks", slug: "drinks", productCount: 2 },
      { id: "food", name: "Food", slug: "food", productCount: 1 },
    ];
    mockCategoryStore.fetchCategories = vi.fn();
    mockAddToast.mockClear();
  });

  it("fetches products and categories on mount including inactive", () => {
    render(<ProductsPage />);
    expect(mockProductStore.fetchProducts).toHaveBeenCalled();
    expect(mockCategoryStore.fetchCategories).toHaveBeenCalled();
  });

  it("renders the product table with rows", () => {
    render(<ProductsPage />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(within(table).getByText("Coffee")).toBeInTheDocument();
    expect(within(table).getByText("Tea")).toBeInTheDocument();
    expect(within(table).getByText("Cake")).toBeInTheDocument();
  });

  it("renders search input and category filter", () => {
    render(<ProductsPage />);
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it("filters products by search input (client-side)", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    const search = screen.getByLabelText(/search/i);
    await user.type(search, "cof");

    const table = screen.getByRole("table");
    expect(within(table).getByText("Coffee")).toBeInTheDocument();
    expect(within(table).queryByText("Tea")).not.toBeInTheDocument();
    expect(within(table).queryByText("Cake")).not.toBeInTheDocument();
  });

  it("filters products by category", () => {
    render(<ProductsPage />);

    const filter = screen.getByLabelText(/category/i) as HTMLSelectElement;
    fireEvent.change(filter, { target: { value: "Food" } });

    const table = screen.getByRole("table");
    expect(within(table).getByText("Cake")).toBeInTheDocument();
    expect(within(table).queryByText("Coffee")).not.toBeInTheDocument();
  });

  it("renders a link to create new product", () => {
    render(<ProductsPage />);
    const link = screen.getByRole("link", { name: /add item/i });
    expect(link).toHaveAttribute("href", "/admin/products/new");
  });

  it("renders edit links for each product", () => {
    render(<ProductsPage />);
    const edit = screen.getAllByRole("link", { name: /edit/i });
    expect(edit.length).toBeGreaterThanOrEqual(3);
    expect(edit[0]).toHaveAttribute("href", "/admin/products/p1");
  });

  it("opens confirm dialog when delete is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteBtns[0]);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it("calls deleteProduct and shows toast when delete confirmed", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteBtns[0]);

    const confirm = screen.getByRole("button", { name: /^confirm$/i });
    await user.click(confirm);

    expect(mockProductStore.deleteProduct).toHaveBeenCalledWith("p1");
  });

  it("does not call deleteProduct when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteBtns[0]);

    const cancel = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancel);

    expect(mockProductStore.deleteProduct).not.toHaveBeenCalled();
  });

  it("shows loading indicator while fetching", () => {
    mockProductStore.loading = true;
    mockProductStore.products = [];
    render(<ProductsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
