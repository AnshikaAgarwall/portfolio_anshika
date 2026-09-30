// Build step: writes public/sitemap.xml (enabled pages from siteConfig +
// every visible project) and public/robots.txt (with the Sitemap line).
// The site URL is VITE_SITE_URL, read the same way Vite does (.env files +
// process env). Without it, robots.txt allows all and the sitemap is skipped.
import { writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
// loadEnv merges .env files with real environment variables.
const env = loadEnv(mode, process.cwd(), 'VITE_');
const base = (env.VITE_SITE_URL || '').replace(/\/+$/, '');

// Imported after env is loaded (siteConfig reads it optionally).
const { PAGES, isPageEnabled } = await import('../src/data/siteConfig.js');
const { projects } = await import('../src/data/mockData.js');

if (!base) {
  await writeFile('public/robots.txt', 'User-agent: *\nAllow: /\n');
  console.warn('sitemap: skipped (set VITE_SITE_URL in .env to generate public/sitemap.xml)');
  process.exit(0);
}

const paths = [
  ...PAGES.filter((p) => p.enabled).map((p) => p.path),
  ...(isPageEnabled('projects') ? projects.filter((p) => p.isVisible).map((p) => `/projects/${p.slug}`) : []),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}
</urlset>
`;

await writeFile('public/sitemap.xml', xml);
await writeFile('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap: wrote ${paths.length} URLs to public/sitemap.xml`);
