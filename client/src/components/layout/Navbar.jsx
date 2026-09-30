// Sticky 3-column header from the reference:
//   left   = About / Work / Experience / Skills (active route is underlined)
//   center = ANSHIKA AGARWAL wordmark (links home)
//   right  = Resume (underline link) + "Hire me" (black button)
// Below 768px it collapses to wordmark + hamburger, which opens <MobileMenu />.
// The bottom border only appears once the page has been scrolled.
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../Button.jsx';
import SmartLink from '../SmartLink.jsx';
import MobileMenu from './MobileMenu.jsx';
import useScrolled from '../../hooks/useScrolled.js';
import { cn } from '../../utils/cn.js';
import { SITE, PRIMARY_NAV, RESUME, HIRE_CTA, UI_TEXT } from '../../data/siteConfig.js';

const MOBILE_MENU_ID = 'mobile-menu';
const DESKTOP_QUERY = '(min-width: 768px)'; // matches Tailwind's `md` breakpoint

// 44px-tall hit area; the underline lives on the inner span so it hugs the text.
const NAV_LINK =
  'group inline-flex min-h-11 items-center text-label font-medium uppercase tracking-label text-ink lg:tracking-wide2';
const underline = (isActive) =>
  cn(
    'border-b pb-1 transition-colors duration-300',
    isActive ? 'border-ink' : 'border-transparent group-hover:border-rule',
  );

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const menuButtonRef = useRef(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Also close it if the window is resized up to desktop width.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-light transition-colors duration-300',
        scrolled ? 'border-rule' : 'border-transparent',
      )}
    >
      <div className="mx-auto grid h-16 max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-4 px-6 md:h-20 md:grid-cols-[1fr_auto_1fr] md:px-10">
        {/* Left: primary links (desktop only) */}
        <nav aria-label={UI_TEXT.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-8">
            {PRIMARY_NAV.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={NAV_LINK}>
                  {({ isActive }) => <span className={underline(isActive)}>{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Center: wordmark (left-aligned on mobile) */}
        <Link
          to="/"
          aria-label={UI_TEXT.homeLink}
          className="inline-flex min-h-11 items-center justify-self-start whitespace-nowrap font-heading text-base font-bold uppercase tracking-label md:justify-self-center lg:text-xl"
        >
          {SITE.wordmark}
        </Link>

        {/* Right: resume + hire me (desktop only) */}
        <div className="hidden items-center justify-self-end gap-6 md:flex lg:gap-8">
          <Button as={SmartLink} link={RESUME} variant="link" />
          <Button as={Link} to={HIRE_CTA.path} size="sm">
            {HIRE_CTA.label}
          </Button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={UI_TEXT.openMenu}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 justify-self-end md:hidden"
        >
          <span aria-hidden="true" className="block h-px w-6 bg-ink" />
          <span aria-hidden="true" className="block h-px w-6 bg-ink" />
          <span aria-hidden="true" className="block h-px w-6 bg-ink" />
        </button>
      </div>

      <MobileMenu id={MOBILE_MENU_ID} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
