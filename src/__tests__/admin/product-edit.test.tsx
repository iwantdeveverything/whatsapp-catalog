import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProductPage from "@/app/admin/products/[id]/page";
import type { Product } from "@/lib/schemas";

// ── Mocks ──────────────────────────────────────────────────

const mockPush = vi.fn();
const mockUpdateProduct = vi.fn();
const mockFetchProducts = vi.fn();
const mockAddToast = vi.fn();

const sampleProduct: Product = {
  id: "p1",
  name: "Espresso",
  description: "Strong coffee",
  price: 150,
  images: ["https://example.com/img.jpg"],
  category: "Drinks",
  contact: { whatsapp: "+5491111", phone: "11-1234" },
  isActive: true,
};

const mockProductStore = {
  products: [sampleProduct],
  loading: false,
  error: null as string | null,
  fetchProducts: mockFetchProducts,
  updateProduct: mockUpdateProduct,
};

const mockCategoryStore = {
  categories: [
    { id: "drinks", name: "Drinks", slug: "drinks", productCount: 1 },
    { id: "food", name: "Food", slug: "food", productCount: 0 },
  ],
  fetchCategories: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: "p1" }),
}));

vi.mock("@/lib/stores/adminProductStore", () => ({
  useAdminProductStore: vi.fn(() => mockProductStore),
}));

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("EditProductPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUpdateProduct.mockReset();
    mockUpdateProduct.mockResolvedValue({ ...sampleProduct, name: "Updated" });
    mockFetchProducts.mockClear();
    mockAddToast.mockClear();
    mockProductStore.products = [sampleProduct];
    mockProductStore.loading = false;
  });

  it("fetches products on mount when store is empty", () => {
    mockProductStore.products = [];
    render(<EditProductPage />);
    expect(mockFetchProducts).toHaveBeenCalled();
  });

  it("pre-fills the form with product data", () => {
    render(<EditProductPage />);

    expect((screen.getByLabelText(/^name/i) as HTMLInputElement).value).toBe(
      "Espresso",
    );
    expect(
      (screen.getByLabelText(/description/i) as HTMLTextAreaElement).value,
    ).toBe("Strong coffee");
    expect((screen.getByLabelText(/price/i) as HTMLInputElement).value).toBe(
      "150",
    );
    expect(
      (screen.getByLabelText(/category/i) as HTMLSelectElement).value,
    ).toBe("Drinks");
    expect((screen.getByLabelText(/whatsapp/i) as HTMLInputElement).value).toBe(
      "+5491111",
    );
    expect((screen.getByLabelText(/phone/i) as HTMLInputElement).value).toBe(
      "11-1234",
    );
    expect(
      (screen.getByLabelText(/image url/i) as HTMLInputElement).value,
    ).toBe("https://example.com/img.jpg");
    expect(
      (screen.getByLabelText(/active/i) as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("calls updateProduct with id and modified values on submit", async () => {
    const user = userEvent.setup();
    render(<EditProductPage />);

    const name = screen.getByLabelText(/^name/i);
    await user.clear(name);
    await user.type(name, "Updated");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
    expect(mockUpdateProduct.mock.calls[0][0]).toBe("p1");
    expect(mockUpdateProduct.mock.calls[0][1]).toMatchObject({
      name: "Updated",
      price: 150,
      category: "Drinks",
    });
  });

  it("shows success toast and navigates to /admin/products on success", async () => {
    const user = userEvent.setup();
    render(<EditProductPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/admin/products");
  });

  it("shows error toast when updateProduct rejects", async () => {
    const user = userEvent.setup();
    mockUpdateProduct.mockRejectedValueOnce(new Error("boom"));
    render(<EditProductPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("renders not-found message when product does not exist", () => {
    mockProductStore.products = [];
    mockProductStore.loading = false;
    render(<EditProductPage />);
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("renders loading state while products are being fetched", () => {
    mockProductStore.products = [];
    mockProductStore.loading = true;
    render(<EditProductPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
