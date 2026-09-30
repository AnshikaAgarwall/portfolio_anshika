// Product-style project card (like "BEST OF GAZU"): fixed 4:5 grayscale cover
// that turns colour on hover (hover-capable desktop screens only), then title,
// category and a single row of tech tags. The whole card is one link.
// Every text row has a fixed height, so ProjectCardSkeleton matches exactly.
import { Link } from 'react-router-dom';
import GrayscaleImage from './GrayscaleImage.jsx';
import { Skeleton } from './states/LoadingState.jsx';

const COVER = 'aspect-[4/5] w-full';

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <GrayscaleImage
        src={project.coverImage}
        alt={project.coverAlt || project.title}
        className={COVER}
        imgClassName="transition-[filter,transform] duration-500 ease-editorial [@media(hover:hover)_and_(min-width:768px)]:group-hover:scale-[1.03] [@media(hover:hover)_and_(min-width:768px)]:group-hover:grayscale-0"
      />
      <div className="mt-4 flex h-5 items-center justify-between gap-4">
        <h3 className="truncate font-heading text-base font-semibold uppercase tracking-label">{project.title}</h3>
        <span className="label shrink-0 text-muted">{project.year}</span>
      </div>
      <p className="label mt-1 h-5 truncate text-muted">{project.category}</p>
      <ul className="mt-3 flex h-7 flex-wrap gap-2 overflow-hidden" aria-label="Tech stack">
        {project.techStack.map((tech) => (
          <li key={tech} className="border border-rule px-2 py-1 text-micro font-medium uppercase leading-none tracking-label">
            {tech}
          </li>
        ))}
      </ul>
    </Link>
  );
}

// Same box sizes as ProjectCard so the grid doesn't jump when data arrives.
export function ProjectCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className={COVER} />
      <div className="mt-4 flex h-5 items-center">
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="mt-1 flex h-5 items-center">
        <Skeleton className="h-2.5 w-1/3" />
      </div>
      <div className="mt-3 flex h-7 gap-2">
        <Skeleton className="h-full w-16" />
        <Skeleton className="h-full w-12" />
        <Skeleton className="h-full w-14" />
      </div>
    </div>
  );
}
