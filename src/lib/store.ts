import { create } from "zustand";

interface CatalogState {
  searchQuery: string;
  activeCategory: string | null;
  isMobileMenuOpen: boolean;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  toggleMobileMenu: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  searchQuery: "",
  activeCategory: null,
  isMobileMenuOpen: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
