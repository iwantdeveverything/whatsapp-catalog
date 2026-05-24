import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useCatalogStore } from "@/lib/store";

export interface RenderWithThemeOptions extends Omit<RenderOptions, "wrapper"> {
  /** Theme ID to set on document.documentElement and the Zustand store before rendering. Defaults to "shopify". */
  theme?: string;
}

/**
 * Renders a React element wrapped with ThemeProvider and the specified
 * `data-theme` attribute for consistent theme-aware testing.
 *
 * Sets both the DOM attribute AND the Zustand store so that ThemeProvider's
 * effect does not overwrite the attribute on mount.
 */
export function renderWithTheme(
  ui: React.ReactElement,
  options: RenderWithThemeOptions = {},
) {
  const { theme = "shopify", ...renderOptions } = options;

  // Set data-theme on document element so CSS custom properties resolve
  document.documentElement.dataset.theme = theme;
  // Sync Zustand store so ThemeProvider's useEffect doesn't override
  useCatalogStore.setState({ currentTheme: theme });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(ui, { wrapper, ...renderOptions });
}
