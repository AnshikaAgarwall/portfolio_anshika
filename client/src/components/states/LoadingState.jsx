// Generic skeleton shown while data loads: grey blocks in the shape of the
// content. The pulse stops automatically under prefers-reduced-motion
// (global rule in styles/index.css). Sections with a fixed layout pass their
// own matching skeleton to DataBoundary instead.
//   variant="list"  -> rows of text lines (experience, education)
//   variant="grid"  -> image cards (projects)
//   variant="text"  -> a paragraph
import { cn } from '../../utils/cn.js';
import { TONES } from './tones.js';

export function Skeleton({ className, tone = 'light' }) {
  return <span aria-hidden="true" className={cn('block animate-pulse', TONES[tone].bar, className)} />;
}

export default function LoadingState({ variant = 'list', count = 3, label = 'Loading', tone = 'light', className }) {
  const t = TONES[tone];
  const Bar = (props) => <Skeleton tone={tone} {...props} />;

  return (
    <div role="status" aria-live="polite" className={cn('w-full', className)}>
      <span className="sr-only">{label}</span>

      {variant === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Bar className="aspect-[4/5] w-full" />
              <Bar className="h-3 w-2/3" />
              <Bar className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {variant === 'list' && (
        <ul className={cn('flex flex-col divide-y border-y', t.divide, t.border)}>
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className="flex flex-col gap-3 py-8">
              <Bar className="h-3 w-24" />
              <Bar className="h-6 w-1/2" />
              <Bar className="h-3 w-3/4" />
            </li>
          ))}
        </ul>
      )}

      {variant === 'text' && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: count }, (_, i) => (
            <Bar key={i} className={cn('h-3', i === count - 1 ? 'w-2/3' : 'w-full')} />
          ))}
        </div>
      )}
    </div>
  );
}
