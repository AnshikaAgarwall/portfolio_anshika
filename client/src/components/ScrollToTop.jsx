// Resets the scroll position to the top on every route change.
// Links to an in-page anchor (#section) are left alone so they still work.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // "instant" overrides the global smooth-scroll so the jump isn't animated.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
