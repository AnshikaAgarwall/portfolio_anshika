// Black closing band: giant "LET'S TALK", the email from the profile as a
// large underline mailto link, then "Copy email" and "Contact" buttons
// (stacked full-width on mobile, side by side from sm up; 44px+ tall).
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import LineIcon from '../components/icons/LineIcon.jsx';
import { useToast } from '../components/Toast.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import { Skeleton } from '../components/states/LoadingState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getProfile } from '../services/api.js';
import { isFilled } from '../utils/content.js';
import { homeContent } from '../data/homeContent.js';

const c = homeContent.contact;

export default function ContactStrip() {
  const state = useFetch(getProfile);
  const toast = useToast();

  const copy = (email) =>
    navigator.clipboard
      .writeText(email)
      .then(() => toast.success(c.copied))
      .catch(() => toast.error(c.copyFailed));

  return (
    <section aria-labelledby="contact-heading" className="surface-dark border-b border-paper/20 bg-ink text-paper">
      <div className="mx-auto max-w-screen-2xl px-6 py-20 md:px-10 md:py-28">
        <p className="label mb-6 text-paper/60">{c.label}</p>
        <h2
          id="contact-heading"
          className="whitespace-nowrap font-heading text-[clamp(3.25rem,15vw,13rem)] font-extrabold uppercase leading-[0.85] tracking-display"
        >
          {c.heading}
        </h2>

        <div className="mt-10 md:mt-14">
          <DataBoundary
            state={state}
            tone="dark"
            isEmpty={(p) => !isFilled(p?.email)}
            skeleton={<Skeleton tone="dark" className="h-8 w-72 max-w-full" />}
          >
            {(profile) => (
              <>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex min-h-11 max-w-full items-center gap-3 font-heading text-lg font-medium md:text-3xl"
                >
                  <span className="break-all border-b border-paper pb-1 transition-colors group-hover:border-paper/50">
                    {profile.email}
                  </span>
                  <LineIcon
                    name="arrowRight"
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 md:h-7 md:w-7"
                  />
                </a>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  {navigator.clipboard && (
                    <Button onClick={() => copy(profile.email)} variant="outlineInverse" className="w-full sm:w-auto">
                      {c.copyButton}
                    </Button>
                  )}
                  <Button as={Link} to={c.contactButton.to} variant="inverse" className="w-full sm:w-auto">
                    {c.contactButton.label}
                  </Button>
                </div>
              </>
            )}
          </DataBoundary>
        </div>
      </div>
    </section>
  );
}
