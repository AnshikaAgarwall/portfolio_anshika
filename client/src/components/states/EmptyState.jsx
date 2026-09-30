// Shown when a request succeeds but there is nothing to display
// (e.g. every project hidden). Label, title, short line and an optional action,
// in the same editorial style as the 404 page. tone="dark" for black bands.
import { cn } from '../../utils/cn.js';
import { TONES } from './tones.js';

export default function EmptyState({
  label = 'Nothing here yet',
  title = 'Coming soon',
  message,
  action,
  tone = 'light',
  className,
}) {
  const t = TONES[tone];

  return (
    <div className={cn('flex flex-col items-start border-y py-16', t.border, className)}>
      <p className={cn('label mb-4', t.muted)}>{label}</p>
      <h2 className="font-heading text-3xl font-semibold uppercase leading-none tracking-display md:text-5xl">
        {title}
      </h2>
      <span aria-hidden="true" className={cn('my-6 block h-px w-10', t.rule)} />
      {message && <p className={cn('max-w-md text-sm leading-relaxed', t.muted)}>{message}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
