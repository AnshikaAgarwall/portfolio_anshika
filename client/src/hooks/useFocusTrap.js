// Keeps keyboard focus inside `containerRef` while `active` is true:
// focuses the first control on open, cycles Tab / Shift+Tab inside the
// container, calls `onEscape` on Escape, and gives focus back to whatever
// had it before (e.g. the hamburger button) when the trap ends.
// Pass `initialFocusRef` to choose which element gets focus first.
import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function useFocusTrap(containerRef, { active = true, onEscape, initialFocusRef } = {}) {
  // Keep the latest callback without re-running the effect on every render.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement;
    const getFocusable = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);

    (initialFocusRef?.current ?? getFocusable()[0])?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscapeRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Give focus back only if it is still inside the closing container (or
      // lost); if something else already moved it (e.g. the RouteAnnouncer
      // after a menu link), leave it there.
      const active = document.activeElement;
      const focusIsStale = !active || active === document.body || container.contains(active);
      if (focusIsStale && previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, initialFocusRef, active]);
}
