import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME } from "@/lib/themes/types";

interface CatalogState {
  searchQuery: string;
  activeCategory: string | null;
  isMobileMenuOpen: boolean;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  toggleMobileMenu: () => void;
}

interface ThemeState {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  resetToDefault: () => void;
}

type AppState = CatalogState & ThemeState;

export const useCatalogStore = create<AppState>()(
  persist(
    (set) => ({
      // ── Catalog slice ──
      searchQuery: "",
      activeCategory: null,
      isMobileMenuOpen: false,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      // ── Theme slice ──
      currentTheme: DEFAULT_THEME,
      setTheme: (themeId) => {
        set({ currentTheme: themeId });
        // Side-effect: sync theme cookie for SSR middleware
        if (typeof document !== "undefined") {
          document.cookie = `theme=${themeId}; path=/; max-age=31536000; SameSite=Lax`;
        }
      },
      resetToDefault: () => {
        set({ currentTheme: DEFAULT_THEME });
        if (typeof document !== "undefined") {
          document.cookie = `theme=${DEFAULT_THEME}; path=/; max-age=31536000; SameSite=Lax`;
        }
      },
    }),
    {
      name: "whatsapp-catalog-store",
      partialize: (state) => ({
        currentTheme: state.currentTheme,
      }),
    },
  ),
);
