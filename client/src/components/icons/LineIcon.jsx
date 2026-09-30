// Thin 1.25px line icons in the style of the reference's feature strip
// (truck, box, badge, lock). Colour follows `currentColor`; size via className.
//   <LineIcon name="briefcase" className="h-8 w-8" />
const PATHS = {
  layers: (
    <>
      <path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" />
      <path d="m2.5 12 9.5 5 9.5-5" />
      <path d="m2.5 16 9.5 5 9.5-5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" />
      <path d="M8.5 7V4h7v3" />
      <path d="M2.5 12.5h19" />
    </>
  ),
  graduation: (
    <>
      <path d="M12 4 1.5 9 12 14l10.5-5L12 4Z" />
      <path d="M6 11.2V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.8" />
      <path d="M22.5 9v6" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m14 4-4 16" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="m3 17 5.5-5 4 3.5L16 12l5 4.5" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
};

export default function LineIcon({ name, className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
