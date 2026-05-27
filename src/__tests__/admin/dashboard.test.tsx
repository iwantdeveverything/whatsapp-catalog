import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/admin/dashboard/page";

// Mock the stores
const mockProductStore = {
  products: [] as Array<{ isActive: boolean; name: string; category: string }>,
  loading: false,
  fetchProducts: vi.fn(),
};

const mockCategoryStore = {
  categories: [] as Array<{ id: string; name: string }>,
  loading: false,
  fetchCategories: vi.fn(),
};

vi.mock("@/lib/stores/adminProductStore", () => ({
  useAdminProductStore: vi.fn(() => mockProductStore),
}));

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    mockProductStore.products = [];
    mockProductStore.loading = false;
    mockProductStore.fetchProducts = vi.fn();
    mockCategoryStore.categories = [];
    mockCategoryStore.loading = false;
    mockCategoryStore.fetchCategories = vi.fn();
  });

  // ─── data fetching ───────────────────────────────────────

  it("fetches products and categories on mount", () => {
    render(<DashboardPage />);

    expect(mockProductStore.fetchProducts).toHaveBeenCalledOnce();
    expect(mockCategoryStore.fetchCategories).toHaveBeenCalledOnce();
  });

  // ─── loading state ───────────────────────────────────────

  it("shows loading indicator while stores are loading", () => {
    mockProductStore.loading = true;
    mockCategoryStore.loading = true;

    render(<DashboardPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // ─── stats cards ─────────────────────────────────────────

  it("displays total products count correctly", () => {
    mockProductStore.products = [
      { isActive: true, name: "A", category: "Cat" },
      { isActive: true, name: "B", category: "Cat" },
      { isActive: false, name: "C", category: "Cat" },
    ];
    mockProductStore.fetchProducts = vi.fn();

    render(<DashboardPage />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Total Products")).toBeInTheDocument();
  });

  it("displays total categories count correctly", () => {
    mockCategoryStore.categories = [
      { id: "1", name: "CatA" },
      { id: "2", name: "CatB" },
      { id: "3", name: "CatC" },
      { id: "4", name: "CatD" },
    ];

    render(<DashboardPage />);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Total Categories")).toBeInTheDocument();
  });

  it("displays active products count correctly", () => {
    mockProductStore.products = [
      { isActive: true, name: "A", category: "Cat" },
      { isActive: true, name: "B", category: "Cat" },
      { isActive: false, name: "C", category: "Cat" },
      { isActive: true, name: "D", category: "Cat" },
      { isActive: false, name: "E", category: "Cat" },
    ];

    render(<DashboardPage />);

    // 3 active out of 5 total
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Active Products")).toBeInTheDocument();
  });

  it("shows zeros when stores are empty", () => {
    render(<DashboardPage />);

    // All three stat cards should show "0"
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(3);

    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("Total Categories")).toBeInTheDocument();
    expect(screen.getByText("Active Products")).toBeInTheDocument();
  });

  // ─── quick action links ──────────────────────────────────

  it("renders quick action link to create new product", () => {
    render(<DashboardPage />);

    const link = screen.getByRole("link", { name: /new product/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/products/new");
  });

  it("renders quick action link to manage categories", () => {
    render(<DashboardPage />);

    const link = screen.getByRole("link", { name: /categories/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/categories");
  });
});
