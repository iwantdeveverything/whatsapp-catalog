import type { Product } from "@/lib/schemas";

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
  includeInactive?: boolean;
}

export interface ProductListResult {
  products: Product[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export interface AuthResult {
  token: string;
  user: {
    email: string;
  };
}
