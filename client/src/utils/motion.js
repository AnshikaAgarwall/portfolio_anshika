// Shared Framer Motion presets so every animation uses the same easing
// and timing. Matches the "editorial" easing in tailwind.config.js.
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

// Fade in while rising slightly. Spread onto a motion element: {...fadeUp(0.1)}
export const fadeUp = (delay = 0, distance = 16, duration = 0.7) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASE_EDITORIAL },
});
