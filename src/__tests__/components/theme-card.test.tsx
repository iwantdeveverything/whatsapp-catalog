import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// We'll mock ThemeCard after it exists; for RED, the import will fail
describe("ThemeCard", () => {
  it("renders the theme name", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "nike",
          name: "Nike",
          category: "ecommerce",
          description: "Bold sport style",
          tokens: {
            canvas: "#111111",
            ink: "#FFFFFF",
            surface1: "#1A1A1A",
            surface2: "#222222",
            surface3: "#333333",
            hairline: "#333333",
            muted: "#999999",
            primary: "#FFFFFF",
            onPrimary: "#111111",
            accent: "#FF5000",
          },
          fonts: { family: "Futura", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    expect(screen.getByText("Nike")).toBeInTheDocument();
  });

  it("renders the category badge", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "apple",
          name: "Apple",
          category: "media",
          description: "Premium minimalism",
          tokens: {
            canvas: "#F5F5F7",
            ink: "#1D1D1F",
            surface1: "#FFFFFF",
            surface2: "#E8E8ED",
            surface3: "#D2D2D7",
            hairline: "#D2D2D7",
            muted: "#86868B",
            primary: "#0071E3",
            onPrimary: "#FFFFFF",
            accent: "#0071E3",
          },
          fonts: { family: "SF Pro", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    expect(screen.getByText("Media")).toBeInTheDocument();
  });

  it("renders 5 color swatch dots", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "spotify",
          name: "Spotify",
          category: "media",
          description: "Music platform",
          tokens: {
            canvas: "#191414",
            ink: "#FFFFFF",
            surface1: "#282828",
            surface2: "#333333",
            surface3: "#404040",
            hairline: "#404040",
            muted: "#B3B3B3",
            primary: "#1DB954",
            onPrimary: "#FFFFFF",
            accent: "#1DB954",
          },
          fonts: { family: "Circular", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    const swatches = document.querySelectorAll('[data-testid="color-swatch"]');
    expect(swatches.length).toBe(5);
  });

  it("applies active styles when isActive is true", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "figma",
          name: "Figma",
          category: "design",
          description: "Design tool",
          tokens: {
            canvas: "#FFFFFF",
            ink: "#000000",
            surface1: "#F5F5F5",
            surface2: "#E6E6E6",
            surface3: "#D9D9D9",
            hairline: "#E6E6E6",
            muted: "#888888",
            primary: "#0D0D0D",
            onPrimary: "#FFFFFF",
            accent: "#9747FF",
          },
          fonts: { family: "Inter", fallback: "sans-serif" },
        }}
        isActive={true}
        onClick={() => {}}
      />,
    );
    // Active card should have a visual indicator
    const card = screen.getByRole("button");
    expect(card.dataset.active).toBe("true");
  });

  it("does not apply active styles when isActive is false", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "figma",
          name: "Figma",
          category: "design",
          description: "Design tool",
          tokens: {
            canvas: "#FFFFFF",
            ink: "#000000",
            surface1: "#F5F5F5",
            surface2: "#E6E6E6",
            surface3: "#D9D9D9",
            hairline: "#E6E6E6",
            muted: "#888888",
            primary: "#0D0D0D",
            onPrimary: "#FFFFFF",
            accent: "#9747FF",
          },
          fonts: { family: "Inter", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    const card = screen.getByRole("button");
    expect(card.dataset.active).toBe("false");
  });

  it("calls onClick when clicked", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    const handleClick = vi.fn();
    render(
      <ThemeCard
        theme={{
          id: "linear",
          name: "Linear",
          category: "devtools",
          description: "Issue tracker",
          tokens: {
            canvas: "#FFFFFF",
            ink: "#1A1A1A",
            surface1: "#F7F7F8",
            surface2: "#EDEDEF",
            surface3: "#E0E0E2",
            hairline: "#E0E0E2",
            muted: "#6E6E77",
            primary: "#5E6AD2",
            onPrimary: "#FFFFFF",
            accent: "#5E6AD2",
          },
          fonts: { family: "Inter", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("displays the font family name", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "stripe",
          name: "Stripe",
          category: "fintech",
          description: "Payments platform",
          tokens: {
            canvas: "#FFFFFF",
            ink: "#0A2540",
            surface1: "#F6F9FC",
            surface2: "#E6EBF1",
            surface3: "#D4D9E2",
            hairline: "#D4D9E2",
            muted: "#697386",
            primary: "#635BFF",
            onPrimary: "#FFFFFF",
            accent: "#635BFF",
          },
          fonts: { family: "Inter", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    expect(screen.getByText(/Inter/)).toBeInTheDocument();
  });

  it("renders color swatches with correct background colors", async () => {
    const { ThemeCard } = await import("@/components/theme-card");
    render(
      <ThemeCard
        theme={{
          id: "claude",
          name: "Claude",
          category: "ai",
          description: "AI assistant",
          tokens: {
            canvas: "#FAFAF9",
            ink: "#1C1917",
            surface1: "#F5F5F4",
            surface2: "#E7E5E4",
            surface3: "#D6D3D1",
            hairline: "#D6D3D1",
            muted: "#78716C",
            primary: "#D97706",
            onPrimary: "#FFFFFF",
            accent: "#D97706",
          },
          fonts: { family: "Inter", fallback: "sans-serif" },
        }}
        isActive={false}
        onClick={() => {}}
      />,
    );
    const swatches = document.querySelectorAll<HTMLElement>(
      '[data-testid="color-swatch"]',
    );
    // First swatch = canvas, second = ink, third = primary, fourth = accent, fifth = surface2
    expect(swatches[0].style.backgroundColor).toBe("rgb(250, 250, 249)");
    expect(swatches[1].style.backgroundColor).toBe("rgb(28, 25, 23)");
    expect(swatches[2].style.backgroundColor).toBe("rgb(217, 119, 6)");
    expect(swatches[3].style.backgroundColor).toBe("rgb(217, 119, 6)");
    expect(swatches[4].style.backgroundColor).toBe("rgb(231, 229, 228)");
  });
});
