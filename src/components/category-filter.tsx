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
            ? "bg-primary text-onPrimary"
            : "bg-surface2 text-muted hover:bg-surfaceHover"
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
              ? "bg-primary text-onPrimary"
              : "bg-surface2 text-muted hover:bg-surfaceHover"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
