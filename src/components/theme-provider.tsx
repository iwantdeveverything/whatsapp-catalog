"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useCatalogStore((s) => s.currentTheme);

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return <>{children}</>;
}
