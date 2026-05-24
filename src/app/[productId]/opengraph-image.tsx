import { ImageResponse } from "next/og";
import { getProductById } from "@/lib/data/catalog";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

interface OgImageProps {
  params: { productId: string };
}

export default async function ogImage({ params }: OgImageProps) {
  const product = getProductById(params.productId);

  if (!product) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Catálogo Digital
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.7,
          }}
        >
          Producto no disponible
        </div>
      </div>,
      { width: 1200, height: 630 },
    );
  }

  const imageUrl = product.images[0];
  const priceStr =
    product.price === "Consultar"
      ? "Consultar"
      : `$${product.price.toLocaleString("es-AR")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#1a1a2e",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Product image (left 60%) */}
      <div
        style={{
          width: "60%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Text overlay (right 40%) */}
      <div
        style={{
          width: "40%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px",
          background: "linear-gradient(to right, rgba(26,26,46,0.5), #1a1a2e)",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#a0a0c0",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {product.category}
        </span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {product.name}
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#4ade80",
          }}
        >
          {priceStr}
        </span>

        {/* Brand watermark */}
        <span
          style={{
            position: "absolute",
            bottom: 32,
            right: 48,
            fontSize: 18,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
          }}
        >
          Catálogo Digital
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
