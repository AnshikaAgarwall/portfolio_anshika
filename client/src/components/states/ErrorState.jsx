// Shown when loading data fails. Announces itself to screen readers and
// offers a "Try again" button when an onRetry handler is given.
// (Crashes during rendering are handled separately by ErrorBoundary.)
// tone="dark" for black bands.
import Button from '../Button.jsx';
import { cn } from '../../utils/cn.js';
import { TONES } from './tones.js';

export default function ErrorState({
  title = "Couldn't load this",
  message = 'Something went wrong while loading. Please try again.',
  onRetry,
  tone = 'light',
  className,
}) {
  const t = TONES[tone];

  return (
    <div role="alert" className={cn('flex flex-col items-start border-y py-16', t.border, className)}>
      <p className={cn('label mb-4', t.muted)}>Error</p>
      <h2 className="font-heading text-3xl font-semibold uppercase leading-none tracking-display md:text-5xl">
        {title}
      </h2>
      <span aria-hidden="true" className={cn('my-6 block h-px w-10', t.rule)} />
      <p className={cn('max-w-md text-sm leading-relaxed', t.muted)}>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant={t.button} className="mt-8">
          Try again
        </Button>
      )}
    </div>
  );
}
