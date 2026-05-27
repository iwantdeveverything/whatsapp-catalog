import { useEffect } from "react";

/**
 * Set `document.title` for client-rendered admin pages.
 * Appends a consistent suffix so browser tabs are identifiable.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} — Admin`;
  }, [title]);
}
