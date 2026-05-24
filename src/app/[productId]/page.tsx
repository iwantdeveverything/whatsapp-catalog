import type { Metadata } from "next";
import Image from "next/image";
import { getProductById, getAllProducts } from "@/lib/data/catalog";
import { generateProductJsonLd } from "@/lib/jsonld";
import { WhatsAppCta } from "@/components/whatsapp-cta";

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
      type: "product",
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
        <h1 className="text-2xl font-bold text-gray-900">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-gray-500">
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
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:text-gray-700">
          Catálogo
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Gallery */}
        <div className="w-full md:w-3/5 space-y-4">
          {product.images.map((img, i) => (
            <div
              key={img}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <Image
                src={img}
                alt={i === 0 ? product.name : `${product.name} - imagen ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-2/5 space-y-6">
          <div>
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
          </div>

          <p className="text-2xl font-bold text-green-700">{priceStr}</p>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-4 border-t border-gray-200">
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
