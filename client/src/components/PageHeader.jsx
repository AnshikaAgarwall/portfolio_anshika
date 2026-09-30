// Light header band that opens every inner page: small label, giant <h1>
// (the page's only one), one intro line.
import Band from './Band.jsx';
import FadeUp from './FadeUp.jsx';

export default function PageHeader({ label, heading, intro, children }) {
  return (
    <Band tone="light" aria-labelledby="page-title" innerClassName="pb-12 pt-16 md:pb-16 md:pt-24">
      <FadeUp>
        {label && <p className="label mb-6">{label}</p>}
        <h1
          id="page-title"
          className="break-words font-heading text-[clamp(2rem,10vw,10rem)] font-extrabold uppercase leading-[0.85] tracking-display"
        >
          {heading}
        </h1>
      </FadeUp>
      {(intro || children) && (
        <FadeUp delay={0.1} className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {intro && <p className="max-w-md text-base leading-relaxed">{intro}</p>}
          {children}
        </FadeUp>
      )}
    </Band>
  );
}
