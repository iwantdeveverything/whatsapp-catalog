import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useCatalogStore } from "@/lib/store";

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Reset data-theme attribute and store before each test
    document.documentElement.removeAttribute("data-theme");
    act(() => {
      useCatalogStore.getState().resetToDefault();
    });
  });

  it("applies data-theme='shopify' on document element on mount", () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("shopify");
  });

  it("updates data-theme when store theme changes", () => {
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

  it("syncs meta theme-color to Shopify canvas color on mount", () => {
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

  it("updates meta theme-color when store theme changes to a dark theme", () => {
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

  it("updates meta theme-color when store theme changes to a light theme", () => {
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

  it("syncs store from DOM data-theme on mount when SSR set a different theme", () => {
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
});
