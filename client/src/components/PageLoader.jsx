// Suspense fallback shown while a lazy-loaded page chunk downloads.
// A quiet uppercase label and a thin progress rule, in keeping with the brand.
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <span className="label text-muted">Loading</span>
      <span className="relative block h-px w-24 overflow-hidden bg-rule">
        <motion.span
          className="absolute inset-y-0 left-0 block w-1/3 bg-ink"
          initial={{ x: '-100%' }}
          animate={{ x: '300%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </div>
  );
}
