// Per-page head tags via react-helmet-async. Used on every page.
//   <Seo title="Projects" description="…" />           -> "Projects | Anshika Agarwal"
//   <Seo fullTitle={SITE.homeTitle} jsonLd={person} />  -> exact title + structured data
// Sets: <title>, meta description, canonical, Open Graph, Twitter card,
// optional robots noindex and JSON-LD. `path` defaults to the current route;
// `image` defaults to /og-default.png. URLs are made absolute with SITE.url.
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/siteConfig.js';

const siteUrl = () => SITE.url || window.location.origin;
const absolute = (url) => (/^https?:\/\//.test(url) ? url : `${siteUrl()}${url.startsWith('/') ? '' : '/'}${url}`);

export default function Seo({
  title,
  fullTitle,
  description = SITE.tagline,
  image = SITE.ogImage,
  path,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();
  const pageTitle = fullTitle ?? (title ? `${title} | ${SITE.name}` : SITE.homeTitle);
  const url = absolute(path ?? pathname);
  const imageUrl = absolute(image);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
