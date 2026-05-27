import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewCategoryPage from "@/app/admin/categories/new/page";

// ── Mocks ──────────────────────────────────────────────────

const mockPush = vi.fn();
const mockCreateCategory = vi.fn();
const mockAddToast = vi.fn();

const mockCategoryStore = {
  createCategory: mockCreateCategory,
  loading: false,
  error: null as string | null,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("NewCategoryPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCreateCategory.mockReset();
    mockCreateCategory.mockResolvedValue({ id: "new-cat" });
    mockAddToast.mockClear();
    mockCategoryStore.loading = false;
    mockCategoryStore.error = null;
  });

  it("renders name, slug, and description fields", () => {
    render(<NewCategoryPage />);
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("auto-generates slug from name as user types", async () => {
    const user = userEvent.setup();
    render(<NewCategoryPage />);

    await user.type(screen.getByLabelText(/^name/i), "Summer Sale");

    const slugInput = screen.getByLabelText(/^slug/i) as HTMLInputElement;
    expect(slugInput.value).toBe("summer-sale");
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();
    render(<NewCategoryPage />);

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(mockCreateCategory).not.toHaveBeenCalled();
  });

  it("calls createCategory with name and description on valid submit", async () => {
    const user = userEvent.setup();
    render(<NewCategoryPage />);

    await user.type(screen.getByLabelText(/^name/i), "Hot Drinks");
    await user.type(screen.getByLabelText(/description/i), "Coffee and tea");

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(mockCreateCategory).toHaveBeenCalledTimes(1);
    expect(mockCreateCategory).toHaveBeenCalledWith({
      name: "Hot Drinks",
      description: "Coffee and tea",
    });
  });

  it("allows submitting without a description (optional field)", async () => {
    const user = userEvent.setup();
    render(<NewCategoryPage />);

    await user.type(screen.getByLabelText(/^name/i), "Snacks");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(mockCreateCategory).toHaveBeenCalledWith({
      name: "Snacks",
      description: undefined,
    });
  });

  it("shows success toast and navigates to /admin/categories after create", async () => {
    const user = userEvent.setup();
    render(<NewCategoryPage />);

    await user.type(screen.getByLabelText(/^name/i), "Snacks");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await screen.findByRole("button", { name: /create/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/admin/categories");
  });

  it("shows error toast when createCategory rejects", async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockRejectedValueOnce(new Error("boom"));
    render(<NewCategoryPage />);

    await user.type(screen.getByLabelText(/^name/i), "Snacks");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await screen.findByRole("button", { name: /create/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("renders a cancel link back to /admin/categories", () => {
    render(<NewCategoryPage />);
    const link = screen.getByRole("link", { name: /cancel/i });
    expect(link).toHaveAttribute("href", "/admin/categories");
  });
});
