// /side-hustle: header → brand page (image band, label, giant name, tagline,
// description, brand/case-study links) → numbered services → work samples
// gallery (shared lightbox) → testimonials → black CTA.
// Every block is hidden when its data is empty or "TODO…"; if the brand has
// nothing usable at all, an on-brand "Coming soon." EmptyState is shown.
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FadeUp from '../components/FadeUp.jsx';
import GrayscaleImage from '../components/GrayscaleImage.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import LabeledRow from '../components/LabeledRow.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PaperBand from '../components/PaperBand.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getSideHustles } from '../services/api.js';
import { hasText, joinText, publishable, toImage } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';
import { UI_TEXT } from '../data/siteConfig.js';

const t = pagesContent.sideHustle;
const pickBrand = (items) => items?.find((b) => hasText(b.name));

export default function SideHustle() {
  const state = useFetch(getSideHustles);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <DataBoundary
        state={state}
        empty={t.empty}
        isEmpty={(items) => !pickBrand(items)}
        wrapper={PaperBand}
        skeleton={<BrandSkeleton />}
      >
        {(items) => (
          <PaperBand>
            <Brand brand={pickBrand(items)} />
          </PaperBand>
        )}
      </DataBoundary>

      <CtaBand {...t.cta} />
    </>
  );
}

function Brand({ brand }) {
  const image = toImage(brand.image, brand.name);
  const services = publishable(brand.services);
  const samples = (brand.workSamples ?? []).map((s) => toImage(s, brand.name)).filter(Boolean);
  const testimonials = (brand.testimonials ?? []).filter((q) => hasText(q?.quote));

  return (
    <>
      {image && (
        <GrayscaleImage src={image.src} alt={image.alt} className="mb-14 aspect-[4/3] w-full md:aspect-[21/9]" />
      )}

      {/* Brand intro */}
      <FadeUp as="section" aria-labelledby="brand-name" className="pb-14">
        <p className="label mb-6 text-muted">{t.brandLabel}</p>
        <h2
          id="brand-name"
          className="break-words font-heading text-[clamp(3rem,12vw,11rem)] font-extrabold uppercase leading-[0.85] tracking-display"
        >
          {brand.name}
        </h2>
        {hasText(brand.tagline) && <p className="mt-6 max-w-xl text-xl leading-snug md:text-2xl">{brand.tagline}</p>}
        {hasText(brand.description) && (
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed md:text-lg">{brand.description}</p>
        )}

        {(hasText(brand.link) || hasText(brand.relatedProjectSlug)) && (
          <div className="mt-10 flex flex-wrap items-center gap-8">
            {hasText(brand.link) && (
              <Button as="a" href={brand.link} target="_blank" rel="noopener noreferrer">
                {t.brandLinkLabel}
                <span className="sr-only"> {UI_TEXT.newTab}</span>
              </Button>
            )}
            {hasText(brand.relatedProjectSlug) && (
              <Button as={Link} to={`/projects/${brand.relatedProjectSlug}`} variant="link">
                {t.caseStudyLabel}
              </Button>
            )}
          </div>
        )}
      </FadeUp>

      {services.length > 0 && (
        <LabeledRow id="services" label={t.servicesHeading}>
          <ol className="border-t border-rule">
            {services.map((service, i) => (
              <li
                key={service}
                className="flex items-baseline gap-6 border-b border-rule py-5 font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-semibold uppercase tracking-display"
              >
                <span aria-hidden="true" className="label shrink-0 text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {service}
              </li>
            ))}
          </ol>
        </LabeledRow>
      )}

      {samples.length > 0 && (
        <LabeledRow id="samples" label={t.samplesHeading}>
          <ImageGallery images={samples} showCaptions />
        </LabeledRow>
      )}

      {testimonials.length > 0 && (
        <LabeledRow id="testimonials" label={t.testimonialsHeading}>
          <ul className="flex flex-col gap-12">
            {testimonials.map((q) => (
              <li key={q.quote}>
                <figure>
                  <blockquote className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-tight">
                    “{q.quote}”
                  </blockquote>
                  {hasText(q.name) && (
                    <figcaption className="label mt-6 text-muted">{joinText(q.name, q.role)}</figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </LabeledRow>
      )}
    </>
  );
}

function BrandSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="mb-14 aspect-[4/3] w-full md:aspect-[21/9]" />
      <Skeleton className="mb-6 h-3 w-24" />
      <Skeleton className="h-[clamp(3rem,12vw,11rem)] w-2/3" />
      <Skeleton className="mt-6 h-6 w-1/3" />
    </div>
  );
}
