// Full-width horizontal band (the reference's building block): coloured
// background edge to edge, content in the standard centred container.
//   <Band tone="dark" className="py-20">...</Band>
// tone: light (#E9E9E7) | paper (off-white) | grey | dark (black, light text)
import { cn } from '../utils/cn.js';

const TONES = {
  light: 'bg-light text-ink',
  paper: 'bg-paper text-ink',
  grey: 'bg-rule text-ink',
  dark: 'surface-dark bg-ink text-paper',
};

export default function Band({ as: Tag = 'section', tone = 'light', className, innerClassName, children, ...props }) {
  return (
    <Tag className={cn(TONES[tone], className)} {...props}>
      <div className={cn('mx-auto max-w-screen-2xl px-6 md:px-10', innerClassName)}>{children}</div>
    </Tag>
  );
}
