import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGallery } from "@/components/product-gallery";

// Mock next/image — render as plain <img> in test environment
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />
  ),
}));

const sampleImages = [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg",
];

describe("ProductGallery", () => {
  // --- Basic rendering ---

  it("renders the first image by default", () => {
    render(<ProductGallery images={sampleImages} productName="Test Product" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[0]);
    expect(img).toHaveAttribute("alt", "Test Product - imagen 1");
  });

  it("renders image with correct alt text for subsequent images", async () => {
    render(<ProductGallery images={sampleImages} productName="Zapatillas" />);
    const user = userEvent.setup();
    // Navigate to second image
    await user.click(screen.getByRole("button", { name: /siguiente/i }));
    // After click, the second image should have appropriate alt text
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Zapatillas - imagen 2");
  });

  // --- Single image (no controls) ---

  it("does not render navigation buttons when there is only one image", () => {
    render(
      <ProductGallery
        images={["https://example.com/single.jpg"]}
        productName="Single Product"
      />,
    );
    expect(
      screen.queryByRole("button", { name: /anterior/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /siguiente/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the single image with correct alt", () => {
    render(
      <ProductGallery
        images={["https://example.com/only.jpg"]}
        productName="Unique"
      />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/only.jpg");
    expect(img).toHaveAttribute("alt", "Unique");
  });

  // --- Navigation (multiple images) ---

  it("navigates to the next image when clicking next button", async () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const user = userEvent.setup();
    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    await user.click(nextButton);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[1]);
  });

  it("navigates to the previous image when clicking prev button", async () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const user = userEvent.setup();
    // Go forward first
    await user.click(screen.getByRole("button", { name: /siguiente/i }));
    // Then back
    await user.click(screen.getByRole("button", { name: /anterior/i }));

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[0]);
  });

  it("wraps to the last image when clicking prev on first image", async () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /anterior/i }));

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[2]);
  });

  it("wraps to the first image when clicking next on last image", async () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const user = userEvent.setup();
    // Go to last image
    await user.click(screen.getByRole("button", { name: /siguiente/i }));
    await user.click(screen.getByRole("button", { name: /siguiente/i }));
    // Now on image 3 (index 2), click next
    await user.click(screen.getByRole("button", { name: /siguiente/i }));

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[0]);
  });

  // --- Accessibility ---

  it("navigation buttons have accessible names", () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    expect(
      screen.getByRole("button", { name: /anterior/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /siguiente/i }),
    ).toBeInTheDocument();
  });

  it("navigation buttons have min touch target of 44px", () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const prevButton = screen.getByRole("button", { name: /anterior/i });
    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    expect(prevButton.className).toContain("min-h-[44px]");
    expect(prevButton.className).toContain("min-w-[44px]");
    expect(nextButton.className).toContain("min-h-[44px]");
    expect(nextButton.className).toContain("min-w-[44px]");
  });

  // --- Dot indicators ---

  it("renders dot indicators for multiple images", () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    // Should have 3 dots (one per image)
    const dots = document.querySelectorAll('[role="tab"]');
    expect(dots.length).toBe(3);
  });

  it("first dot is selected by default", () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const dots = document.querySelectorAll('[role="tab"]');
    expect(dots[0]).toHaveAttribute("aria-selected", "true");
    expect(dots[1]).toHaveAttribute("aria-selected", "false");
  });

  it("clicking a dot navigates to that image", async () => {
    render(<ProductGallery images={sampleImages} productName="Test" />);
    const user = userEvent.setup();
    const dots = document.querySelectorAll('[role="tab"]');
    await user.click(dots[2] as HTMLElement);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", sampleImages[2]);
  });

  // --- Empty images edge case ---

  it("renders nothing when images array is empty", () => {
    const { container } = render(
      <ProductGallery images={[]} productName="Empty" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
