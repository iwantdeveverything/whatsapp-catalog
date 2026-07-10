"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCatalogStore } from "@/lib/store";
import { getThemeById } from "@/lib/themes/registry";

/** Themes recognized by the app — used to validate DOM data-theme values. */
const VALID_THEMES = new Set([
  "shopify", "nike", "airbnb", "starbucks", "apple", "spotify",
  "tesla", "vercel", "linear", "supabase", "figma", "notion",
  "stripe", "claude", "mistral", "luxury",
]);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useCatalogStore((s) => s.currentTheme);
  const pathname = usePathname();
  const synced = useRef(false);

  // Public catalog is luxury-only: the theme is forced at SSR via the
  // `x-theme` header -> <html data-theme>. On public routes the client store
  // must NOT overwrite that SSR-forced value. Only admin routes are themable.
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  // A real public route: a resolved pathname that is not an admin path. When
  // pathname is null (router not ready) we assert nothing.
  const isPublicRoute = !!pathname && !isAdmin;

  // One-time sync: if SSR set data-theme and it differs from the store, honor SSR
  useEffect(() => {
    if (!isAdmin) return;
    if (synced.current) return;
    synced.current = true;

    const domTheme = document.documentElement.dataset.theme;
    if (domTheme && VALID_THEMES.has(domTheme) && domTheme !== currentTheme) {
      // Update the store to match SSR without triggering cookie side-effect
      useCatalogStore.setState({ currentTheme: domTheme });
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply theme whenever it changes — admin routes only. On public routes the
  // catalog is luxury-only: actively assert luxury so a stale admin theme left
  // on the DOM by a prior soft-nav can't leak into the public catalog.
  useEffect(() => {
    if (!isAdmin) {
      if (isPublicRoute) {
        document.documentElement.dataset.theme = "luxury";
      }
      return;
    }

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
  }, [currentTheme, isAdmin, isPublicRoute]);

  return <>{children}</>;
}
