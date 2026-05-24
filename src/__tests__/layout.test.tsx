import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { metadata } from "@/app/layout";

// Mock next/font/google — Inter() returns a simple config object
vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    subsets: ["latin"],
  }),
}));

// Dynamic import after mock is set up
const { default: RootLayout } = await import("@/app/layout");

describe("RootLayout", () => {
  it("renders children inside the layout", () => {
    render(
      <RootLayout>
        <p>Catalog content goes here</p>
      </RootLayout>,
    );
    expect(screen.getByText("Catalog content goes here")).toBeInTheDocument();
  });

  it("renders multiple children correctly", () => {
    render(
      <RootLayout>
        <header>Header</header>
        <main>Main content</main>
        <footer>Footer</footer>
      </RootLayout>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders without crashing with empty children", () => {
    const { container } = render(<RootLayout>{null}</RootLayout>);
    expect(container).toBeTruthy();
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
