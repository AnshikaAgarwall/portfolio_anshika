// /apps: header → category tabs (in the URL query, same pattern as
// /projects) → 1/2/4-column grid of tool cards → black CTA.
// Card: icon (or the name's first letter in a black square), name, category,
// "why I use it". The card is a link only when the app has a link.
import { useMemo } from 'react';
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FadeUp from '../components/FadeUp.jsx';
import FilterTabs, { tabId } from '../components/FilterTabs.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import EmptyState from '../components/states/EmptyState.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import useUrlFilter from '../hooks/useUrlFilter.js';
import { getApps } from '../services/api.js';
import { categoryOptions, hasText } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';
import { UI_TEXT } from '../data/siteConfig.js';

const t = pagesContent.apps;
const PANEL_ID = 'apps-panel';
const GRID = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4';
const CARD = 'flex h-full min-h-[14rem] flex-col border border-rule p-6';
const usable = (apps) => (apps ?? []).filter((a) => hasText(a.name));

export default function Apps() {
  const state = useFetch(getApps);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <Band tone="paper" aria-label={t.header.heading} innerClassName="py-12 md:py-20">
        <DataBoundary
          state={state}
          empty={t.empty}
          isEmpty={(apps) => usable(apps).length === 0}
          skeleton={
            <div role="status" aria-label="Loading apps" className={GRID}>
              {Array.from({ length: t.skeletonCount }, (_, i) => (
                <div key={i} className={CARD} aria-hidden="true">
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="mt-6 h-4 w-2/3" />
                  <Skeleton className="mt-3 h-3 w-1/3" />
                  <Skeleton className="mt-6 h-3 w-full" />
                </div>
              ))}
            </div>
          }
        >
          {(apps) => <FilteredApps apps={usable(apps)} />}
        </DataBoundary>
      </Band>

      <CtaBand {...t.cta} />
    </>
  );
}

function FilteredApps({ apps }) {
  const [active, setActive] = useUrlFilter(t.queryKey);
  const options = useMemo(() => categoryOptions(apps, t.allLabel), [apps]);
  const visible = active ? apps.filter((a) => a.category === active) : apps;
  const showTabs = options.length > 2; // "All" + at least two categories

  return (
    <>
      {showTabs && (
        <div className="mb-10 border-b border-rule">
          <FilterTabs options={options} active={active} onChange={setActive} label={t.filterLabel} panelId={PANEL_ID} />
        </div>
      )}

      <div id={PANEL_ID} role={showTabs ? 'tabpanel' : undefined} aria-labelledby={showTabs ? tabId(active) : undefined}>
        {visible.length === 0 ? (
          <EmptyState
            label={t.emptyFilter.label}
            title={t.emptyFilter.title}
            action={<Button onClick={() => setActive('')}>{t.emptyFilter.showAll}</Button>}
          />
        ) : (
          <ul className={GRID}>
            {visible.map((app) => (
              <FadeUp as="li" key={app.id}>
                <AppCard app={app} />
              </FadeUp>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function AppCard({ app }) {
  const body = (
    <>
      <AppIcon app={app} />
      <h2 className="mt-6 font-heading text-lg font-semibold uppercase tracking-label">{app.name}</h2>
      {hasText(app.category) && <p className="label mt-1 text-muted">{app.category}</p>}
      {hasText(app.why) && <p className="mt-4 text-sm leading-relaxed">{app.why}</p>}
    </>
  );

  if (!hasText(app.link)) return <div className={CARD}>{body}</div>;

  return (
    <a
      href={app.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${CARD} transition-colors duration-300 hover:border-ink`}
    >
      {body}
      <span className="sr-only"> {UI_TEXT.newTab}</span>
    </a>
  );
}

// App icon image if provided, otherwise the first letter in a black square.
function AppIcon({ app }) {
  if (hasText(app.icon)) {
    return <img src={app.icon} alt="" width="48" height="48" loading="lazy" className="h-12 w-12 object-contain" />;
  }
  return (
    <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center bg-ink font-heading text-xl font-bold uppercase text-paper">
      {app.name.trim().charAt(0)}
    </span>
  );
}
