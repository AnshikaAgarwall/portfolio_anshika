// Every piece of text and every link used by the layout shell
// (AnnouncementBar, Navbar, MobileMenu, Footer). Edit here, not in components.
// Links with `external: true` open in a new tab; the rest are router paths.
// Contact details (email, phone, socials) come from the profile in
// mockData.js, so there is exactly one place to change them.
import { profile } from './mockData.js';
import { isFilled } from '../utils/content.js';

export const SITE = {
  name: 'Anshika Agarwal', // "Page | Anshika Agarwal" in the browser tab
  homeTitle: 'Anshika Agarwal | Full-Stack Developer',
  jobTitle: 'Full-Stack Developer',
  wordmark: 'ANSHIKA AGARWAL', // bold logo in the navbar/footer
  tagline: 'Designing and building thoughtful digital products.', // default meta description
  availability: 'Open to internships & freelance',
  email: profile.email,
  phone: profile.phone,
  address: { locality: 'Kanpur', region: 'Uttar Pradesh', country: 'IN' },
  ogImage: '/og-default.png', // 1200x630, used when a page has no image
  // Absolute site URL (canonical, og:url, sitemap). Set VITE_SITE_URL in .env;
  // falls back to the current origin in the browser.
  url: (import.meta.env?.VITE_SITE_URL ?? '').replace(/\/+$/, ''),
};

export const RESUME = {
  label: 'Resume',
  href: '/resume.pdf', // put the PDF in public/resume.pdf
  external: true,
};

// Only real links: placeholder/TODO URLs in the profile are skipped.
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: profile.socials?.linkedin, external: true },
  { label: 'GitHub', href: profile.socials?.github, external: true },
].filter((link) => isFilled(link.href));

// Right side of the announcement bar: Resume | LinkedIn | GitHub
export const ANNOUNCEMENT_LINKS = [RESUME, ...SOCIAL_LINKS];

// Every page, in menu order. Set `enabled: false` to hide a page: it disappears
// from the navbar, mobile menu, footer and sitemap, and its route shows the 404.
export const PAGES = [
  { key: 'home', label: 'Home', path: '/', enabled: true },
  { key: 'about', label: 'About', path: '/about', enabled: true },
  { key: 'education', label: 'Education', path: '/education', enabled: true },
  { key: 'experience', label: 'Experience', path: '/experience', enabled: true },
  { key: 'skills', label: 'Skills', path: '/skills', enabled: true },
  { key: 'projects', label: 'Work', path: '/projects', enabled: true },
  { key: 'apps', label: 'Apps', path: '/apps', enabled: true },
  { key: 'sideHustle', label: 'Side Hustle', path: '/side-hustle', enabled: false },
  { key: 'activities', label: 'Activities', path: '/activities', enabled: false },
  { key: 'achievements', label: 'Achievements', path: '/achievements', enabled: true },
  { key: 'contact', label: 'Contact', path: '/contact', enabled: true },
];

export const isPageEnabled = (key) => PAGES.find((p) => p.key === key)?.enabled !== false;

// Enabled pages only, used by the mobile menu and the footer.
export const ALL_PAGES = PAGES.filter((p) => p.enabled);

// Left column of the desktop navbar (enabled pages only).
const PRIMARY_KEYS = ['about', 'projects', 'experience', 'skills'];
export const PRIMARY_NAV = ALL_PAGES.filter((p) => PRIMARY_KEYS.includes(p.key)).sort(
  (a, b) => PRIMARY_KEYS.indexOf(a.key) - PRIMARY_KEYS.indexOf(b.key),
);

export const HIRE_CTA = { label: 'Hire me', path: '/contact' };

// Screen-reader and small UI strings.
export const UI_TEXT = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  close: 'Close',
  menuTitle: 'Menu',
  mainNav: 'Main',
  mobileNav: 'Mobile',
  homeLink: 'Anshika Agarwal, home',
  newTab: '(opens in a new tab)',
  navigatedTo: 'Navigated to',
  offline: "You're offline. Some content may not load.",
  lightbox: {
    label: 'Image viewer',
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image',
    counter: (i, total) => `${i} / ${total}`,
  },
};

export const FOOTER = {
  pagesTitle: 'Explore',
  connectTitle: 'Connect',
  backToTop: 'Back to top',
  copyright: (year) => `© ${year} Anshika Agarwal. All rights reserved.`,
};
