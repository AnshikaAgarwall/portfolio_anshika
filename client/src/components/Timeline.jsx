// Vertical timeline used by /education and /experience.
//   <Timeline label="Roles">
//     <TimelineItem date="Aug 2026 — Present">...content...</TimelineItem>
//   </Timeline>
// Desktop: sticky date label left (3/12), content right with the thin line
// and a square marker. Mobile: one column, line down the left edge.
// Items are <li> in an <ol>; the line and markers are aria-hidden.
import { cn } from '../utils/cn.js';
import FadeUp from './FadeUp.jsx';
import { Skeleton } from './states/LoadingState.jsx';

export default function Timeline({ label, children, className }) {
  return (
    <ol aria-label={label} className={cn('flex flex-col', className)}>
      {children}
    </ol>
  );
}

const ITEM = 'relative grid border-l border-rule pb-14 pl-6 last:pb-0 md:grid-cols-12 md:gap-10 md:border-l-0 md:pb-0 md:pl-0';
const DATE = 'mb-4 md:sticky md:top-28 md:col-span-3 md:mb-0 md:self-start md:pt-1 md:text-right';
const BODY = 'relative min-w-0 md:col-span-9 md:border-l md:border-rule md:pb-14 md:pl-10';
const MARKER = 'absolute top-1.5 block h-2.5 w-2.5 bg-ink';

export function TimelineItem({ date, children }) {
  return (
    <FadeUp as="li" className={ITEM}>
      {/* Mobile marker sits on the li's left border */}
      <span aria-hidden="true" className={cn(MARKER, '-left-[5px] md:hidden')} />
      <p className={cn('label', DATE)}>{date}</p>
      <div className={BODY}>
        {/* Desktop marker sits on the content column's left border */}
        <span aria-hidden="true" className={cn(MARKER, '-left-[5px] hidden md:block')} />
        {children}
      </div>
    </FadeUp>
  );
}

// Placeholder with the same structure and roughly the same height as a
// real item (date, big title, two text lines, a chip row).
export function SkeletonTimelineItem() {
  return (
    <li aria-hidden="true" className={ITEM}>
      <div className={DATE}>
        <Skeleton className="h-3 w-24 md:ml-auto" />
      </div>
      <div className={BODY}>
        <Skeleton className="h-[clamp(1.75rem,4vw,3rem)] w-3/4" />
        <Skeleton className="mt-4 h-4 w-1/2" />
        <Skeleton className="mt-3 h-4 w-2/3" />
        <div className="mt-6 flex gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </li>
  );
}
