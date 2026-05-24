"use client";

import { useCatalogStore } from "@/lib/store";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const activeCategory = useCatalogStore((s) => s.activeCategory);
  const setActiveCategory = useCatalogStore((s) => s.setActiveCategory);

  const handleClick = (category: string | null) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrar por categoría"
    >
      <button
        type="button"
        aria-pressed={activeCategory === null}
        onClick={() => handleClick(null)}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors min-h-[44px] min-w-[44px] ${
          activeCategory === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={activeCategory === category}
          onClick={() => handleClick(category)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors min-h-[44px] min-w-[44px] ${
            activeCategory === category
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
