// White "BEST OF GAZU"-style band: "SELECTED WORK" heading with a "VIEW ALL"
// link, then featured projects in a 1 / 2 / 4 column grid. The skeleton
// renders the same cards at the same size so nothing jumps on load.
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import ProjectCard, { ProjectCardSkeleton } from '../components/ProjectCard.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import useFetch from '../hooks/useFetch.js';
import { getFeaturedProjects } from '../services/api.js';
import { homeContent } from '../data/homeContent.js';

const { heading, viewAll, skeletonCount, empty } = homeContent.featured;
// grid-cols-1 = minmax(0, 1fr), so long titles truncate instead of widening the page.
const GRID = 'grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-4';

export default function FeaturedProjects() {
  const state = useFetch(getFeaturedProjects);

  return (
    <section aria-labelledby="featured-heading" className="bg-paper">
      <div className="mx-auto max-w-screen-2xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2
            id="featured-heading"
            className="font-heading text-2xl font-semibold uppercase leading-none tracking-label md:text-3xl"
          >
            {heading}
          </h2>
          <Button as={Link} to={viewAll.to} variant="link">
            {viewAll.label}
          </Button>
        </div>

        <DataBoundary
          state={state}
          empty={empty}
          skeleton={
            <div className={GRID} role="status" aria-label="Loading projects">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          {(projects) => (
            <ul className={GRID}>
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          )}
        </DataBoundary>
      </div>
    </section>
  );
}
