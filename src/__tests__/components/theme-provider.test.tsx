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
      <ThemeProvider ssrTheme="shopify">
        <p>content</p>
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("shopify");
  });

  it("updates data-theme when store theme changes (admin)", () => {
    render(
      <ThemeProvider ssrTheme="shopify">
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
      <ThemeProvider ssrTheme="shopify">
        <h1>Settings</h1>
      </ThemeProvider>,
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ThemeProvider ssrTheme="shopify">
        <header>Header</header>
        <main>Main</main>
      </ThemeProvider>,
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("syncs meta theme-color to Shopify canvas color on mount (admin)", () => {
    render(
      <ThemeProvider ssrTheme="shopify">
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
      <ThemeProvider ssrTheme="shopify">
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
      <ThemeProvider ssrTheme="shopify">
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

  it("seeds the store from the ssrTheme prop on first mount when it differs (admin)", () => {
    // SSR resolved "apple" from the admin cookie; the store still holds its
    // default. The provider must seed the store from the SSR-resolved PROP —
    // NOT from the live DOM (which is spoofable / pollutable by soft-navs).
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider ssrTheme="apple">
        <p>content</p>
      </ThemeProvider>,
    );

    // Store synced to the SSR-provided theme
    expect(useCatalogStore.getState().currentTheme).toBe("apple");
    // DOM reflects the store (admin apply-effect)
    expect(document.documentElement.dataset.theme).toBe("apple");
  });

  it("ignores a polluted DOM data-theme and trusts the ssrTheme prop (admin)", () => {
    // A stale/pollutable DOM value must NOT be treated as SSR truth.
    document.documentElement.dataset.theme = "luxury";
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider ssrTheme="vercel">
        <p>content</p>
      </ThemeProvider>,
    );

    // Seeded from the prop, not the polluted DOM
    expect(useCatalogStore.getState().currentTheme).toBe("vercel");
    expect(document.documentElement.dataset.theme).toBe("vercel");
  });

  // ── Public routes: luxury-only, SSR-forced, no store clobber ──

  it("does NOT overwrite the store on public routes", () => {
    mockPathname = "/";
    // SSR forced luxury on the public route
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider ssrTheme="luxury">
        <p>content</p>
      </ThemeProvider>,
    );

    // The public apply-effect asserts luxury on the DOM
    expect(document.documentElement.dataset.theme).toBe("luxury");
    // The store must not be forced to change
    expect(useCatalogStore.getState().currentTheme).toBe("shopify");
  });

  it("asserts luxury on the DOM on public routes even when store changes", () => {
    mockPathname = "/";
    useCatalogStore.setState({ currentTheme: "shopify" });

    render(
      <ThemeProvider ssrTheme="luxury">
        <p>content</p>
      </ThemeProvider>,
    );

    act(() => {
      useCatalogStore.getState().setTheme("figma");
    });

    // Public route: SSR theme stays luxury regardless of store activity
    expect(document.documentElement.dataset.theme).toBe("luxury");
  });

  it("resets the meta theme-color to the luxury canvas on public routes", () => {
    mockPathname = "/";

    render(
      <ThemeProvider ssrTheme="luxury">
        <p>content</p>
      </ThemeProvider>,
    );

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    expect(meta).not.toBeNull();
    // Luxury espresso-black canvas — resets mobile browser chrome on
    // admin -> public soft-nav.
    expect(meta!.content).toBe("#0F0D0C");
  });

  it("resets a stale admin data-theme to luxury on soft-nav to a public route", () => {
    // Simulate admin having written a non-luxury theme to the DOM, then a
    // client-side soft navigation to a public route.
    mockPathname = "/admin/products";
    useCatalogStore.setState({ currentTheme: "figma" });

    const { rerender } = render(
      <ThemeProvider ssrTheme="figma">
        <p>content</p>
      </ThemeProvider>,
    );

    // Admin drives "figma" onto the DOM from the store
    expect(document.documentElement.dataset.theme).toBe("figma");

    // Soft-nav to a public route: ThemeProvider must assert luxury
    act(() => {
      mockPathname = "/";
    });
    rerender(
      <ThemeProvider ssrTheme="figma">
        <p>content</p>
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("luxury");
  });

  it("does NOT clobber the operator's admin theme on a public -> admin soft-nav (reverse leak)", () => {
    // Reproduces HIGH #2: ThemeProvider mounts once in the root layout and
    // survives client navigation. Mount first on a PUBLIC route where the
    // store already holds the operator's persisted admin theme ("vercel").
    mockPathname = "/";
    useCatalogStore.setState({ currentTheme: "vercel" });

    const { rerender } = render(
      // ssrTheme reflects the admin cookie value; on the public mount it must
      // not be seeded into the store.
      <ThemeProvider ssrTheme="vercel">
        <p>content</p>
      </ThemeProvider>,
    );

    // Public apply-effect writes luxury onto the DOM.
    expect(document.documentElement.dataset.theme).toBe("luxury");
    // Store is untouched on the public route.
    expect(useCatalogStore.getState().currentTheme).toBe("vercel");

    // Soft-nav public -> admin: NO SSR reseed happens. The stale DOM "luxury"
    // must NOT be copied into the store.
    act(() => {
      mockPathname = "/admin/products";
    });
    rerender(
      <ThemeProvider ssrTheme="vercel">
        <p>content</p>
      </ThemeProvider>,
    );

    // The operator's persisted theme survives — no reverse leak.
    expect(useCatalogStore.getState().currentTheme).toBe("vercel");
    expect(document.documentElement.dataset.theme).toBe("vercel");
  });
});
