// /about: header → split band (portrait + name, long bio, quick facts,
// CV/Contact buttons) → grayscale photo strip → black CTA.
// Mobile: portrait above the text. Empty/TODO fields are skipped.
import { Link } from 'react-router-dom';
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import FadeUp from '../components/FadeUp.jsx';
import GrayscaleImage, { HOVER_COLOR } from '../components/GrayscaleImage.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getEducation, getExperience, getProfile } from '../services/api.js';
import { hasText } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.about;

const loadAbout = () =>
  Promise.all([getProfile(), getExperience(), getEducation()]).then(([profile, experience, education]) => ({
    profile,
    experience,
    education,
  }));

export default function About() {
  const state = useFetch(loadAbout);

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      {/* Split band: edge-to-edge portrait, so no padded Band container */}
      <section aria-labelledby="about-name" className="bg-paper">
        <div className="mx-auto grid max-w-screen-2xl md:grid-cols-2">
          <GrayscaleImage
            src={t.portrait.src}
            alt={t.portrait.alt}
            className="aspect-[4/5] w-full md:aspect-auto md:min-h-[42rem]"
          />
          <div className="px-6 py-14 md:px-10 md:py-20 lg:px-16">
            <DataBoundary state={state} isEmpty={(d) => !d?.profile} skeleton={<SplitSkeleton />}>
              {(data) => <AboutText {...data} />}
            </DataBoundary>
          </div>
        </div>
      </section>

      {t.photoStrip.length > 0 && <PhotoStrip photos={t.photoStrip} />}

      <CtaBand {...t.cta} />
    </>
  );
}

function AboutText({ profile, experience, education }) {
  const name = [profile.firstName, profile.lastName].filter(hasText).join(' ');
  // Blank lines in longBio become separate paragraphs.
  const paragraphs = hasText(profile.longBio) ? profile.longBio.split(/\n\s*\n/).filter(hasText) : [];
  const current = experience.find((e) => e.current);
  const latestDegree = education[0]?.degree;

  // Only facts that actually have a value are listed.
  const facts = [
    { key: 'location', label: t.facts.location, value: profile.location },
    {
      key: 'email',
      label: t.facts.email,
      value: profile.email,
      href: hasText(profile.email) ? `mailto:${profile.email}` : null,
    },
    { key: 'current', label: t.facts.current, value: current ? t.currentRole(current) : '' },
    { key: 'education', label: t.facts.education, value: latestDegree },
  ].filter((f) => hasText(f.value));

  return (
    <FadeUp>
      <p className="label mb-6 text-muted">{t.splitLabel}</p>
      <h2
        id="about-name"
        className="font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-display"
      >
        {name}
      </h2>

      {paragraphs.length > 0 && (
        <div className="mt-8 flex max-w-[65ch] flex-col gap-5 text-base leading-relaxed md:text-lg">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      {facts.length > 0 && (
        <section aria-labelledby="facts-heading" className="mt-12">
          <h3 id="facts-heading" className="sr-only">
            {t.factsHeading}
          </h3>
          <dl className="border-t border-rule">
            {facts.map((fact) => (
              <div key={fact.key} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-3 sm:gap-6">
                <dt className="label text-muted">{fact.label}</dt>
                <dd className="break-words text-sm sm:col-span-2 md:text-base">
                  {fact.href ? (
                    <a href={fact.href} className="border-b border-ink pb-0.5 hover:border-muted hover:text-muted">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-8">
        <Button as="a" href={t.buttons.cv.href} download>
          {t.buttons.cv.label}
        </Button>
        <Button as={Link} to={t.buttons.contact.to} variant="link">
          {t.buttons.contact.label}
        </Button>
      </div>
    </FadeUp>
  );
}

function PhotoStrip({ photos }) {
  return (
    <Band tone="light" aria-labelledby="photo-strip-heading" innerClassName="py-12 md:py-20">
      <h2 id="photo-strip-heading" className="sr-only">
        {t.photoStripHeading}
      </h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {photos.map((photo, i) => (
          <FadeUp as="li" key={photo.src} delay={i * 0.05} className="group">
            <GrayscaleImage src={photo.src} alt={photo.alt} className="aspect-[4/5] w-full" imgClassName={HOVER_COLOR} />
          </FadeUp>
        ))}
      </ul>
    </Band>
  );
}

function SplitSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="mb-6 h-3 w-16" />
      <Skeleton className="h-[clamp(2.5rem,6vw,5.5rem)] w-3/4" />
      <div className="mt-8 flex max-w-[65ch] flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-12 flex flex-col gap-6 border-t border-rule pt-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-2/3" />
        ))}
      </div>
    </div>
  );
}
