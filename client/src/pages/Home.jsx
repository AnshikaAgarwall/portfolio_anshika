// Home page (/): the Hero followed by the full-width bands, in reference order.
import Hero from '../sections/Hero.jsx';
import QuickLinks from '../sections/QuickLinks.jsx';
import StoryBanner from '../sections/StoryBanner.jsx';
import StatsStrip from '../sections/StatsStrip.jsx';
import FeaturedProjects from '../sections/FeaturedProjects.jsx';
import ContactStrip from '../sections/ContactStrip.jsx';
import Seo from '../components/Seo.jsx';
import { SITE } from '../data/siteConfig.js';
import { personJsonLd } from '../utils/seo.js';

export default function Home() {
  return (
    <>
      <Seo fullTitle={SITE.homeTitle} path="/" jsonLd={personJsonLd()} />
      <Hero />
      <QuickLinks />
      <StoryBanner />
      <StatsStrip />
      <FeaturedProjects />
      <ContactStrip />
    </>
  );
}
