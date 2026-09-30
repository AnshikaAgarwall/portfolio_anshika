// schema.org structured data for the Home page (a Person).
import { SITE, SOCIAL_LINKS } from '../data/siteConfig.js';

export function personJsonLd() {
  const sameAs = SOCIAL_LINKS.map((link) => link.href); // only real links (TODO URLs are filtered out)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    jobTitle: SITE.jobTitle,
    email: `mailto:${SITE.email}`,
    url: SITE.url || window.location.origin,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    ...(sameAs.length > 0 && { sameAs }),
  };
}
