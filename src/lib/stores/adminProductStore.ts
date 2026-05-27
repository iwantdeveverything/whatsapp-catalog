import { create } from "zustand";
import { mockProductService } from "@/lib/services/mock/mockProductService";
import type { Product, ProductFormInput } from "@/lib/schemas";
import type { ProductFilters } from "@/lib/services/interfaces";

interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (data: ProductFormInput) => Promise<Product>;
  updateProduct: (
    id: string,
    data: Partial<ProductFormInput>,
  ) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useAdminProductStore = create<AdminProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (filters?: ProductFilters) => {
    set({ loading: true, error: null });
    try {
      const result = await mockProductService.list({
        includeInactive: true,
        ...filters,
      });
      set({ products: result.products, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createProduct: async (data: ProductFormInput) => {
    set({ loading: true, error: null });
    try {
      const created = await mockProductService.create(data);
      // Re-fetch to sync the list
      const result = await mockProductService.list({ includeInactive: true });
      set({ products: result.products, loading: false });
      return created;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  updateProduct: async (id: string, data: Partial<ProductFormInput>) => {
    set({ loading: true, error: null });
    try {
      const updated = await mockProductService.update(id, data);
      const result = await mockProductService.list({ includeInactive: true });
      set({ products: result.products, loading: false });
      return updated;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await mockProductService.delete(id);
      const result = await mockProductService.list({ includeInactive: true });
      set({ products: result.products, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));
