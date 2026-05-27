import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProductPage from "@/app/admin/products/new/page";

// ── Mocks ──────────────────────────────────────────────────

const mockPush = vi.fn();
const mockCreateProduct = vi.fn();
const mockAddToast = vi.fn();

const mockProductStore = {
  createProduct: mockCreateProduct,
  loading: false,
  error: null as string | null,
};

const mockCategoryStore = {
  categories: [
    { id: "drinks", name: "Drinks", slug: "drinks", productCount: 0 },
    { id: "food", name: "Food", slug: "food", productCount: 0 },
  ],
  fetchCategories: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
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

describe("NewProductPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCreateProduct.mockReset();
    mockCreateProduct.mockResolvedValue({ id: "new-product" });
    mockAddToast.mockClear();
    mockProductStore.loading = false;
    mockProductStore.error = null;
  });

  it("renders all form fields", () => {
    render(<NewProductPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();
    render(<NewProductPage />);

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it("shows validation error when price is invalid", async () => {
    const user = userEvent.setup();
    render(<NewProductPage />);

    await user.type(screen.getByLabelText(/^name/i), "Espresso");
    await user.type(screen.getByLabelText(/price/i), "-5");
    await user.selectOptions(screen.getByLabelText(/category/i), "Drinks");

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it("calls createProduct with form values on valid submit", async () => {
    const user = userEvent.setup();
    render(<NewProductPage />);

    await user.type(screen.getByLabelText(/^name/i), "Espresso");
    await user.type(screen.getByLabelText(/description/i), "Strong coffee");
    await user.type(screen.getByLabelText(/price/i), "150");
    await user.selectOptions(screen.getByLabelText(/category/i), "Drinks");
    await user.type(screen.getByLabelText(/whatsapp/i), "+5491111");
    await user.type(screen.getByLabelText(/phone/i), "11-1234");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/x.jpg",
    );

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(mockCreateProduct).toHaveBeenCalledTimes(1);
    const arg = mockCreateProduct.mock.calls[0][0];
    expect(arg).toMatchObject({
      name: "Espresso",
      description: "Strong coffee",
      price: 150,
      category: "Drinks",
      whatsapp: "+5491111",
      phone: "11-1234",
      imageUrl: "https://example.com/x.jpg",
      isActive: true,
    });
  });

  it("shows success toast and navigates to /admin/products on success", async () => {
    const user = userEvent.setup();
    render(<NewProductPage />);

    await user.type(screen.getByLabelText(/^name/i), "Espresso");
    await user.type(screen.getByLabelText(/price/i), "150");
    await user.selectOptions(screen.getByLabelText(/category/i), "Drinks");

    await user.click(screen.getByRole("button", { name: /create/i }));

    // wait for promise
    await screen.findByRole("button", { name: /create/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/admin/products");
  });

  it("shows error toast when createProduct rejects", async () => {
    const user = userEvent.setup();
    mockCreateProduct.mockRejectedValueOnce(new Error("boom"));
    render(<NewProductPage />);

    await user.type(screen.getByLabelText(/^name/i), "Espresso");
    await user.type(screen.getByLabelText(/price/i), "150");
    await user.selectOptions(screen.getByLabelText(/category/i), "Drinks");

    await user.click(screen.getByRole("button", { name: /create/i }));

    await screen.findByRole("button", { name: /create/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("renders a cancel link back to /admin/products", () => {
    render(<NewProductPage />);
    const link = screen.getByRole("link", { name: /cancel/i });
    expect(link).toHaveAttribute("href", "/admin/products");
  });
});
