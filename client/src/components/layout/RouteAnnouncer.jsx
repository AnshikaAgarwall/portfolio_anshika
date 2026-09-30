// Tells screen-reader users the page changed after client-side navigation:
// 1. waits for the new page's <h1> to render (lazy chunk + data may take a
//    moment; gives up after 3s and uses <main>),
// 2. moves focus to it (no scroll jump, no focus ring),
// 3. announces "Navigated to <page name>" in a visually hidden live region.
// Skips the first page load and query-only changes (e.g. filter tabs).
// document.title itself is updated by <Seo /> on every page.
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGES, UI_TEXT } from '../../data/siteConfig.js';
import { MAIN_CONTENT_ID } from '../../utils/constants.js';

const TIMEOUT_MS = 3000;

// Page name: from the menu labels, else the heading's accessible text.
function pageName(pathname, h1) {
  const page = PAGES.find((p) => p.path === pathname);
  if (page) return page.label;
  const srOnly = h1?.querySelector('.sr-only');
  return (srOnly?.textContent || h1?.textContent || document.title).trim();
}

export default function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState('');
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const main = document.getElementById(MAIN_CONTENT_ID);
    if (!main) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      clearTimeout(timer);

      const h1 = main.querySelector('h1');
      const target = h1 ?? main;
      if (h1 && !h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      // Clear first so the same text is re-announced on repeat visits.
      setMessage('');
      requestAnimationFrame(() => setMessage(`${UI_TEXT.navigatedTo} ${pageName(pathname, h1)}`));
    };

    const observer = new MutationObserver(() => {
      if (main.querySelector('h1')) finish();
    });
    const timer = setTimeout(finish, TIMEOUT_MS);

    if (main.querySelector('h1')) finish();
    else observer.observe(main, { childList: true, subtree: true });

    return () => {
      done = true;
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
