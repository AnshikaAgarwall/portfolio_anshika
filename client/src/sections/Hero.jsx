// Home hero, modelled on the reference: a giant "ANSHIKA" sits behind the
// cutout portrait, which stands in front so the middle letters are hidden.
//
// Stacking (inside one positioned container, above the section background):
//   z-10  giant name (the page's only <h1>), with a slight cursor parallax
//   z-20  ground shadow + grayscale cutout, bottom-aligned
//   z-30  tagline, buttons, corner label (always clickable, above the photo)
//
// Desktop (md+): name centred vertically in the whole hero; photo ~88% of the
// hero height, pinned to its bottom edge.
// Mobile: tagline → name → photo overlapping the name → buttons → label.
//
// Critical sizes come from heroData.layout as inline styles, so the layout
// never depends on custom Tailwind tokens being generated.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button.jsx';
import usePointerParallax from '../hooks/usePointerParallax.js';
import { fadeUp, EASE_EDITORIAL } from '../utils/motion.js';
import { heroData } from '../data/heroData.js';

// Timeline (s): name 0–0.6, cutout 0.25–0.85, small text 0.5–1.1.
const TIMING = {
  name: { delay: 0, distance: 24, duration: 0.6 },
  image: { delay: 0.25, duration: 0.6 },
  small: [0.5, 0.58, 0.66],
  smallDuration: 0.45,
};

const DESKTOP_QUERY = '(min-width: 768px)'; // same as Tailwind's `md`

// True at md+ widths. Read synchronously on first render so there's no flash.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

export default function Hero() {
  const { firstName, headingLabel, tagline, cornerLabel, primaryCta, secondaryCta, image, layout } = heroData;
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const parallax = usePointerParallax(6);

  // With reduced motion on, render everything in its final state.
  const enter = (delay, distance = 12, duration = TIMING.smallDuration) =>
    reduceMotion ? {} : fadeUp(delay, distance, duration);

  const imageEnter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: TIMING.image.duration, delay: TIMING.image.delay, ease: EASE_EDITORIAL },
      };

  const photoHeight = isDesktop ? layout.photoHeight.desktop : layout.photoHeight.mobile;

  return (
    <section aria-label="Introduction" className="relative overflow-hidden bg-light">
      <div
        className="relative mx-auto flex max-w-screen-2xl flex-col px-6 md:px-10"
        style={{ minHeight: isDesktop ? layout.minHeight.desktop : layout.minHeight.mobile }}
      >
        {/* Top-left tagline */}
        <motion.div className="relative z-30 pt-12 md:pt-14" {...enter(TIMING.small[0])}>
          <p className="label leading-loose text-ink">
            {tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <span aria-hidden="true" className="mt-3 block h-px w-10 bg-ink" />
        </motion.div>

        {/* Stage. Mobile: a box holding name + photo (photo height plus the
            overlap). Desktop: an empty flexible middle row; it is `static`, so
            the name and photo position against the whole hero instead. */}
        <div
          className="relative mt-6 md:static md:mt-0 md:flex-1"
          style={isDesktop ? undefined : { height: `calc(${photoHeight} + ${layout.mobileNameOverlap})` }}
        >
          {/* Layer 1: giant name. Mobile: top of the stage. Desktop: fills the
              hero and centres the word vertically. justify-center lets the
              word overflow the padded box equally on both sides (edge to edge). */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex select-none justify-center md:bottom-0 md:items-center">
            <motion.div style={parallax}>
              <motion.h1
                className="whitespace-nowrap text-center font-heading font-extrabold uppercase text-ink"
                style={layout.name}
                {...enter(TIMING.name.delay, TIMING.name.distance, TIMING.name.duration)}
              >
                <span aria-hidden="true">{firstName}</span>
                <span className="sr-only">{headingLabel}</span>
              </motion.h1>
            </motion.div>
          </div>

          {/* Layer 2: cutout + ground shadow, bottom-aligned and centred */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center"
            style={{ height: photoHeight }}
          >
            <motion.div
              className="relative h-full"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
              {...imageEnter}
            >
              <span
                aria-hidden="true"
                className="ground-shadow absolute -bottom-4 left-1/2 h-10 w-[70%] -translate-x-1/2"
              />
              <HeroImage image={image} />
            </motion.div>
          </div>
        </div>

        {/* Bottom row: CTAs left, corner label right (stacked on mobile) */}
        <div className="relative z-30 flex flex-col gap-8 border-t border-rule pb-12 pt-8 md:flex-row md:items-end md:justify-between md:border-0 md:pb-14 md:pt-0">
          <motion.div
            className="flex flex-wrap items-center gap-x-8 gap-y-4 md:flex-col md:items-start lg:flex-row lg:items-center"
            {...enter(TIMING.small[1])}
          >
            <Button as={Link} to={primaryCta.to}>
              {primaryCta.label}
            </Button>
            <Button as="a" href={secondaryCta.href} download variant="link">
              {secondaryCta.label}
            </Button>
          </motion.div>

          <motion.div {...enter(TIMING.small[2])}>
            <p className="label leading-loose text-ink">
              {cornerLabel.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <span aria-hidden="true" className="mt-3 block h-px w-10 bg-ink" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// The LCP image: WebP srcset with PNG fallback, loaded eagerly at high
// priority. Explicit width/height plus the parent's aspect-ratio reserve its
// space. If it fails to load, a grey silhouette of the same size takes over.
function HeroImage({ image }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <Silhouette image={image} />;

  return (
    <picture>
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={image.sizes} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="eager"
        fetchPriority="high"
        draggable="false"
        onError={() => setFailed(true)}
        className="relative h-full w-full object-contain object-bottom grayscale"
      />
    </picture>
  );
}

// Neutral placeholder figure on the same 800×1189 canvas as the cutout.
function Silhouette({ image }) {
  return (
    <svg
      role="img"
      aria-label={image.alt}
      viewBox={`0 0 ${image.width} ${image.height}`}
      preserveAspectRatio="xMidYMax meet"
      className="relative h-full w-full text-rule"
    >
      <g fill="currentColor">
        <ellipse cx="400" cy="175" rx="105" ry="130" />
        <rect x="345" y="280" width="110" height="70" />
        <path d="M185 410 Q200 345 330 335 H470 Q600 345 615 410 L600 700 Q590 760 580 800 L590 1189 H210 L220 800 Q210 760 200 700 Z" />
      </g>
    </svg>
  );
}
