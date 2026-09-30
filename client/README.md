# Anshika Agarwal · Portfolio (client)

Personal portfolio website for **Anshika Agarwal**, full-stack developer.
A monochrome, editorial "fashion brand" design: full-width bands, giant
typography, sharp corners, thin rules and small uppercase labels.

## Tech stack

- **React 19** + **Vite 8** (JavaScript)
- **Tailwind CSS 3**: all design tokens live in `tailwind.config.js`
- **React Router 7**: every page is lazy-loaded
- **Framer Motion**: subtle fade-ups and the hero parallax, off when the user
  asks the OS for reduced motion
- **react-helmet-async**: per-page title, description, canonical, Open Graph,
  Twitter and JSON-LD
- **ESLint 9** + **Prettier**
- **sharp** (scripts only) to optimise images and generate brand assets

## Getting started

```bash
npm install
cp .env.example .env      # then fill in the values
npm run dev               # http://localhost:5173
npm run build             # generates sitemap/robots, then builds to dist/
npm run preview           # serve the production build locally
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build:analyze` | Build and write `dist/stats.html`, a treemap of the bundle |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm run optimize:hero` | Re-create the hero cutout WebP/PNG files from `assets-src/` |
| `npm run placeholders` | Create grey placeholder photos (never overwrites real ones) |
| `npm run brand-assets` | Re-create `og-default.png` and the PNG app icons |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL. Empty = use the built-in mock data. |
| `VITE_SITE_URL` | Live site URL (no trailing slash). Used for canonical/OG URLs and `sitemap.xml`. |
| `VITE_MOCK_DELAY` | Optional fake latency (ms) for mock requests, to see loading states. |

Only `VITE_*` variables reach the browser. Never put secrets in them.
In development, add `?fail=1` to any URL to make every mock request fail and
test the error states.

## Folder structure

```
client/
├── assets-src/          original photos (not shipped), inputs for scripts
├── public/              static files served as-is (fonts, images, icons, robots, manifest)
├── scripts/             build helpers (sitemap, image optimisation, brand assets)
└── src/
    ├── components/      reusable UI (Button, Band, Seo, Lightbox, Toast, ...)
    │   ├── icons/       thin line icons
    │   ├── layout/      shell: navbar, mobile menu, footer, banners, route announcer
    │   └── states/      DataBoundary + loading / empty / error states
    ├── data/            content: mockData (facts), siteConfig, page copy
    ├── hooks/           useFetch, useFocusTrap, useUrlFilter, ...
    ├── pages/           one file per route
    ├── sections/        Home page bands (Hero, QuickLinks, ...)
    ├── services/api.js  the only data layer (mock today, real API later)
    ├── styles/          global CSS (fonts, focus, safe areas, reduced motion)
    └── utils/           small helpers (content guards, validation, SEO, ...)
```

## Editing content

- **Facts** (bio, education, experience, skills, projects, ...): `src/data/mockData.js`.
  Any value that is empty or starts with `TODO` is never shown to visitors.
- **Site-wide settings** (name, pages on/off, nav, footer): `src/data/siteConfig.js`.
  Set a page's `enabled: false` to hide it everywhere; its URL then shows the 404.
- **Page copy** (headings, labels, button text): `src/data/*Content.js`.

## Design decisions

- **One source of truth.** Colours, fonts, spacing scales and radius (always 0)
  are Tailwind tokens. Text and links live in `src/data`. Components hold no
  copy or hex values.
- **Data through one door.** Components call `services/api.js` via `useFetch`,
  and `DataBoundary` renders the matching skeleton / empty / error state. Moving
  from mock data to the real backend only changes `api.js`.
- **Never show placeholders.** `hasText` / `isFilled` guards hide empty or TODO
  fields; a page with nothing real shows an on-brand "Coming soon." state.
- **Accessible by default.** One `h1` per page, skip link, visible focus
  outlines, 44px touch targets, WCAG AA contrast (`muted` is `#5F5F5F`), focus
  moves to the new page's heading after navigation and a live region announces it.
- **Fast first paint.** Self-hosted variable fonts (two preloaded files), the
  hero cutout is preloaded as WebP with explicit size, every other image is lazy
  with a fixed aspect ratio, and vendor code is split into cacheable chunks.
- **Mobile first.** Fluid `clamp()` type, `svh` heights, notch safe-areas, and
  giant words sized so they never overflow from 320px to 1920px.
