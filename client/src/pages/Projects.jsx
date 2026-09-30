// /projects: header band (label, giant heading, intro, count), category
// filter tabs synced to ?category=… (shareable, back button works), an
// animated 1/2/3-column grid of ProjectCards, and a black "Have an idea?" CTA.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import FadeUp from '../components/FadeUp.jsx';
import FilterTabs, { tabId } from '../components/FilterTabs.jsx';
import ProjectCard, { ProjectCardSkeleton } from '../components/ProjectCard.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import EmptyState from '../components/states/EmptyState.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import useUrlFilter from '../hooks/useUrlFilter.js';
import { categoryOptions } from '../utils/content.js';
import { getProjects } from '../services/api.js';
import { EASE_EDITORIAL } from '../utils/motion.js';
import { projectsContent } from '../data/projectsContent.js';

const t = projectsContent.list;
const ALL = ''; // "All" = no ?category param
const PANEL_ID = 'projects-panel';
const GRID = 'grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3';

export default function Projects() {
  const state = useFetch(getProjects);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />

      {/* Header band */}
      <Band tone="light" innerClassName="pb-12 pt-16 md:pb-16 md:pt-24">
        <FadeUp>
          <p className="label mb-6">{t.label}</p>
          <h1 className="font-heading text-[clamp(3rem,11vw,10rem)] font-extrabold uppercase leading-[0.85] tracking-display">
            {t.heading}
          </h1>
        </FadeUp>
        <FadeUp delay={0.1} className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed">{t.intro}</p>
          <p className="label text-muted" aria-live="polite">
            {state.status === 'success' ? t.count(state.data.length) : <Skeleton className="h-3 w-24" />}
          </p>
        </FadeUp>
      </Band>

      {/* Filters + grid */}
      <Band tone="paper" aria-labelledby="all-projects-heading" innerClassName="py-12 md:py-20">
        {/* Keeps the outline h1 → h2 → card h3 */}
        <h2 id="all-projects-heading" className="sr-only">
          {t.gridHeading}
        </h2>
        <DataBoundary state={state} empty={t.noProjects} skeleton={<ProjectsSkeleton />}>
          {(projects) => <FilteredGrid projects={projects} />}
        </DataBoundary>
      </Band>

      {/* Bottom CTA */}
      <Band tone="dark" innerClassName="flex flex-col items-start gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <h2 className="font-heading text-[clamp(2.75rem,9vw,8rem)] font-extrabold uppercase leading-[0.85] tracking-display">
          {t.cta.heading}
        </h2>
        <Button as={Link} to={t.cta.button.to} variant="inverse">
          {t.cta.button.label}
        </Button>
      </Band>
    </>
  );
}

function FilteredGrid({ projects }) {
  const [active, setFilter] = useUrlFilter(t.queryKey, ALL);
  const reduceMotion = useReducedMotion();
  const options = useMemo(() => categoryOptions(projects, t.allLabel, ALL), [projects]);
  const visible = active === ALL ? projects : projects.filter((p) => p.category === active);

  const cardMotion = reduceMotion
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, transition: { duration: 0.15 } },
        transition: { duration: 0.4, ease: EASE_EDITORIAL },
      };

  return (
    <>
      <div className="mb-10 border-b border-rule">
        <FilterTabs options={options} active={active} onChange={setFilter} label={t.filterLabel} panelId={PANEL_ID} />
      </div>

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(active)}>
        {visible.length === 0 ? (
          <EmptyState
            label={t.empty.label}
            title={t.empty.title}
            action={<Button onClick={() => setFilter(ALL)}>{t.empty.showAll}</Button>}
          />
        ) : (
          <ul className={GRID}>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <motion.li key={project.id} {...cardMotion}>
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </>
  );
}

// Tabs row + cards at the exact size of the real ones (no layout shift).
function ProjectsSkeleton() {
  return (
    <div role="status" aria-label="Loading projects">
      <div className="mb-10 flex h-11 items-center gap-8 border-b border-rule">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className={GRID}>
        {Array.from({ length: t.skeletonCount }, (_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
