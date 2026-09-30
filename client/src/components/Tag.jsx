// Small uppercase chip with a thin border (tech tags, type badges).
// solid = black filled (e.g. the "CURRENT" marker). tone="dark" for black bands.
import { cn } from '../utils/cn.js';

export default function Tag({ as: Tag = 'span', solid = false, tone = 'light', className, children }) {
  return (
    <Tag
      className={cn(
        'inline-block border px-2.5 py-1.5 text-label font-medium uppercase leading-none tracking-label',
        solid ? 'border-ink bg-ink text-paper' : tone === 'dark' ? 'border-paper/30' : 'border-rule',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
