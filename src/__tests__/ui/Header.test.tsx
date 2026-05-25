import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/ui/Header";
import { SidebarProvider } from "@/components/ui/Sidebar";

// Module-level mocks
let mockPathname = "/admin/dashboard";
const mockLogout = vi.fn();

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock authStore
vi.mock("@/lib/stores/authStore", () => ({
  useAuthStore: (selector?: (state: unknown) => unknown) => {
    const state = { logout: mockLogout };
    return selector ? selector(state) : state;
  },
}));

// Wrapper with sidebar context
function HeaderWrapper({ pathname = "/admin/dashboard" }: { pathname?: string }) {
  mockPathname = pathname;

  return (
    <SidebarProvider>
      <Header />
    </SidebarProvider>
  );
}

describe("Header", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  // ─── breadcrumb ─────────────────────────────────────────

  it("shows the current page name as breadcrumb", () => {
    render(<HeaderWrapper pathname="/admin/dashboard" />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("shows Products in breadcrumb when on products page", () => {
    render(<HeaderWrapper pathname="/admin/products" />);

    expect(screen.getByText(/Products/i)).toBeInTheDocument();
  });

  it("shows Categories in breadcrumb when on categories page", () => {
    render(<HeaderWrapper pathname="/admin/categories" />);

    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  });

  it("shows Settings in breadcrumb when on settings page", () => {
    render(<HeaderWrapper pathname="/admin/settings" />);

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  // ─── logout ─────────────────────────────────────────────

  it("renders a logout button", () => {
    render(<HeaderWrapper />);

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls authStore.logout when logout button is clicked", async () => {
    const user = userEvent.setup();
    render(<HeaderWrapper />);

    await user.click(screen.getByRole("button", { name: /Logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  // ─── mobile hamburger ───────────────────────────────────

  it("renders a hamburger button for mobile", () => {
    render(<HeaderWrapper />);

    const hamburger = screen.getByLabelText("Open sidebar");
    expect(hamburger).toBeInTheDocument();
    expect(hamburger.tagName).toBe("BUTTON");
  });
});
