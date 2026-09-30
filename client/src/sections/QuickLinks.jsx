// Black band of three cards (like the reference's MEN / WOMEN / KIDS strip):
// small grayscale photo, uppercase title, one-line summary built from real
// data, and an underline link with an arrow. Stacks vertically on mobile.
import { Link } from 'react-router-dom';
import GrayscaleImage from '../components/GrayscaleImage.jsx';
import LineIcon from '../components/icons/LineIcon.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getEducation, getExperience, getProjects } from '../services/api.js';
import { homeContent } from '../data/homeContent.js';

const { heading, cards } = homeContent.quickLinks;

const loadSummary = () =>
  Promise.all([getEducation(), getExperience(), getProjects()]).then(([education, experience, projects]) => ({
    education,
    experience,
    projects,
  }));

const GRID = 'grid divide-y divide-paper/20 md:grid-cols-3 md:gap-8 md:divide-y-0';
const THUMB = 'h-28 w-24 shrink-0 md:h-32 md:w-28';

export default function QuickLinks() {
  const state = useFetch(loadSummary);

  return (
    <section aria-labelledby="quick-links-heading" className="surface-dark bg-ink text-paper">
      <h2 id="quick-links-heading" className="sr-only">
        {heading}
      </h2>
      <div className="mx-auto max-w-screen-2xl px-6 py-6 md:px-10 md:py-12">
        <DataBoundary state={state} tone="dark" isEmpty={() => false} skeleton={<QuickLinksSkeleton />}>
          {(summary) => (
            <ul className={GRID}>
              {cards.map((card) => (
                <li key={card.key} className="flex items-center gap-6 py-6 md:py-0">
                  <GrayscaleImage src={card.image} alt="" className={THUMB} />
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-semibold uppercase tracking-label">{card.title}</h3>
                    <p className="mt-2 text-sm leading-snug text-paper/70">{card.describe(summary)}</p>
                    <Link
                      to={card.to}
                      className="group mt-2 inline-flex min-h-11 items-center gap-2 text-label font-medium uppercase tracking-label"
                    >
                      <span className="border-b border-paper pb-1 transition-colors group-hover:border-paper/50">
                        {card.linkLabel}
                      </span>
                      <LineIcon
                        name="arrowRight"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DataBoundary>
      </div>
    </section>
  );
}

function QuickLinksSkeleton() {
  return (
    <ul className={GRID} aria-hidden="true">
      {cards.map((card) => (
        <li key={card.key} className="flex items-center gap-6 py-6 md:py-0">
          <Skeleton tone="dark" className={THUMB} />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton tone="dark" className="h-4 w-1/2" />
            <Skeleton tone="dark" className="h-3 w-3/4" />
            <Skeleton tone="dark" className="mt-4 h-3 w-1/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
