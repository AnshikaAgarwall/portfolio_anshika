// /skills: header → black "EXPERT IN" band (expert skills as huge words,
// thin rules between; hovering one dims the others) → light "ALSO WORKING
// WITH" band (remaining skills grouped by category, in data order, empty
// groups hidden) → black CTA. No bars or ratings.
import Band from '../components/Band.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FadeUp from '../components/FadeUp.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import Tag from '../components/Tag.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getSkills } from '../services/api.js';
import { hasText } from '../utils/content.js';
import { slugify } from '../utils/slugify.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.skills;

const usable = (skills) => (skills ?? []).filter((s) => hasText(s.label ?? s.name));
const labelOf = (s) => s.label ?? s.name;

export default function Skills() {
  const state = useFetch(getSkills);
  const expert = (skills) => usable(skills).filter((s) => s.isExpert);
  const others = (skills) => usable(skills).filter((s) => !s.isExpert);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      {/* Expert in */}
      <Band tone="dark" aria-labelledby="expert-heading" innerClassName="py-16 md:py-24">
        <h2 id="expert-heading" className="label mb-10 text-paper/60">
          {t.expertHeading}
        </h2>
        <DataBoundary
          state={state}
          tone="dark"
          empty={t.empty}
          isEmpty={(skills) => expert(skills).length === 0}
          skeleton={<ExpertSkeleton />}
        >
          {(skills) => (
            <ul className="group/list border-t border-paper/20">
              {expert(skills).map((skill) => (
                <FadeUp
                  as="li"
                  key={skill.id}
                  className="break-words border-b border-paper/20 py-3 font-heading text-[clamp(2rem,11vw,9rem)] font-extrabold uppercase leading-[0.95] tracking-display transition-opacity duration-300 md:py-4 [@media(hover:hover)]:group-hover/list:opacity-40 [@media(hover:hover)]:hover:!opacity-100"
                >
                  {labelOf(skill)}
                </FadeUp>
              ))}
            </ul>
          )}
        </DataBoundary>
      </Band>

      {/* Also working with */}
      <Band tone="light" aria-labelledby="other-heading" innerClassName="py-16 md:py-24">
        <h2 id="other-heading" className="label mb-10">
          {t.otherHeading}
        </h2>
        <DataBoundary
          state={state}
          empty={t.empty}
          isEmpty={(skills) => others(skills).length === 0}
          skeleton={<GroupsSkeleton />}
        >
          {(skills) => <SkillGroups skills={others(skills)} />}
        </DataBoundary>
      </Band>

      <CtaBand {...t.cta} />
    </>
  );
}

// Categories in the order they first appear in the data; empty ones never appear.
function SkillGroups({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category).filter(hasText))];

  return (
    <div className="grid gap-x-10 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const id = `group-${slugify(category)}`;
        return (
          <FadeUp as="section" key={category} aria-labelledby={id} className="border-b border-rule py-8">
            <h3 id={id} className="label mb-5 text-muted">
              {category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === category)
                .map((s) => (
                  <li key={s.id}>
                    <Tag>{labelOf(s)}</Tag>
                  </li>
                ))}
            </ul>
          </FadeUp>
        );
      })}
    </div>
  );
}

function ExpertSkeleton() {
  return (
    <div role="status" aria-label="Loading skills" className="border-t border-paper/20">
      {['w-3/4', 'w-2/3', 'w-1/2', 'w-3/5'].map((w) => (
        <div key={w} className="border-b border-paper/20 py-3 md:py-4">
          <Skeleton tone="dark" className={`h-[clamp(2rem,11vw,9rem)] ${w}`} />
        </div>
      ))}
    </div>
  );
}

function GroupsSkeleton() {
  return (
    <div role="status" aria-label="Loading skills" className="grid gap-x-10 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="border-b border-rule py-8">
          <Skeleton className="mb-5 h-3 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
