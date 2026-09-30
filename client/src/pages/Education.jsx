// /education: header → vertical timeline of degrees (newest first, as
// ordered in the data) → black CTA. Each item: year, degree, institution,
// grade label, optional description. Empty/TODO fields are skipped.
import Band from '../components/Band.jsx';
import CtaBand from '../components/CtaBand.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import Tag from '../components/Tag.jsx';
import Timeline, { SkeletonTimelineItem, TimelineItem } from '../components/Timeline.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import useFetch from '../hooks/useFetch.js';
import { getEducation } from '../services/api.js';
import { hasText } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.education;

// "2022 — 2024" if a start year exists, otherwise just the end year.
const yearRange = (item) => [item.startYear, item.endYear].filter(Boolean).join(' — ');

export default function Education() {
  const state = useFetch(getEducation);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <Band tone="paper" aria-label={t.listLabel} innerClassName="py-16 md:py-24">
        <DataBoundary
          state={state}
          empty={t.empty}
          isEmpty={(items) => !items?.some((e) => hasText(e.degree))}
          skeleton={
            <Timeline label={t.listLabel}>
              {Array.from({ length: t.skeletonCount }, (_, i) => (
                <SkeletonTimelineItem key={i} />
              ))}
            </Timeline>
          }
        >
          {(items) => (
            <Timeline label={t.listLabel}>
              {items
                .filter((e) => hasText(e.degree))
                .map((item) => (
                  <TimelineItem key={item.id} date={yearRange(item)}>
                    <h2 className="font-heading text-[clamp(1.75rem,4vw,3rem)] font-bold uppercase leading-[0.95] tracking-display">
                      {item.degree}
                    </h2>
                    {hasText(item.institution) && <p className="mt-4 text-base md:text-lg">{item.institution}</p>}
                    {hasText(item.grade) && <Tag className="mt-6">{item.grade}</Tag>}
                    {hasText(item.description) && (
                      <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted">{item.description}</p>
                    )}
                  </TimelineItem>
                ))}
            </Timeline>
          )}
        </DataBoundary>
      </Band>

      <CtaBand {...t.cta} />
    </>
  );
}
