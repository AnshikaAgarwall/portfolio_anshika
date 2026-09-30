// The one shared full-screen image viewer (project screenshots, side-hustle
// work samples, activity photos, certificates). Rendered in a portal.
// Close button, Escape closes, ←/→ navigate (wraps), focus trapped inside,
// body scroll locked, focus returns to the clicked thumbnail on close.
// Images: [{ src, alt, width, height, caption? }] (see utils/content.js toImage).
//
// Easiest use is the hook:
//   const lightbox = useLightbox(images);
//   <button onClick={() => lightbox.open(i)}>…</button>
//   {lightbox.element}
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LineIcon from './icons/LineIcon.jsx';
import useFocusTrap from '../hooks/useFocusTrap.js';
import useLockBodyScroll from '../hooks/useLockBodyScroll.js';
import { UI_TEXT } from '../data/siteConfig.js';

const CONTROL =
  'flex h-11 min-w-11 items-center justify-center gap-3 px-2 text-label font-medium uppercase tracking-wide2 transition-opacity hover:opacity-60';

export function useLightbox(images) {
  const [index, setIndex] = useState(null);

  const element = (
    <AnimatePresence>
      {index !== null && images[index] && (
        <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
      )}
    </AnimatePresence>
  );

  return { open: setIndex, element };
}

export default function Lightbox({ images, index, onIndexChange, onClose, text = UI_TEXT.lightbox }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const count = images.length;
  const image = images[index];

  useLockBodyScroll();
  useFocusTrap(dialogRef, { onEscape: onClose, initialFocusRef: closeRef });

  const go = (step) => onIndexChange((index + step + count) % count);

  // Arrow keys navigate while open.
  useEffect(() => {
    if (count < 2) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={text.label}
      className="surface-dark fixed inset-0 z-50 flex flex-col bg-ink/95 text-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        <p aria-live="polite" className="label">
          {text.counter(index + 1, count)}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={CONTROL}>
          {text.close}
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 block h-px w-4 rotate-45 bg-paper" />
            <span className="absolute left-0 top-1/2 block h-px w-4 -rotate-45 bg-paper" />
          </span>
        </button>
      </div>

      <figure className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-6 md:px-20">
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-auto min-h-0 w-auto max-w-full flex-1 object-contain"
        />
        {image.caption && (
          <figcaption aria-live="polite" className="max-w-2xl text-center text-sm leading-relaxed text-paper/80">
            {image.caption}
          </figcaption>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={text.prev}
              className={`${CONTROL} absolute left-2 top-1/2 -translate-y-1/2 md:left-6`}
            >
              <LineIcon name="arrowRight" className="h-6 w-6 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={text.next}
              className={`${CONTROL} absolute right-2 top-1/2 -translate-y-1/2 md:right-6`}
            >
              <LineIcon name="arrowRight" className="h-6 w-6" />
            </button>
          </>
        )}
      </figure>
    </motion.div>,
    document.body,
  );
}
