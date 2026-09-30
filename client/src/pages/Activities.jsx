// /activities: header → category tabs (only if the data has categories,
// synced to the URL) → masonry photo gallery (shared lightbox, caption =
// title · organisation · role · date) → timeline of every activity, newest
// first (items without a photo still appear here) → black CTA.
import { useMemo } from 'react';
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FilterTabs, { tabId } from '../components/FilterTabs.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PaperBand from '../components/PaperBand.jsx';
import Seo from '../components/Seo.jsx';
import Timeline, { SkeletonTimelineItem, TimelineItem } from '../components/Timeline.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import EmptyState from '../components/states/EmptyState.jsx';
import useFetch from '../hooks/useFetch.js';
import useUrlFilter from '../hooks/useUrlFilter.js';
import { getActivities } from '../services/api.js';
import { categoryOptions, hasText, joinText, toImage } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.activities;
const PANEL_ID = 'activities-panel';
const usable = (items) => (items ?? []).filter((a) => hasText(a.title));

export default function Activities() {
  const state = useFetch(getActivities);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <DataBoundary
        state={state}
        empty={t.empty}
        isEmpty={(items) => usable(items).length === 0}
        wrapper={PaperBand}
        skeleton={
          <Timeline label={t.listHeading}>
            {Array.from({ length: t.skeletonCount }, (_, i) => (
              <SkeletonTimelineItem key={i} />
            ))}
          </Timeline>
        }
      >
        {(items) => <FilteredActivities items={usable(items)} />}
      </DataBoundary>

      <CtaBand {...t.cta} />
    </>
  );
}

function FilteredActivities({ items }) {
  const [active, setActive] = useUrlFilter(t.queryKey);
  const options = useMemo(() => categoryOptions(items, t.allLabel), [items]);
  const showTabs = options.length > 1; // tabs only when categories exist
  const visible = active ? items.filter((a) => a.category === active) : items;

  const photos = visible
    .map((a) => toImage(a.image, a.title, joinText(a.title, a.organisation, a.role, a.date)))
    .filter(Boolean);

  return (
    <>
      {showTabs && (
        <Band tone="light" innerClassName="border-b border-rule">
          <FilterTabs options={options} active={active} onChange={setActive} label={t.filterLabel} panelId={PANEL_ID} />
        </Band>
      )}

      <div id={PANEL_ID} role={showTabs ? 'tabpanel' : undefined} aria-labelledby={showTabs ? tabId(active) : undefined}>
        {visible.length === 0 ? (
          <PaperBand>
            <EmptyState
              label={t.emptyFilter.label}
              title={t.emptyFilter.title}
              action={<Button onClick={() => setActive('')}>{t.emptyFilter.showAll}</Button>}
            />
          </PaperBand>
        ) : (
          <>
            {photos.length > 0 && (
              <Band tone="light" aria-labelledby="gallery-heading" innerClassName="py-12 md:py-20">
                <h2 id="gallery-heading" className="label mb-8">
                  {t.galleryHeading}
                </h2>
                <ImageGallery images={photos} layout="masonry" />
              </Band>
            )}

            <Band tone="paper" aria-labelledby="list-heading" innerClassName="py-16 md:py-24">
              <h2 id="list-heading" className="label mb-10">
                {t.listHeading}
              </h2>
              <Timeline label={t.listHeading}>
                {visible.map((a) => (
                  <TimelineItem key={a.id} date={hasText(a.date) ? a.date : ''}>
                    <h3 className="font-heading text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold uppercase leading-[0.95] tracking-display">
                      {a.title}
                    </h3>
                    {joinText(a.organisation, a.role) && (
                      <p className="mt-3 text-base md:text-lg">{joinText(a.organisation, a.role)}</p>
                    )}
                    {hasText(a.description) && (
                      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted">{a.description}</p>
                    )}
                  </TimelineItem>
                ))}
              </Timeline>
            </Band>
          </>
        )}
      </div>
    </>
  );
}
