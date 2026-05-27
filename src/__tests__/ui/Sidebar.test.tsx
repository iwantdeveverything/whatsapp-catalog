import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui/Sidebar";

// Module-level pathname for mock override
let mockPathname = "/admin/dashboard";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock next/link — render children + pass props through
vi.mock("next/link", () => ({
  default: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    href?: string;
    className?: string;
  }) => <a {...rest}>{children}</a>,
}));

// Wrapper that provides Sidebar context
function SidebarWrapper() {
  return (
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>
  );
}

// Helper to access sidebar context for testing toggle
function ToggleConsumer() {
  const { isOpen, toggle, close } = useSidebar();
  return (
    <div>
      <button data-testid="external-toggle" onClick={toggle}>
        Toggle
      </button>
      <button data-testid="external-close" onClick={close}>
        Close
      </button>
      <span data-testid="sidebar-state">{isOpen ? "open" : "closed"}</span>
    </div>
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname = "/admin/dashboard";
  });

  // ─── navigation items ───────────────────────────────────

  it("renders all navigation items", () => {
    render(<SidebarWrapper />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("navigation items are links to correct routes", () => {
    render(<SidebarWrapper />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/admin/dashboard");

    const productsLink = screen.getByText("Products").closest("a");
    expect(productsLink).toHaveAttribute("href", "/admin/products");

    const categoriesLink = screen.getByText("Categories").closest("a");
    expect(categoriesLink).toHaveAttribute("href", "/admin/categories");

    const settingsLink = screen.getByText("Settings").closest("a");
    expect(settingsLink).toHaveAttribute("href", "/admin/settings");
  });

  // ─── active route highlighting ──────────────────────────

  it("marks the active route with aria-current='page'", () => {
    mockPathname = "/admin/dashboard";
    render(<SidebarWrapper />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive routes with aria-current", () => {
    mockPathname = "/admin/dashboard";
    render(<SidebarWrapper />);

    const productsLink = screen.getByText("Products").closest("a");
    expect(productsLink).not.toHaveAttribute("aria-current", "page");
  });

  it("updates aria-current when pathname changes to products", () => {
    mockPathname = "/admin/products";
    render(<SidebarWrapper />);

    const productsLink = screen.getByText("Products").closest("a");
    expect(productsLink).toHaveAttribute("aria-current", "page");

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).not.toHaveAttribute("aria-current", "page");
  });

  // ─── desktop sidebar ────────────────────────────────────

  it("renders a navigation landmark for the sidebar", () => {
    render(<SidebarWrapper />);

    // The inner <nav> element provides the navigation landmark
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    // Verify the nav is inside the sidebar aside
    expect(nav.closest("aside")).toBeInTheDocument();
  });

  // ─── hamburger toggle ───────────────────────────────────

  it("has a hamburger button", () => {
    render(<SidebarWrapper />);

    // Find the hamburger by its aria-label
    const hamburger = screen.getByLabelText("Open sidebar");
    expect(hamburger).toBeInTheDocument();
    expect(hamburger.tagName).toBe("BUTTON");
  });

  // ─── SidebarProvider context ────────────────────────────

  it("SidebarProvider starts with sidebar closed", () => {
    render(
      <SidebarProvider>
        <ToggleConsumer />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("closed");
  });

  it("toggle opens and closes the sidebar via context", async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <ToggleConsumer />
      </SidebarProvider>,
    );

    await user.click(screen.getByTestId("external-toggle"));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("open");

    await user.click(screen.getByTestId("external-toggle"));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("closed");
  });

  it("close explicitly closes the sidebar", async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <ToggleConsumer />
      </SidebarProvider>,
    );

    await user.click(screen.getByTestId("external-toggle"));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("open");

    await user.click(screen.getByTestId("external-close"));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("closed");
  });

  // ─── nav item icons ──────────────────────────────────────

  it("each nav item has a single-letter icon placeholder", () => {
    render(<SidebarWrapper />);

    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("P")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });
});
