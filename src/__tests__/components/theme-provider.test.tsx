import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useCatalogStore } from "@/lib/store";

// usePathname drives whether ThemeProvider applies store theming (admin) or
// leaves the SSR-forced theme untouched (public). Default to an admin path so
// the store-driven tests exercise admin behavior; override per test as needed.
let mockPathname = "/admin/products";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("ThemeProvider", () => {
  beforeEach(() => {
    mockPathname = "/admin/products";
    // Reset data-theme attribute and store before each test
    document.documentElement.removeAttribute("data-theme");
    act(() => {
      useCatalogStore.getState().resetToDefault();
    });
  });

  it("applies data-theme='shopify' on document element on mount (admin)", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("shopify");
  });

  it("updates data-theme when store theme changes (admin)", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    act(() => {
      useCatalogStore.getState().setTheme("figma");
    });

    expect(document.documentElement.dataset.theme).toBe("figma");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <h1>Settings</h1>
      </ThemeProvider>,
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ThemeProvider>
        <header>Header</header>
        <main>Main</main>
      </ThemeProvider>,
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("syncs meta theme-color to Shopify canvas color on mount (admin)", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    expect(meta).not.toBeNull();
    expect(meta!.content).toBe("#FFFFFF");
  });

  it("updates meta theme-color when store theme changes to a dark theme (admin)", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    act(() => {
      useCatalogStore.getState().setTheme("spotify");
    });

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    expect(meta).not.toBeNull();
    // Spotify canvas is #191414
    expect(meta!.content).toBe("#191414");
  });

  it("updates meta theme-color when store theme changes to a light theme (admin)", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    act(() => {
      useCatalogStore.getState().setTheme("figma");
    });

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    expect(meta).not.toBeNull();
    // Figma canvas is #FFFFFF
    expect(meta!.content).toBe("#FFFFFF");
  });

  it("syncs store from DOM data-theme on mount when SSR set a different theme (admin)", () => {
    // Simulate SSR having set data-theme="apple"
    document.documentElement.dataset.theme = "apple";
    // Store defaults to shopify
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    // Store should now be synced to match the DOM (SSR-provided theme)
    expect(useCatalogStore.getState().currentTheme).toBe("apple");
    // DOM should preserve the SSR theme, not reset to shopify
    expect(document.documentElement.dataset.theme).toBe("apple");
  });

  // ── Public routes: luxury-only, SSR-forced, no store clobber ──

  it("does NOT overwrite the SSR-forced data-theme on public routes", () => {
    mockPathname = "/";
    // SSR forced luxury on the public route
    document.documentElement.dataset.theme = "luxury";
    // Store still holds its default (shopify) — it must NOT clobber the DOM
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    // The SSR-forced luxury theme must survive
    expect(document.documentElement.dataset.theme).toBe("luxury");
    // The store must not be forced to change either
    expect(useCatalogStore.getState().currentTheme).toBe("shopify");
  });

  it("does not clobber public data-theme even when store changes", () => {
    mockPathname = "/";
    document.documentElement.dataset.theme = "luxury";
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    act(() => {
      useCatalogStore.getState().setTheme("figma");
    });

    // Public route: SSR theme stays luxury regardless of store activity
    expect(document.documentElement.dataset.theme).toBe("luxury");
  });

  it("resets a stale admin data-theme to luxury on soft-nav to a public route", () => {
    // Simulate admin having written a non-luxury theme to the DOM, then a
    // client-side soft navigation to a public route.
    mockPathname = "/admin/products";
    document.documentElement.dataset.theme = "figma";
    useCatalogStore.setState({ currentTheme: "figma" });

    const { rerender } = render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    // Admin left "figma" on the DOM
    expect(document.documentElement.dataset.theme).toBe("figma");

    // Soft-nav to a public route: ThemeProvider must assert luxury
    act(() => {
      mockPathname = "/";
    });
    rerender(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("luxury");
  });
});
