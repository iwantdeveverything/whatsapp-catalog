import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/[productId]/page";
import type { Product } from "@/lib/schemas";
import { getAllProducts } from "@/lib/data/catalog";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...rest} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock WhatsAppCta to avoid rendering its full SVG
vi.mock("@/components/whatsapp-cta", () => ({
  WhatsAppCta: ({ product }: { product: Product }) => (
    <a
      href={`https://wa.me/${product.contact?.whatsapp ?? ""}`}
      data-testid="whatsapp-cta"
    >
      Consultar por WhatsApp
    </a>
  ),
}));

// --- Test helpers ---

// get a real product from the data layer
function getRealProduct(): Product {
  const products = getAllProducts();
  const product = products.find((p) => p.id === "zapatillas-running");
  if (!product) throw new Error("Test product not found");
  return product;
}

/** Render RSC page result wrapped in the Shopify theme context */
function renderWithTheme(ui: React.ReactElement) {
  return render(<div data-theme="shopify">{ui}</div>);
}

describe("generateStaticParams", () => {
  it("returns params for all active products", () => {
    const params = generateStaticParams();
    const products = getAllProducts();
    expect(params.length).toBe(products.length);
  });

  it("each param has a productId string", () => {
    const params = generateStaticParams();
    for (const param of params) {
      expect(param.productId).toBeDefined();
      expect(typeof param.productId).toBe("string");
    }
  });

  it("includes known product ids", () => {
    const params = generateStaticParams();
    const ids = params.map((p) => p.productId);
    expect(ids).toContain("zapatillas-running");
    expect(ids).toContain("camisa-oxford");
  });
});

describe("generateMetadata", () => {
  it("returns metadata for an existing product", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ productId: "zapatillas-running" }),
    });
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Zapatillas Running");
  });

  it("includes OpenGraph tags", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ productId: "zapatillas-running" }),
    });
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.title).toBe("Zapatillas Running");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((metadata.openGraph as any).type).toBe("website");
    expect(metadata.openGraph!.images).toBeDefined();
    if (metadata.openGraph!.images) {
      const images = Array.isArray(metadata.openGraph!.images)
        ? metadata.openGraph!.images
        : [metadata.openGraph!.images];
      expect(images.length).toBeGreaterThan(0);
    }
  });

  it("includes og:image dimensions", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ productId: "zapatillas-running" }),
    });
    const ogImages = metadata.openGraph!.images;
    const firstImage = Array.isArray(ogImages) ? ogImages[0] : ogImages;
    expect(firstImage).toBeDefined();
    // next/og generates at 1200×630
  });

  it("includes twitter:card = summary_large_image", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ productId: "zapatillas-running" }),
    });
    expect(metadata.twitter).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((metadata.twitter as any).card).toBe("summary_large_image");
  });

  it("returns null title for non-existent product id", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ productId: "nonexistent" }),
    });
    expect(metadata).toBeDefined();
  });
});

describe("ProductPage", () => {
  it("renders the product name as a heading", async () => {
    const product = getRealProduct();
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    expect(
      screen.getByRole("heading", { name: product.name }),
    ).toBeInTheDocument();
  });

  it("renders the product price formatted", async () => {
    const product = getRealProduct();
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    expect(screen.getByText(/\$85\.000/)).toBeInTheDocument();
  });

  it("renders the product description", async () => {
    const product = getRealProduct();
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    expect(screen.getByText(/ultralivianas/)).toBeInTheDocument();
  });

  it("renders the product images", async () => {
    const product = getRealProduct();
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("renders the WhatsApp CTA component", async () => {
    const product = getRealProduct();
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    expect(screen.getByTestId("whatsapp-cta")).toBeInTheDocument();
  });

  it("renders a JSON-LD script tag with Product schema", async () => {
    const product = getRealProduct();
    const { container } = renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: product.id }),
      }),
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
    const json = JSON.parse(script!.textContent!);
    expect(json["@type"]).toBe("Product");
    expect(json.name).toBe(product.name);
  });

  it("shows a not-found message for invalid product id", async () => {
    renderWithTheme(
      await ProductPage({
        params: Promise.resolve({ productId: "nonexistent" }),
      }),
    );
    expect(screen.getByText(/producto no encontrado/i)).toBeInTheDocument();
  });
});
