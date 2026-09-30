// Full-width grey banner (like "NEW SEASON / NEW VIBES"): label, big heading,
// the profile's short bio and an "About me" button on the left; a large
// grayscale photo on the right. On mobile the photo sits above the text.
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import GrayscaleImage from '../components/GrayscaleImage.jsx';
import DataBoundary from '../components/states/DataBoundary.jsx';
import useFetch from '../hooks/useFetch.js';
import { getProfile } from '../services/api.js';
import { homeContent } from '../data/homeContent.js';

const { label, heading, cta, image } = homeContent.story;

export default function StoryBanner() {
  const state = useFetch(getProfile);

  return (
    <section aria-labelledby="story-heading" className="bg-rule">
      <div className="mx-auto grid max-w-screen-2xl md:grid-cols-2">
        {/* Photo: first on mobile, right column on desktop */}
        <GrayscaleImage
          src={image.src}
          alt={image.alt}
          className="aspect-[4/5] w-full md:order-2 md:aspect-auto md:min-h-[36rem]"
        />

        <div className="flex flex-col justify-center px-6 py-14 md:order-1 md:px-10 md:py-20 lg:px-16">
          <p className="label mb-6 text-ink">{label}</p>
          <h2
            id="story-heading"
            className="max-w-lg font-heading text-5xl font-bold uppercase leading-[0.95] tracking-display md:text-6xl lg:text-7xl"
          >
            {heading}
          </h2>

          <div className="mt-6 max-w-sm">
            <DataBoundary state={state} loading={{ variant: 'text', count: 2 }} isEmpty={(p) => !p?.shortBio}>
              {(profile) => <p className="text-base leading-relaxed text-ink">{profile.shortBio}</p>}
            </DataBoundary>
          </div>

          <Button as={Link} to={cta.to} className="mt-10 self-start">
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
