import { create } from "zustand";
import { mockCategoryService } from "@/lib/services/mock/mockCategoryService";
import type { CategoryFormInput } from "@/lib/schemas";
import type { Category } from "@/lib/services/interfaces";

interface AdminCategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormInput) => Promise<Category>;
  updateCategory: (
    id: string,
    data: Partial<CategoryFormInput>,
  ) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useAdminCategoryStore = create<AdminCategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await mockCategoryService.list();
      set({ categories, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createCategory: async (data: CategoryFormInput) => {
    set({ loading: true, error: null });
    try {
      const created = await mockCategoryService.create(data);
      const categories = await mockCategoryService.list();
      set({ categories, loading: false });
      return created;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  updateCategory: async (id: string, data: Partial<CategoryFormInput>) => {
    set({ loading: true, error: null });
    try {
      const updated = await mockCategoryService.update(id, data);
      const categories = await mockCategoryService.list();
      set({ categories, loading: false });
      return updated;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await mockCategoryService.delete(id);
      const categories = await mockCategoryService.list();
      set({ categories, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));
