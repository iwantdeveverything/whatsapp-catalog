import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data/catalog";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://catalog.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...productEntries,
    ...categoryEntries,
  ];
}
