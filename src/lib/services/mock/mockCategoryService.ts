import type { CategoryFormInput } from "@/lib/schemas";
import { CategoryFormSchema } from "@/lib/schemas";
import { products as seedProducts } from "@/lib/data/products";
import type {
  ICategoryService,
  Category,
} from "@/lib/services/interfaces";

export type { ICategoryService };
export type { Category };

// ── Slug helper ──────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Seed data from existing products ─────────────────────

function buildSeedCategories(): Category[] {
  const countMap = new Map<string, number>();
  const nameMap = new Map<string, string>();

  for (const p of seedProducts) {
    const key = p.category.toLowerCase();
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
    nameMap.set(key, p.category); // preserve original casing
  }

  return Array.from(nameMap.entries()).map(([key, name]) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
    productCount: countMap.get(key) ?? 0,
  }));
}

// ── In-memory store ──────────────────────────────────────

let categories: Category[] = buildSeedCategories();

// ── ID generation ────────────────────────────────────────

function generateId(slug: string): string {
  const existingIds = new Set(categories.map((c) => c.id));
  if (!existingIds.has(slug)) return slug;

  let counter = 1;
  let candidate = `${slug}-${counter}`;
  while (existingIds.has(candidate)) {
    counter++;
    candidate = `${slug}-${counter}`;
  }
  return candidate;
}

// ── Service implementation ───────────────────────────────

export const mockCategoryService: ICategoryService = {
  async list(): Promise<Category[]> {
    return [...categories];
  },

  async getById(id: string): Promise<Category | null> {
    return categories.find((c) => c.id === id) ?? null;
  },

  async create(data: CategoryFormInput): Promise<Category> {
    CategoryFormSchema.parse(data);

    const slug = slugify(data.name);
    const id = generateId(slug);

    const category: Category = {
      id,
      name: data.name,
      slug,
      description: data.description,
      productCount: 0,
    };

    categories.push(category);
    return { ...category };
  },

  async update(
    id: string,
    data: Partial<CategoryFormInput>,
  ): Promise<Category> {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Category not found: ${id}`);

    const existing = categories[index];
    const newName = data.name ?? existing.name;
    const newSlug = data.name ? slugify(data.name) : existing.slug;

    const updated: Category = {
      ...existing,
      name: newName,
      slug: newSlug,
      ...(data.description !== undefined && { description: data.description }),
    };

    categories[index] = updated;
    return { ...updated };
  },

  async delete(id: string): Promise<void> {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Category not found: ${id}`);

    if (categories[index].productCount > 0) {
      throw new Error("Cannot delete category with existing products");
    }

    categories.splice(index, 1);
  },
};

// ── Test isolation ───────────────────────────────────────

export function reset(): void {
  categories = buildSeedCategories();
}
