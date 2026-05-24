"use client";

import { useState, useMemo } from "react";
import { useCatalogStore } from "@/lib/store";
import { AVAILABLE_THEMES } from "@/lib/themes/registry";
import { ThemeCard } from "@/components/theme-card";
import { ThemeCategory } from "@/lib/themes/types";

type TabKey = "all" | ThemeCategory;

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "Todos" },
  { key: ThemeCategory.Ecommerce, label: "E-commerce" },
  { key: ThemeCategory.Media, label: "Media" },
  { key: ThemeCategory.Devtools, label: "DevTools" },
  { key: ThemeCategory.Design, label: "Design" },
  { key: ThemeCategory.Fintech, label: "Fintech" },
  { key: ThemeCategory.AI, label: "AI" },
];

export default function AjustesPage() {
  const currentTheme = useCatalogStore((s) => s.currentTheme);
  const setTheme = useCatalogStore((s) => s.setTheme);
  const resetToDefault = useCatalogStore((s) => s.resetToDefault);

  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredThemes = useMemo(() => {
    if (activeTab === "all") return AVAILABLE_THEMES;
    return AVAILABLE_THEMES.filter((t) => t.category === activeTab);
  }, [activeTab]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Temas</h1>
        <button
          type="button"
          onClick={resetToDefault}
          className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline transition-colors"
        >
          Restaurar predeterminado
        </button>
      </div>

      {/* Category tabs */}
      <div
        role="tablist"
        className="mb-6 flex flex-wrap gap-1.5 border-b border-hairline pb-3"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`
                rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${
                  isActive
                    ? "bg-primary text-onPrimary"
                    : "bg-surface2 text-muted hover:bg-surfaceHover"
                }
              `.trim()}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Theme card grid */}
      {filteredThemes.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          No hay temas en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={{
                id: theme.id,
                name: theme.name,
                category: theme.category,
                description: theme.description,
                tokens: theme.tokens,
                fonts: theme.fonts,
              }}
              isActive={currentTheme === theme.id}
              onClick={() => setTheme(theme.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
