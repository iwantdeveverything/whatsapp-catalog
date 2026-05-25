import type { ProductFormInput } from "@/lib/schemas";
import type { Product } from "@/lib/schemas";
import type { ProductFilters, ProductListResult } from "./types";

export interface IProductService {
  list(filters?: ProductFilters): Promise<ProductListResult>;
  getById(id: string): Promise<Product | null>;
  create(data: ProductFormInput): Promise<Product>;
  update(
    id: string,
    data: Partial<ProductFormInput>,
  ): Promise<Product>;
  delete(id: string): Promise<void>;
}
