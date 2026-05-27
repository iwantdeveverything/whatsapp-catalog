import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditCategoryPage from "@/app/admin/categories/[id]/page";
import type { Category } from "@/lib/services/interfaces";

// ── Mocks ──────────────────────────────────────────────────

const mockPush = vi.fn();
const mockUpdateCategory = vi.fn();
const mockFetchCategories = vi.fn();
const mockAddToast = vi.fn();
let mockParamsId = "drinks";

const baseCategory: Category = {
  id: "drinks",
  name: "Drinks",
  slug: "drinks",
  description: "Hot and cold drinks",
  productCount: 2,
};

const mockCategoryStore = {
  categories: [baseCategory] as Category[],
  loading: false,
  error: null as string | null,
  fetchCategories: mockFetchCategories,
  updateCategory: mockUpdateCategory,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: mockParamsId }),
}));

vi.mock("@/lib/stores/adminCategoryStore", () => ({
  useAdminCategoryStore: vi.fn(() => mockCategoryStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("EditCategoryPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUpdateCategory.mockReset();
    mockUpdateCategory.mockResolvedValue({ ...baseCategory });
    mockFetchCategories.mockClear();
    mockAddToast.mockClear();
    mockCategoryStore.categories = [baseCategory];
    mockCategoryStore.loading = false;
    mockCategoryStore.error = null;
    mockParamsId = "drinks";
  });

  it("pre-fills the form with the existing category values", () => {
    render(<EditCategoryPage />);
    const nameInput = screen.getByLabelText(/^name/i) as HTMLInputElement;
    const slugInput = screen.getByLabelText(/^slug/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(
      /description/i,
    ) as HTMLTextAreaElement;
    expect(nameInput.value).toBe("Drinks");
    expect(slugInput.value).toBe("drinks");
    expect(descInput.value).toBe("Hot and cold drinks");
  });

  it("updates the slug when the name changes", async () => {
    const user = userEvent.setup();
    render(<EditCategoryPage />);
    const nameInput = screen.getByLabelText(/^name/i) as HTMLInputElement;
    const slugInput = screen.getByLabelText(/^slug/i) as HTMLInputElement;

    await user.clear(nameInput);
    await user.type(nameInput, "Cold Drinks");

    expect(slugInput.value).toBe("cold-drinks");
  });

  it("calls updateCategory with updated values on submit", async () => {
    const user = userEvent.setup();
    render(<EditCategoryPage />);

    const nameInput = screen.getByLabelText(/^name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Beverages");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockUpdateCategory).toHaveBeenCalledWith("drinks", {
      name: "Beverages",
      description: "Hot and cold drinks",
    });
  });

  it("shows success toast and navigates after save", async () => {
    const user = userEvent.setup();
    render(<EditCategoryPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/admin/categories");
  });

  it("renders not-found when category is missing", () => {
    mockParamsId = "missing";
    mockCategoryStore.categories = [baseCategory];
    render(<EditCategoryPage />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("fetches categories on mount when list is empty", () => {
    mockCategoryStore.categories = [];
    render(<EditCategoryPage />);
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  it("shows error toast when updateCategory rejects", async () => {
    const user = userEvent.setup();
    mockUpdateCategory.mockRejectedValueOnce(new Error("boom"));
    render(<EditCategoryPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
