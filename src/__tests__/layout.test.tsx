import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { metadata, viewport } from "@/app/layout";

// Mock next/font/google — Inter() returns a simple config object
vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    subsets: ["latin"],
  }),
}));

// Mock next/headers — return "x-theme" header value
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(
    new Map([["x-theme", "shopify"]]),
  ),
}));

// Dynamic import after mocks are set up
const { default: RootLayout } = await import("@/app/layout");

describe("RootLayout", () => {
  it("renders children inside the layout", async () => {
    const jsx = await RootLayout({
      children: <p>Catalog content goes here</p>,
    });
    render(jsx);
    expect(screen.getByText("Catalog content goes here")).toBeInTheDocument();
  });

  it("renders multiple children correctly", async () => {
    const jsx = await RootLayout({
      children: (
        <>
          <header>Header</header>
          <main>Main content</main>
          <footer>Footer</footer>
        </>
      ),
    });
    render(jsx);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders without crashing with empty children", async () => {
    const jsx = await RootLayout({ children: null });
    const { container } = render(jsx);
    expect(container).toBeTruthy();
  });

  it("sets data-theme on html element from x-theme header", async () => {
    const jsx = await RootLayout({
      children: <p>content</p>,
    });
    render(jsx);

    const html = document.documentElement;
    expect(html.dataset.theme).toBe("shopify");
  });
});

describe("RootLayout metadata", () => {
  it("exports correct title", () => {
    expect(metadata.title).toBe("Catálogo Digital");
  });

  it("exports correct description", () => {
    expect(metadata.description).toBe(
      "Catálogo de productos digital. Compartí, navegá y consultá precios por WhatsApp.",
    );
  });

  it("includes Open Graph defaults", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.siteName).toBe("Catálogo Digital");
  });
});

describe("RootLayout viewport", () => {
  it("exports a static dark theme-color for the public luxury chrome", () => {
    // Public catalog is luxury-only; SSR chrome must be espresso black, not
    // the default light. viewport.themeColor is the Next.js 16 API for this.
    expect(viewport.themeColor).toBe("#0F0D0C");
  });
});
