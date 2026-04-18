import { useEffect } from "react";

const BASE = "Corridor Map";

/**
 * Set the document title. Pass `undefined` to just use the base title, or a
 * string for a page-specific title that gets appended after `BASE`.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
