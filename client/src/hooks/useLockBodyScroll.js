// Stops the page behind an overlay from scrolling while `locked` is true.
// Pads the body by the scrollbar's width so the layout doesn't jump.
import { useEffect } from 'react';

export default function useLockBodyScroll(locked = true) {
  useEffect(() => {
    if (!locked) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}
