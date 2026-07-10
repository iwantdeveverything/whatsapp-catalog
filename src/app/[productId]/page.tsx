import type { Metadata } from "next";
import Link from "next/link";
import { getProductById, getAllProducts } from "@/lib/data/catalog";
import { generateProductJsonLd } from "@/lib/jsonld";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { ProductGallery } from "@/components/product-gallery";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    productId: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const description = product.description;
  const imageUrl = product.images[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://catalog.com";
  const url = `${baseUrl}/${product.id}`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website" as const,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  } as Metadata;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-muted">
          El producto que buscás no existe o fue desactivado.
        </p>
      </main>
    );
  }

  const priceStr =
    product.price === "Consultar"
      ? "Consultar"
      : `$${product.price.toLocaleString("es-AR")}`;

  const jsonLd = generateProductJsonLd(product);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 luxury:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Gallery */}
        <div className="w-full md:w-3/5">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-2/5 space-y-6">
          <div>
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-surface2 text-muted mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-ink luxury:font-serif luxury:text-4xl">{product.name}</h1>
          </div>

          <p className="text-2xl font-bold text-accent luxury:font-light">{priceStr}</p>

          <p className="text-muted leading-relaxed">{product.description}</p>

          <div className="pt-4 border-t border-hairline">
            <WhatsAppCta product={product} />
          </div>
        </div>
      </div>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
