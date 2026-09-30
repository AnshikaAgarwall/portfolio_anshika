// Light strip of four stats (like the reference's delivery / returns / quality
// / payment row): thin line icon, uppercase label, value. 2×2 on mobile,
// 4 across on desktop. Values are derived from real data in services/api.js.
import LineIcon from '../components/icons/LineIcon.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getStats } from '../services/api.js';
import { homeContent } from '../data/homeContent.js';

const GRID = 'grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4';
const ICON = 'h-8 w-8 shrink-0';

export default function StatsStrip() {
  const state = useFetch(getStats);

  return (
    <section aria-labelledby="stats-heading" className="border-b border-rule bg-light">
      <h2 id="stats-heading" className="sr-only">
        {homeContent.stats.heading}
      </h2>
      <div className="mx-auto max-w-screen-2xl px-6 py-12 md:px-10 md:py-16">
        <DataBoundary state={state} skeleton={<StatsSkeleton />}>
          {(stats) => (
            <dl className={GRID}>
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-start gap-4">
                  <LineIcon name={stat.icon} className={ICON} />
                  <div>
                    <dt className="text-label font-semibold uppercase tracking-label">{stat.label}</dt>
                    <dd className="mt-2 font-heading text-2xl font-semibold leading-none md:text-3xl">{stat.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </DataBoundary>
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <div className={GRID} aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className={ICON} />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
