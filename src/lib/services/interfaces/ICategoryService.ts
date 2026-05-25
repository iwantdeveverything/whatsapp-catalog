import type { CategoryFormInput } from "@/lib/schemas";
import type { Category } from "./types";

export interface ICategoryService {
  list(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(data: CategoryFormInput): Promise<Category>;
  update(
    id: string,
    data: Partial<CategoryFormInput>,
  ): Promise<Category>;
  delete(id: string): Promise<void>;
}
