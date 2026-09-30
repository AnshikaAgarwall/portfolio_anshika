// /experience: header → vertical timeline of roles → black CTA. Each item:
// date range ("PRESENT" when current), role, company, type badge, a
// "CURRENT" marker, bullet points as a thin-ruled list and tech chips.
// Empty/TODO fields are skipped.
import Band from '../components/Band.jsx';
import CtaBand from '../components/CtaBand.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import Tag from '../components/Tag.jsx';
import Timeline, { SkeletonTimelineItem, TimelineItem } from '../components/Timeline.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import useFetch from '../hooks/useFetch.js';
import { getExperience } from '../services/api.js';
import { hasText, publishable } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.experience;

const dateRange = (item) =>
  [item.startDate, item.current ? t.present : item.endDate].filter(hasText).join(' — ');

export default function Experience() {
  const state = useFetch(getExperience);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <Band tone="paper" aria-label={t.listLabel} innerClassName="py-16 md:py-24">
        <DataBoundary
          state={state}
          empty={t.empty}
          isEmpty={(items) => !items?.some((e) => hasText(e.role))}
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
                .filter((e) => hasText(e.role))
                .map((item) => (
                  <TimelineItem key={item.id} date={dateRange(item)}>
                    <Role item={item} />
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

function Role({ item }) {
  const bullets = publishable(item.bulletPoints);
  const tech = publishable(item.techUsed);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {item.current && <Tag solid>{t.currentBadge}</Tag>}
        {hasText(item.type) && <Tag>{item.type}</Tag>}
      </div>

      <h2 className="mt-5 font-heading text-[clamp(1.75rem,4vw,3rem)] font-bold uppercase leading-[0.95] tracking-display">
        {item.role}
      </h2>
      {hasText(item.company) && <p className="mt-3 text-base md:text-lg">{item.company}</p>}

      {bullets.length > 0 && (
        <ul className="mt-8 max-w-[65ch] border-t border-rule">
          {bullets.map((point) => (
            <li key={point} className="border-b border-rule py-4 text-base leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      )}

      {tech.length > 0 && (
        <ul aria-label={t.techLabel} className="mt-6 flex flex-wrap gap-2">
          {tech.map((name) => (
            <li key={name}>
              <Tag>{name}</Tag>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
