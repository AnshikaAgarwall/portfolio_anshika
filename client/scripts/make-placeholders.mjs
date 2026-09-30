// Generates plain grey placeholder photos until real ones exist:
// quick-link thumbnails, the story banner, and one cover per project
// (paths match mockData.js coverImage). Existing files are never overwritten,
// so real photos dropped in later are safe. Run: npm run placeholders
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';

const FILES = [
  ['public/images/placeholders/education.jpg', 480, 600],
  ['public/images/placeholders/experience.jpg', 480, 600],
  ['public/images/placeholders/projects.jpg', 480, 600],
  ['public/images/placeholders/story.jpg', 1200, 1500],
  ['public/images/placeholders/about-portrait.jpg', 1200, 1500],
  ['public/images/placeholders/strip-1.jpg', 800, 1000],
  ['public/images/placeholders/strip-2.jpg', 800, 1000],
  ['public/images/placeholders/strip-3.jpg', 800, 1000],
  ['public/images/placeholders/strip-4.jpg', 800, 1000],
  ['public/images/projects/college-grievance-portal.jpg', 800, 1000],
  ['public/images/projects/student-management-system.jpg', 800, 1000],
  ['public/images/projects/lumiansh.jpg', 800, 1000],
];

// Soft vertical grey gradient (brand "rule" to "muted" greys).
const svg = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#D0D0CE"/><stop offset="1" stop-color="#9A9A98"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;

for (const [path, w, h] of FILES) {
  try {
    await access(path);
    console.log(`skip (exists) ${path}`);
    continue;
  } catch {
    /* file missing: create it */
  }
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg(w, h))).jpeg({ quality: 70 }).toFile(path);
  console.log(`created ${path}`);
}
