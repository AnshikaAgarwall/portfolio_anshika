// Subtle fade-up when the block scrolls into view (once). Renders a plain
// element, with no animation at all, when prefers-reduced-motion is set.
// Safety net: if the in-view check never fires (full-page screenshots,
// unusual scroll containers, printing), the content is revealed anyway after
// a short delay, so nothing can stay stuck invisible or offset.
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_EDITORIAL } from '../utils/motion.js';

const FALLBACK_MS = 1200;

export default function FadeUp({ as = 'div', delay = 0, className, children, ...props }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setForced(true), FALLBACK_MS);
    return () => clearTimeout(id);
  }, []);

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] ?? motion.div;
  const shown = inView || forced;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, delay: inView ? delay : 0, ease: EASE_EDITORIAL }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
