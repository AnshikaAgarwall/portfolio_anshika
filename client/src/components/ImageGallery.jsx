// Clickable grayscale thumbnails that open the shared Lightbox.
//   layout="grid"     -> even 1/2-column grid (screenshots, work samples)
//   layout="masonry"  -> 1/2/3 CSS columns keeping each image's ratio (activities)
// Images are lazy loaded with explicit width/height (no layout shift) and turn
// colour on hover on desktop. showCaptions prints each caption under its image.
import { cn } from '../utils/cn.js';
import FadeUp from './FadeUp.jsx';
import { useLightbox } from './Lightbox.jsx';

const LAYOUTS = {
  grid: { list: 'grid grid-cols-1 gap-6 md:grid-cols-2', item: '' },
  masonry: { list: 'columns-1 gap-6 sm:columns-2 lg:columns-3', item: 'mb-6 break-inside-avoid' },
};

export default function ImageGallery({ images, layout = 'grid', showCaptions = false, className }) {
  const lightbox = useLightbox(images);
  const l = LAYOUTS[layout];

  return (
    <>
      <ul className={cn(l.list, className)}>
        {images.map((img, i) => (
          <FadeUp as="li" key={img.src} className={l.item}>
            <figure>
              <button
                type="button"
                onClick={() => lightbox.open(i)}
                className="group block w-full bg-rule"
                aria-label={img.alt}
              >
                <img
                  src={img.src}
                  alt=""
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full grayscale transition-[filter] duration-500 [@media(hover:hover)_and_(min-width:768px)]:group-hover:grayscale-0"
                />
              </button>
              {showCaptions && img.caption && (
                <figcaption className="mt-3 text-sm leading-relaxed text-muted">{img.caption}</figcaption>
              )}
            </figure>
          </FadeUp>
        ))}
      </ul>
      {lightbox.element}
    </>
  );
}
