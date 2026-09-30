// Guards so visitors never see empty fields or "TODO: add details" text.

const isTodo = (text) => /^\s*todo\b/i.test(text);

// A usable string: non-empty and not a TODO placeholder.
export const hasText = (value) => typeof value === 'string' && value.trim() !== '' && !isTodo(value);

// Stricter: also rejects values that contain "TODO" anywhere
// (e.g. placeholder URLs like https://github.com/TODO).
export const isFilled = (value) => hasText(value) && !/todo/i.test(value);

// Drops empty/TODO strings from a list (non-string items are kept).
export const publishable = (list) =>
  Array.isArray(list) ? list.filter((item) => (typeof item === 'string' ? hasText(item) : item != null)) : [];

// True if a field (string or list) has anything worth showing.
export const hasContent = (value) => (Array.isArray(value) ? publishable(value).length > 0 : hasText(value));

// Normalises an image field for galleries and the Lightbox.
// Accepts a URL string or { src, alt, width, height, caption }.
// Returns null when there is no usable src (so it can be filtered out).
export function toImage(value, fallbackAlt = '', caption = '') {
  const img = typeof value === 'string' ? { src: value } : value ?? {};
  if (!hasText(img.src)) return null;
  return {
    src: img.src,
    alt: hasText(img.alt) ? img.alt : fallbackAlt,
    width: img.width ?? 1600,
    height: img.height ?? 1000,
    caption: hasText(img.caption) ? img.caption : caption,
  };
}

// " · "-joined list of the fields that have text (for captions and meta rows).
export const joinText = (...parts) => parts.filter(hasText).join(' · ');

// "All" + each unique category in first-seen order, for FilterTabs.
export const categoryOptions = (items, allLabel, allValue = '') => [
  { value: allValue, label: allLabel },
  ...[...new Set(items.map((i) => i.category).filter(hasText))].map((c) => ({ value: c, label: c })),
];
