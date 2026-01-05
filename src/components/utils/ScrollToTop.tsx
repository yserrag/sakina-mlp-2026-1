import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 1. Disable browser's auto-restore behavior
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. The "Double Tap" Fix
    
    // First: Instant jump (React Render Phase)
    window.scrollTo(0, 0);

    // Second: Delayed enforcement (Browser Paint Phase)
    // This beats the browser's attempt to restore the old position
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);

    return () => clearTimeout(timeout);
    
  }, [pathname]);

  return null;
};