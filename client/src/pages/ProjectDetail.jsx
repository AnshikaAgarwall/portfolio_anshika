// /projects/:slug case study:
//   back link → hero band (category, giant title, subtitle, tags, year, links)
//   → full-width grayscale cover → two-column case-study sections (sticky
//   label left, content right) → screenshot gallery + lightbox → prev/next.
// Sections whose field is empty or "TODO…" are not rendered at all.
// Unknown slug (ApiError 404) renders the custom 404 page.
import { Link, useParams } from 'react-router-dom';
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import FadeUp from '../components/FadeUp.jsx';
import GrayscaleImage from '../components/GrayscaleImage.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import LineIcon from '../components/icons/LineIcon.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getProjectBySlug, getProjects } from '../services/api.js';
import { hasContent, publishable, toImage } from '../utils/content.js';
import { projectsContent } from '../data/projectsContent.js';
import NotFound from './NotFound.jsx';

const t = projectsContent.detail;

// Project + its neighbours in the list (wrapping around).
async function loadCaseStudy(slug) {
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  const i = all.findIndex((p) => p.slug === project.slug);
  const hasNeighbours = all.length > 1 && i !== -1;
  return {
    project,
    prev: hasNeighbours ? all[(i - 1 + all.length) % all.length] : null,
    next: hasNeighbours ? all[(i + 1) % all.length] : null,
  };
}

const TAG = 'border border-rule px-2.5 py-1.5 text-label font-medium uppercase leading-none tracking-label';

export default function ProjectDetail() {
  const { slug } = useParams();
  const state = useFetch(() => loadCaseStudy(slug), [slug]);

  if (state.status === 'error' && state.error?.status === 404) return <NotFound />;

  return (
    <>
      {state.status === 'success' ? (
        <Seo
          title={state.data.project.title}
          description={state.data.project.shortDesc}
          image={state.data.project.coverImage}
          type="article"
        />
      ) : (
        <Seo title={projectsContent.list.seo.title} />
      )}

      <Band tone="light" innerClassName="pt-8 md:pt-10">
        <Link
          to={t.backLink.to}
          className="group inline-flex min-h-11 items-center gap-2 text-label font-medium uppercase tracking-wide2"
        >
          <LineIcon name="arrowRight" className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          <span className="border-b border-ink pb-1">{t.backLink.label}</span>
        </Link>
      </Band>

      <DataBoundary
        state={state}
        isEmpty={() => false}
        skeleton={<DetailSkeleton />}
        error={{ className: 'mx-6 my-16 md:mx-10' }}
      >
        {(data) => <CaseStudy {...data} />}
      </DataBoundary>
    </>
  );
}

