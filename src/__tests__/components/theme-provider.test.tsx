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
});
