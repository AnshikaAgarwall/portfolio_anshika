// Tiny cursor parallax: returns spring-smoothed x/y motion values that move
// up to `strength` px OPPOSITE to the pointer. Only active on desktop with a
// real mouse and when reduced motion is off; otherwise the values stay 0.
// Motion values update outside React, so moving the mouse never re-renders.
import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)';
const SPRING = { stiffness: 80, damping: 20, mass: 0.6 };

export default function usePointerParallax(strength = 6) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia(QUERY);

    const onMove = (e) => {
      // -0.5..0.5 from the viewport centre, inverted and scaled.
      x.set(-(e.clientX / window.innerWidth - 0.5) * 2 * strength);
      y.set(-(e.clientY / window.innerHeight - 0.5) * 2 * strength);
    };

    const sync = () => {
      window.removeEventListener('pointermove', onMove);
      if (mq.matches) {
        window.addEventListener('pointermove', onMove, { passive: true });
      } else {
        x.set(0);
        y.set(0);
      }
    };

    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduceMotion, strength, x, y]);

  return { x: springX, y: springY };
}
