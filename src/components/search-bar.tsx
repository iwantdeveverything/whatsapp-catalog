"use client";

import { useCatalogStore } from "@/lib/store";

export function SearchBar() {
  const searchQuery = useCatalogStore((s) => s.searchQuery);
  const setSearchQuery = useCatalogStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <label htmlFor="catalog-search" className="sr-only">
        Buscar productos
      </label>
      <input
        id="catalog-search"
        type="search"
        role="searchbox"
        aria-label="Buscar productos"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 pl-10 text-sm text-ink placeholder-muted focus:border-hairline focus:outline-none focus:ring-1 focus:ring-hairline min-h-[44px]"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
