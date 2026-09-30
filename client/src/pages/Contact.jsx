// /contact: light header ("LET'S TALK") → two columns (stacked on mobile):
// contact details from the profile (email + copy button, phone, location,
// socials; empty/TODO rows hidden) and the contact form.
import Band from '../components/Band.jsx';
import Button from '../components/Button.jsx';
import ContactForm from '../components/ContactForm.jsx';
import FadeUp from '../components/FadeUp.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Seo from '../components/Seo.jsx';
import { useToast } from '../components/Toast.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getProfile } from '../services/api.js';
import { isFilled } from '../utils/content.js';
import { pagesContent } from '../data/pagesContent.js';
import { UI_TEXT } from '../data/siteConfig.js';

const t = pagesContent.contact;
const LINK = 'break-all border-b border-ink pb-0.5 transition-colors hover:border-muted hover:text-muted';

export default function Contact() {
  const state = useFetch(getProfile);
  const email = state.status === 'success' && isFilled(state.data?.email) ? state.data.email : '';

  return (
    <>
      <Seo title={t.seo.title} description={t.seo.description} />
      <PageHeader {...t.header} />

      <Band tone="paper" innerClassName="grid gap-16 py-16 md:grid-cols-12 md:gap-10 md:py-24">
        <FadeUp as="section" aria-labelledby="details-heading" className="md:col-span-5">
          <h2 id="details-heading" className="label mb-8">
            {t.detailsHeading}
          </h2>
          <DataBoundary state={state} isEmpty={(p) => !p} skeleton={<DetailsSkeleton />}>
            {(profile) => <Details profile={profile} />}
          </DataBoundary>
        </FadeUp>

        <FadeUp as="section" aria-labelledby="form-heading" delay={0.1} className="md:col-span-6 md:col-start-7">
          <h2 id="form-heading" className="label mb-8">
            {t.form.heading}
          </h2>
          <ContactForm fallbackEmail={email} />
        </FadeUp>
      </Band>
    </>
  );
}

function Details({ profile }) {
  const toast = useToast();

  const copyEmail = () =>
    navigator.clipboard
      .writeText(profile.email)
      .then(() => toast.success(t.copy.copied))
      .catch(() => toast.error(t.copy.failed));

  const external = (href, label) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {label}
      <span className="sr-only"> {UI_TEXT.newTab}</span>
    </a>
  );

  // Each row only appears when its value is real (not empty, not TODO).
  const rows = [
    isFilled(profile.email) && {
      key: 'email',
      label: t.rows.email,
      value: (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={`mailto:${profile.email}`} className={LINK}>
            {profile.email}
          </a>
          {navigator.clipboard && (
            <Button onClick={copyEmail} variant="outline" size="sm">
              {t.copy.button}
            </Button>
          )}
        </div>
      ),
    },
    isFilled(profile.phone) && {
      key: 'phone',
      label: t.rows.phone,
      value: (
        <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className={LINK}>
          {profile.phone}
        </a>
      ),
    },
    isFilled(profile.location) && { key: 'location', label: t.rows.location, value: profile.location },
    isFilled(profile.socials?.linkedin) && {
      key: 'linkedin',
      label: t.rows.linkedin,
      value: external(profile.socials.linkedin, t.rows.linkedin),
    },
    isFilled(profile.socials?.github) && {
      key: 'github',
      label: t.rows.github,
      value: external(profile.socials.github, t.rows.github),
    },
  ].filter(Boolean);

  return (
    <dl className="border-t border-rule">
      {rows.map((row) => (
        <div key={row.key} className="grid gap-2 border-b border-rule py-5 sm:grid-cols-3 sm:items-center sm:gap-6">
          <dt className="label text-muted">{row.label}</dt>
          <dd className="min-w-0 text-base sm:col-span-2">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading contact details" className="border-t border-rule">
      {['w-3/4', 'w-1/2', 'w-2/3'].map((w) => (
        <div key={w} className="flex items-center gap-6 border-b border-rule py-5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className={`h-4 ${w}`} />
        </div>
      ))}
    </div>
  );
}
