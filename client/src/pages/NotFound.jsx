// Custom 404 page styled like the reference hero: giant display "404",
// a short line of copy and a black rectangular "Go home" button.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import Seo from '../components/Seo.jsx';
import { fadeUp } from '../utils/motion.js';

export default function NotFound() {
  return (
    <section className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-center overflow-hidden px-6 py-24 md:px-12">
      <Seo title="Page not found" description="This page doesn't exist." noindex />
      <motion.p className="label mb-4 text-muted" {...fadeUp(0)}>
        Page not found
        <span className="mt-3 block h-px w-10 bg-ink" aria-hidden="true" />
      </motion.p>

      <motion.h1
        className="select-none font-heading text-display font-semibold tracking-display"
        {...fadeUp(0.1)}
      >
        404
        <span className="sr-only"> — page not found</span>
      </motion.h1>

      <motion.div
        className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        {...fadeUp(0.2)}
      >
        <p className="max-w-xs font-body text-base leading-relaxed text-ink">
          This page has walked off the runway. The rest of the collection is still here.
        </p>
        <Button as={Link} to="/" className="self-start md:self-auto">
          Go home
        </Button>
      </motion.div>
    </section>
  );
}
