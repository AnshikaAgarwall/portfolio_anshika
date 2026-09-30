// Lazy-loaded image that fills its box (object-cover) and never breaks the
// layout: the wrapper keeps its size, and if the file is missing or fails a
// flat grey block with a thin image icon takes its place.
// Pass the size/aspect ratio via `className` (e.g. "aspect-[4/5] w-full").
import { useState } from 'react';
import { cn } from '../utils/cn.js';
import LineIcon from './icons/LineIcon.jsx';

// Add to imgClassName (inside a `group`) for colour reveal on hover,
// on hover-capable desktop screens only.
export const HOVER_COLOR =
  'transition-[filter] duration-500 [@media(hover:hover)_and_(min-width:768px)]:group-hover:grayscale-0';

export default function GrayscaleImage({ src, alt = '', className, imgClassName, grayscale = true, ...imgProps }) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={cn('relative overflow-hidden bg-rule', className)}>
      {failed ? (
        <div
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="absolute inset-0 flex items-center justify-center text-muted"
        >
          <LineIcon name="image" className="h-6 w-6" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('absolute inset-0 h-full w-full object-cover', grayscale && 'grayscale', imgClassName)}
          {...imgProps}
        />
      )}
    </div>
  );
}
