// All content for the Home hero (sections/Hero.jsx). Edit text and links here.
// Image files are generated from assets-src/ by `npm run optimize:hero`.
import { SITE } from './siteConfig.js';

export const heroData = {
  firstName: 'ANSHIKA',
  // Full accessible name for the <h1>; the giant word itself is visual only.
  headingLabel: SITE.name,
  tagline: ['FULL-STACK DEVELOPER', 'THAT BUILDS', 'WITH TASTE.'],
  cornerLabel: ['PORTFOLIO', '2026'],
  primaryCta: { label: 'View my work', to: '/projects' },
  secondaryCta: { label: 'Download CV', href: '/resume.pdf' },
  image: {
    src: '/images/anshika-cutout.png', // PNG fallback
    alt: 'Portrait of Anshika Agarwal',
    // Intrinsic size of the trimmed cutout; reserves space so nothing shifts.
    width: 800,
    height: 1189,
    webpSrcSet:
      '/images/anshika-cutout-480.webp 480w, /images/anshika-cutout-800.webp 800w, /images/anshika-cutout-1200.webp 1200w',
    // Rendered width: ~85vw on mobile, ~40vw on desktop.
    sizes: '(min-width: 768px) 40vw, 85vw',
  },
  // Critical hero sizing, applied as inline styles so it can never silently
  // disappear if a Tailwind class isn't generated.
  layout: {
    // Screen height minus announcement bar (32px) + navbar (64px mobile /
    // 80px desktop), at least 640px, except on short landscape phones where
    // it's one screen tall. svh = the height with mobile toolbars showing.
    minHeight: {
      mobile: 'max(min(640px, 100svh), calc(100svh - 96px))',
      desktop: 'max(min(640px, 100svh), calc(100svh - 112px))',
    },
    name: {
      // "ANSHIKA" is ~4.05em wide at this tracking, so 24vw ≈ 97% of the
      // screen. 3rem floor keeps it inside 320px phones; 40svh stops it
      // outgrowing short landscape screens.
      fontSize: 'clamp(3rem, min(24vw, 40svh), 34rem)',
      lineHeight: 0.8,
      letterSpacing: '-0.06em',
    },
    // Cutout height. Desktop: ~88% of the hero, capped on tall tablets so the
    // arms don't swallow the whole word. Mobile: as tall as the width allows.
    photoHeight: {
      mobile: 'min(125vw, 64svh)',
      desktop: 'min(88%, 72vw)',
    },
    // Mobile: how far the photo starts below the top of the name (~1/3 of
    // the font size), so the head overlaps the lower part of the letters.
    mobileNameOverlap: '8vw',
  },
};
