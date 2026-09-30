// Brand button from the reference: black rectangle with small uppercase text
// ("SHOP NOW"), or an underlined text link ("EXPLORE NEW IN").
// Pass `as={Link}` to render a router link, or leave it as a <button>.
// `inverse` is the light version for black surfaces (mobile menu, footer).
import { cn } from '../utils/cn.js';

const VARIANTS = {
  primary: 'bg-ink text-paper hover:bg-muted',
  inverse: 'bg-paper text-ink hover:bg-rule',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  outlineInverse: 'border border-paper text-paper hover:bg-paper hover:text-ink',
  // Underline sits on an inner span so the clickable box can be 44px tall.
  link: 'group min-h-11 text-ink hover:text-muted',
};

const LINK_UNDERLINE =
  'border-b border-ink pb-1 transition-colors duration-300 group-hover:border-muted';

const SIZES = {
  sm: 'px-5 py-3',
  md: 'px-8 py-4',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const isNativeButton = Component === 'button';

  return (
    <Component
      type={isNativeButton ? props.type || 'button' : undefined}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 font-body text-label font-medium uppercase tracking-label',
        'transition-colors duration-300 ease-editorial',
        VARIANTS[variant],
        variant !== 'link' && SIZES[size],
        className,
      )}
      {...props}
    >
      {variant === 'link' ? <span className={LINK_UNDERLINE}>{children ?? props.link?.label}</span> : children}
    </Component>
  );
}