function CaseStudy({ project, prev, next }) {
  const sections = t.sections.filter((s) => hasContent(project[s.field]));
  const screenshots = normalizeScreenshots(project);

  return (
    <>
      {/* Hero band */}
      <Band tone="light" innerClassName="pb-14 pt-10 md:pb-20 md:pt-14">
        <FadeUp>
          {project.category && <p className="label mb-6 text-muted">{project.category}</p>}
          <h1 className="break-words font-heading text-[clamp(2.25rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.9] tracking-display">
            {project.title}
          </h1>
          {project.subtitle && <p className="mt-6 max-w-xl text-lg leading-snug md:text-xl">{project.subtitle}</p>}
        </FadeUp>

        <FadeUp delay={0.1} className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
              {project.techStack.map((tech) => (
                <li key={tech} className={TAG}>
                  {tech}
                </li>
              ))}
            </ul>
            {project.year && (
              <p className="label text-muted">
                {t.yearLabel} {project.year}
              </p>
            )}
          </div>

          {(project.liveLink || project.githubLink) && (
            <div className="flex flex-wrap items-center gap-8">
              {project.liveLink && (
                <Button as="a" href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  {t.liveLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              )}
              {project.githubLink && (
                <Button as="a" href={project.githubLink} target="_blank" rel="noopener noreferrer" variant="link">
                  {t.githubLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              )}
            </div>
          )}
        </FadeUp>
      </Band>

      {/* Full-width cover (above the fold, so loaded eagerly) */}
      <GrayscaleImage
        src={project.coverImage}
        alt={project.coverAlt || project.title}
        className="aspect-[4/3] w-full md:aspect-[21/9]"
        loading="eager"
        fetchPriority="high"
      />

      {/* Case-study sections */}
      {sections.length > 0 && (
        <Band tone="paper" innerClassName="py-8 md:py-16">
          {sections.map((section) => (
            <CaseSection key={section.id} section={section} value={project[section.field]} />
          ))}
        </Band>
      )}

      {screenshots.length > 0 && <Gallery screenshots={screenshots} />}

      {prev && next && <PrevNext prev={prev} next={next} />}
    </>
  );
}

// One row: sticky label left (h2 for the outline), content right.
function CaseSection({ section, value }) {
  return (
    <FadeUp as="section" aria-labelledby={`cs-${section.id}`} className="grid gap-6 border-t border-rule py-10 first:border-t-0 md:grid-cols-12 md:py-14">
      <h2 id={`cs-${section.id}`} className="label md:sticky md:top-28 md:col-span-3 md:self-start">
        {section.label}
      </h2>
      <div className="md:col-span-8 md:col-start-5">
        {section.type === 'text' && <p className="max-w-2xl text-lg leading-relaxed md:text-xl">{value}</p>}

        {section.type === 'list' && (
          <ul className="max-w-2xl border-t border-rule">
            {publishable(value).map((item, i) => (
              <li key={item} className="flex gap-6 border-b border-rule py-5 text-base leading-relaxed md:text-lg">
                <span aria-hidden="true" className="label pt-1.5 text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {section.type === 'tags' && (
          <ul className="flex flex-wrap gap-2">
            {publishable(value).map((tech) => (
              <li key={tech} className={TAG}>
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FadeUp>
  );
}

// Accepts plain URL strings or { src, alt, width, height } objects.
function normalizeScreenshots(project) {
  return (project.screenshots ?? [])
    .map((shot, i) => toImage(shot, t.screenshotAlt(project.title, i + 1)))
    .filter(Boolean);
}

function Gallery({ screenshots }) {
  return (
    <Band tone="light" innerClassName="py-16 md:py-24" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="label mb-8">
        {t.galleryLabel}
      </h2>
      <ImageGallery images={screenshots} />
    </Band>
  );
}

function PrevNext({ prev, next }) {
  const LINK = 'group flex min-h-11 flex-col gap-3 py-10 md:py-14';
  const TITLE =
    'font-heading text-[clamp(1.5rem,4vw,3.5rem)] font-extrabold uppercase leading-[0.95] tracking-display transition-opacity group-hover:opacity-60';

  return (
    <Band as="nav" tone="light" aria-label="More projects" className="border-t border-rule">
      <div className="grid grid-cols-1 divide-y divide-rule md:grid-cols-2 md:divide-x md:divide-y-0">
        <Link to={`/projects/${prev.slug}`} className={`${LINK} md:pr-10`}>
          <span className="label flex items-center gap-2 text-muted">
            <LineIcon name="arrowRight" className="h-4 w-4 rotate-180" />
            {t.prevLabel}
          </span>
          <span className={TITLE}>{prev.title}</span>
        </Link>
        <Link to={`/projects/${next.slug}`} className={`${LINK} md:items-end md:pl-10 md:text-right`}>
          <span className="label flex items-center gap-2 text-muted">
            {t.nextLabel}
            <LineIcon name="arrowRight" className="h-4 w-4" />
          </span>
          <span className={TITLE}>{next.title}</span>
        </Link>
      </div>
    </Band>
  );
}

// Same outline as the hero band + cover, so the page doesn't jump on load.
function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading project">
      <Band tone="light" innerClassName="pb-14 pt-10 md:pb-20 md:pt-14">
        <Skeleton className="mb-6 h-3 w-24" />
        <Skeleton className="h-[clamp(2.25rem,9vw,8.5rem)] w-3/4" />
        <Skeleton className="mt-6 h-5 w-1/2" />
        <div className="mt-10 flex gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-24" />
        </div>
      </Band>
      <Skeleton className="aspect-[4/3] w-full md:aspect-[21/9]" />
    </div>
  );
}
