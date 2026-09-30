// Full-screen black overlay menu for small screens. Lists every page in large
// white type, plus the Hire me button and social links.
// While open it locks body scroll, traps keyboard focus, and closes on
// Escape, on the close button, or on any link click. The Navbar also closes
// it on route change. Rendered in a portal on <body> so no parent's stacking
// or overflow can clip it.
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../Button.jsx';
import SmartLink from '../SmartLink.jsx';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import useLockBodyScroll from '../../hooks/useLockBodyScroll.js';
import { cn } from '../../utils/cn.js';
import { EASE_EDITORIAL } from '../../utils/motion.js';
import { SITE, ALL_PAGES, HIRE_CTA, ANNOUNCEMENT_LINKS, UI_TEXT } from '../../data/siteConfig.js';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EDITORIAL } },
};

export default function MobileMenu({ id, open, onClose }) {
  return createPortal(
    <AnimatePresence>{open && <MenuPanel id={id} onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}

// Separate component so the hooks only run while the menu is mounted.
function MenuPanel({ id, onClose }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useLockBodyScroll();
  useFocusTrap(panelRef, { onEscape: onClose, initialFocusRef: closeButtonRef });

  return (
    <motion.div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={UI_TEXT.menuTitle}
      className="surface-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
    >
      {/* Top row mirrors the navbar: wordmark left, close right */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        <Link
          to="/"
          onClick={onClose}
          aria-label={UI_TEXT.homeLink}
          className="font-heading text-base font-bold uppercase tracking-label"
        >
          {SITE.wordmark}
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={UI_TEXT.closeMenu}
          className="-mr-2 flex h-11 items-center gap-3 px-2 text-label font-medium uppercase tracking-wide2"
        >
          <span aria-hidden="true">{UI_TEXT.close}</span>
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 block h-px w-4 rotate-45 bg-paper" />
            <span className="absolute left-0 top-1/2 block h-px w-4 -rotate-45 bg-paper" />
          </span>
        </button>
      </div>

      <span aria-hidden="true" className="mx-6 block h-px bg-paper/20" />

      <nav aria-label={UI_TEXT.mobileNav} className="flex-1 px-6 py-10">
        <motion.ol className="flex flex-col gap-3" variants={listVariants} initial="hidden" animate="visible">
          {ALL_PAGES.map((page, i) => (
            <motion.li key={page.path} variants={itemVariants} className="flex items-baseline gap-4">
              <span aria-hidden="true" className="w-6 text-micro tracking-label text-paper/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <NavLink
                to={page.path}
                end={page.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'font-heading text-4xl font-semibold uppercase leading-tight tracking-display transition-opacity duration-200 hover:opacity-60 sm:text-5xl',
                    isActive && 'underline decoration-1 underline-offset-8',
                  )
                }
              >
                {page.label}
              </NavLink>
            </motion.li>
          ))}
        </motion.ol>
      </nav>

      <div className="shrink-0 border-t border-paper/20 px-6 pb-10 pt-8">
        <Button as={Link} to={HIRE_CTA.path} onClick={onClose} variant="inverse" className="w-full">
          {HIRE_CTA.label}
        </Button>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {ANNOUNCEMENT_LINKS.map((link) => (
            <li key={link.label}>
              <SmartLink
                link={link}
                className="border-b border-paper/40 pb-1 text-label font-medium uppercase tracking-wide2 transition-colors hover:border-paper"
              />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
