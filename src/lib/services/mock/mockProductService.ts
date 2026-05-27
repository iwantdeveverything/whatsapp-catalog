import type { Product, ProductFormInput } from "@/lib/schemas";
import { ProductFormSchema } from "@/lib/schemas";
import { products as seedProducts } from "@/lib/data/products";
import type {
  IProductService,
  ProductFilters,
  ProductListResult,
} from "@/lib/services/interfaces";

// Re-export interface type for convenience
export type { IProductService };

// ── In-memory store ──────────────────────────────────────

function deepCloneProducts(): Product[] {
  return seedProducts.map((p) => ({ ...p }));
}

let products: Product[] = deepCloneProducts();

// ── Helpers ──────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateId(name: string, existing: Product[]): string {
  const base = slugify(name);
  const existingIds = new Set(existing.map((p) => p.id));
  if (!existingIds.has(base)) return base;

  // Append numeric suffix until unique
  let counter = 1;
  let candidate = `${base}-${counter}`;
  while (existingIds.has(candidate)) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}

function toProduct(data: ProductFormInput, id: string): Product {
  const contact: { whatsapp?: string; phone?: string } | undefined =
    data.whatsapp || data.phone
      ? {
          whatsapp: data.whatsapp,
          phone: data.phone,
        }
      : undefined;

  return {
    id,
    name: data.name,
    description: data.description ?? "",
    price: data.price,
    images: data.imageUrl
      ? [data.imageUrl]
      : ["https://placehold.co/800x800/cccccc/333333?text=Product"],
    category: data.category,
    contact,
    isActive: data.isActive ?? true,
  };
}

function priceSortValue(p: Product): number {
  return typeof p.price === "number" ? p.price : Infinity;
}

// ── Service implementation ───────────────────────────────

export const mockProductService: IProductService = {
  async list(filters?: ProductFilters): Promise<ProductListResult> {
    let filtered = [...products];

    // Filter by active status
    if (!filters?.includeInactive) {
      filtered = filtered.filter((p) => p.isActive);
    }

    // Search by name (case-insensitive)
    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Filter by category
    if (filters?.category && filters.category.trim() !== "") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase(),
      );
    }

    // Sort
    if (filters?.sortBy) {
      const order = filters.sortOrder === "desc" ? -1 : 1;
      filtered.sort((a, b) => {
        if (filters.sortBy === "name") {
          return order * a.name.localeCompare(b.name);
        }
        if (filters.sortBy === "price") {
          const aVal = priceSortValue(a);
          const bVal = priceSortValue(b);
          return order * (aVal - bVal);
        }
        return 0;
      });
    }

    return { products: filtered, total: filtered.length };
  },

  async getById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) ?? null;
  },

  async create(data: ProductFormInput): Promise<Product> {
    // Validate with Zod — throws if invalid
    ProductFormSchema.parse(data);

    const id = generateId(data.name, products);
    const product = toProduct(data, id);
    products.push(product);
    return { ...product };
  },

  async update(
    id: string,
    data: Partial<ProductFormInput>,
  ): Promise<Product> {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product not found: ${id}`);

    const existing = products[index];
    const updated: Product = {
      ...existing,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.imageUrl !== undefined && { images: [data.imageUrl] }),
    };

    // Handle contact fields
    if (data.whatsapp !== undefined || data.phone !== undefined) {
      updated.contact = {
        ...(existing.contact ?? {}),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
        ...(data.phone !== undefined && { phone: data.phone }),
      };
    }

    products[index] = updated;
    return { ...updated };
  },

  async delete(id: string): Promise<void> {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product not found: ${id}`);
    products[index] = { ...products[index], isActive: false };
  },
};

// ── Test isolation ───────────────────────────────────────

export function reset(): void {
  products = deepCloneProducts();
}
