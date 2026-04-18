import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't scroll to top on route change by default. Sub to pathname
 * and reset the scroll position each time we land on a new route.
 * Respects the in-page hash (anchor jumps still work).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
