// Black footer band: page links, contact/social links, a full-width
// wordmark, and a bottom row with copyright and "Back to top".
// (No call-to-action here: every page already ends with its own black CTA.)
import { Link } from 'react-router-dom';
import SmartLink from '../SmartLink.jsx';
import { MAIN_CONTENT_ID } from '../../utils/constants.js';
import { SITE, ALL_PAGES, ANNOUNCEMENT_LINKS, FOOTER } from '../../data/siteConfig.js';

const linkClass =
  'inline-flex min-h-11 items-center text-label font-medium uppercase tracking-wide2 text-paper/70 transition-colors duration-200 hover:text-paper';

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
  // Send keyboard focus back to the top of the content too.
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark bg-ink text-paper">
      <div className="mx-auto max-w-screen-2xl px-6 pb-8 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Page links */}
          <nav aria-label={FOOTER.pagesTitle} className="md:col-span-6">
            <h2 className="label mb-4 text-paper/60">{FOOTER.pagesTitle}</h2>
            <ul className="grid grid-cols-2 gap-x-6 md:grid-cols-3">
              {ALL_PAGES.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className={linkClass}>
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + social */}
          <div className="md:col-span-4 md:col-start-9">
            <h2 className="label mb-4 text-paper/60">{FOOTER.connectTitle}</h2>
            <ul className="flex flex-col">
              {SITE.email && (
                <li>
                  <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all normal-case tracking-label`}>
                    {SITE.email}
                  </a>
                </li>
              )}
              {ANNOUNCEMENT_LINKS.map((link) => (
                <li key={link.label}>
                  <SmartLink link={link} className={linkClass} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, like the hero "GAZU" */}
        <p
          aria-hidden="true"
          className="mt-16 select-none whitespace-nowrap font-heading text-wordmark font-bold uppercase tracking-display md:mt-24"
        >
          {SITE.wordmark}
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-paper/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-micro uppercase tracking-wide2 text-paper/60">{FOOTER.copyright(year)}</p>
          <button type="button" onClick={scrollToTop} className={`${linkClass} self-start sm:self-auto`}>
            {FOOTER.backToTop} <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
