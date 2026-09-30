// Two-column editorial row: small sticky label (an h2) on the left, content
// on the right, thin rule on top. Single column on mobile.
//   <LabeledRow id="services" label="Services">...</LabeledRow>
import { cn } from '../utils/cn.js';
import FadeUp from './FadeUp.jsx';

export default function LabeledRow({ id, label, tone = 'light', className, children }) {
  return (
    <FadeUp
      as="section"
      aria-labelledby={`${id}-heading`}
      className={cn(
        'grid gap-6 border-t py-10 md:grid-cols-12 md:py-14',
        tone === 'dark' ? 'border-paper/20' : 'border-rule',
        className,
      )}
    >
      <h2
        id={`${id}-heading`}
        className={cn('label md:sticky md:top-28 md:col-span-3 md:self-start', tone === 'dark' && 'text-paper/60')}
      >
        {label}
      </h2>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </FadeUp>
  );
}
