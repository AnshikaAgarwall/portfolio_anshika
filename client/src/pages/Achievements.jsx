// /achievements: header → black certifications band → light awards band →
// black CTA. Both bands use the same large numbered, thin-ruled list: title in
// big type, issuer · date label, optional "View credential" link and
// optional certificate thumbnail (opens the shared lightbox).
// A band with no usable items is hidden; if both are empty, "Coming soon.".
import Band from '../components/Band.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FadeUp from '../components/FadeUp.jsx';
import { useLightbox } from '../components/Lightbox.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PaperBand from '../components/PaperBand.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getAchievements } from '../services/api.js';
import { cn } from '../utils/cn.js';
import { hasText, joinText, toImage } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';
import { UI_TEXT } from '../data/siteConfig.js';

const t = pagesContent.achievements;
const usable = (items) => (items ?? []).filter((a) => hasText(a.title));

export default function Achievements() {
  const state = useFetch(getAchievements);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <DataBoundary
        state={state}
        empty={t.empty}
        isEmpty={(d) => usable(d?.certifications).length + usable(d?.awards).length === 0}
        wrapper={PaperBand}
        skeleton={<ListSkeleton />}
      >
        {(data) => (
          <>
            <AchievementBand
              id="certifications"
              heading={t.certificationsHeading}
              items={usable(data.certifications)}
              tone="dark"
            />
            <AchievementBand id="awards" heading={t.awardsHeading} items={usable(data.awards)} tone="light" />
          </>
        )}
      </DataBoundary>

      <CtaBand {...t.cta} />
    </>
  );
}

function AchievementBand({ id, heading, items, tone }) {
  // Only items with a certificate image go into the lightbox.
  const images = items.map((item) => toImage(item.image, item.title, joinText(item.title, item.issuer, item.date)));
  const gallery = images.filter(Boolean);
  const lightbox = useLightbox(gallery);

  if (items.length === 0) return null;
  const dark = tone === 'dark';

  return (
    <Band tone={tone} aria-labelledby={`${id}-heading`} innerClassName="py-16 md:py-24">
      <h2 id={`${id}-heading`} className={cn('label mb-10', dark && 'text-paper/60')}>
        {heading}
      </h2>

      <ol className={cn('border-t', dark ? 'border-paper/20' : 'border-rule')}>
        {items.map((item, i) => {
          const image = images[i];
          return (
            <FadeUp
              as="li"
              key={item.id}
              className={cn(
                'grid grid-cols-[auto_1fr] gap-x-6 gap-y-6 border-b py-8 md:grid-cols-[4rem_1fr_auto] md:items-center md:py-10',
                dark ? 'border-paper/20' : 'border-rule',
              )}
            >
              <span aria-hidden="true" className={cn('label pt-2 md:pt-0', dark ? 'text-paper/50' : 'text-muted')}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <h3 className="break-words font-heading text-[clamp(1.5rem,4vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-display">
                  {item.title}
                </h3>
                {joinText(item.issuer, item.date) && (
                  <p className={cn('label mt-3', dark ? 'text-paper/60' : 'text-muted')}>
                    {joinText(item.issuer, item.date)}
                  </p>
                )}
                {hasText(item.description) && (
                  <p className={cn('mt-4 max-w-[65ch] text-base leading-relaxed', dark ? 'text-paper/80' : 'text-muted')}>
                    {item.description}
                  </p>
                )}
                {hasText(item.credentialLink) && (
                  <a
                    href={item.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center text-label font-medium uppercase tracking-label"
                  >
                    <span className={cn('border-b pb-1', dark ? 'border-paper' : 'border-ink')}>{t.credentialLabel}</span>
                    <span className="sr-only"> {UI_TEXT.newTab}</span>
                  </a>
                )}
              </div>

              {image && (
                <button
                  type="button"
                  onClick={() => lightbox.open(gallery.indexOf(image))}
                  aria-label={t.certificateLabel(item.title)}
                  className="group col-start-2 block w-32 bg-rule md:col-start-3 md:w-40"
                >
                  <img
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full grayscale transition-[filter] duration-500 [@media(hover:hover)_and_(min-width:768px)]:group-hover:grayscale-0"
                  />
                </button>
              )}
            </FadeUp>
          );
        })}
      </ol>
      {lightbox.element}
    </Band>
  );
}

function ListSkeleton() {
  return (
    <div role="status" aria-label="Loading achievements" className="border-t border-rule">
      {Array.from({ length: t.skeletonCount }, (_, i) => (
        <div key={i} className="flex gap-6 border-b border-rule py-8 md:py-10">
          <Skeleton className="h-3 w-6" />
          <div className="flex-1">
            <Skeleton className="h-[clamp(1.5rem,4vw,3.25rem)] w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
