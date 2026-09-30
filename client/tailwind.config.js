// Single source of truth for the design system (monochrome editorial look).
// Every colour, font, radius and tracking value lives here. Components should
// only reference these tokens, never raw hex values or pixel radii.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Colours are REPLACED (not extended) so only brand tokens are available.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      light: '#E9E9E7', // warm light-grey page background (hero, sections)
      paper: '#F6F5F3', // off-white surface (cards, product grid)
      ink: '#0A0A0A', // near-black: text, buttons, dark bands
      // Secondary text. #5F5F5F passes WCAG AA on every light band:
      // 5.3:1 on light, 5.9:1 on paper (the old #6B6B6B was 4.4:1 on light).
      muted: '#5F5F5F',
      rule: '#D0D0CE', // hairlines and dividers
    },
    // Square corners everywhere, whatever radius class is used.
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    fontFamily: {
      heading: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      // Wide tracking scale for small uppercase labels ("NEW COLLECTION 2024").
      letterSpacing: {
        label: '0.12em',
        wide2: '0.2em',
        wide3: '0.3em',
        wide4: '0.4em',
        display: '-0.04em', // tight tracking for giant display type
      },
      fontSize: {
        micro: ['0.625rem', { lineHeight: '1.6' }], // 10px announcement bar text
        label: ['0.6875rem', { lineHeight: '1.6' }], // 11px uppercase labels
        display: ['clamp(6rem, 22vw, 18rem)', { lineHeight: '0.85' }], // giant "GAZU"/"404"
        // Full-width footer name (~8.9em wide); 9vw keeps it inside 320px screens.
        wordmark: ['clamp(1.25rem, 9vw, 8.5rem)', { lineHeight: '0.9' }],
        // Giant hero name. 20vw keeps "ANSHIKA" (~4.2em wide) at ~85% of the
        // viewport on every screen, so it never wraps or overflows.
        hero: ['clamp(3.5rem, 20vw, 22rem)', { lineHeight: '0.8' }],
      },
      minHeight: {
        hero: 'min(90vh, 75vw)', // ~90vh on desktop, shorter on tall tablets
      },
      height: {
        'hero-stage': '118vw', // mobile: box the cutout stands in
        'hero-figure': 'min(88%, 55vw)', // desktop: cutout height, capped so it clears the buttons
      },
      outlineWidth: {
        focus: '2px',
      },
      outlineOffset: {
        focus: '3px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
