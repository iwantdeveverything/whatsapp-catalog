"use client";

import { useEffect, useRef } from "react";
import { useCatalogStore } from "@/lib/store";
import { getThemeById } from "@/lib/themes/registry";

/** Themes recognized by the app — used to validate DOM data-theme values. */
const VALID_THEMES = new Set([
  "shopify", "nike", "airbnb", "starbucks", "apple", "spotify",
  "tesla", "vercel", "linear", "supabase", "figma", "notion",
  "stripe", "claude", "mistral",
]);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useCatalogStore((s) => s.currentTheme);
  const setTheme = useCatalogStore((s) => s.setTheme);
  const synced = useRef(false);

  // One-time sync: if SSR set data-theme and it differs from the store, honor SSR
  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const domTheme = document.documentElement.dataset.theme;
    if (domTheme && VALID_THEMES.has(domTheme) && domTheme !== currentTheme) {
      // Update the store to match SSR without triggering cookie side-effect
      useCatalogStore.setState({ currentTheme: domTheme });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply theme whenever it changes
  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;

    // Sync <meta name="theme-color"> for PWA/mobile browser chrome
    const themeDef = getThemeById(currentTheme);
    if (themeDef) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = themeDef.tokens.canvas;
    }
  }, [currentTheme]);

  return <>{children}</>;
}
