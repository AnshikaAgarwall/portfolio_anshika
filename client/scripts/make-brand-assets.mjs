// Generates brand images from SVG: the default Open Graph image
// (public/og-default.png, 1200x630) and PNG app icons from favicon.svg
// (apple-touch-icon 180, manifest icons 192/512). Run: npm run brand-assets
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const INK = '#0A0A0A';
const LIGHT = '#E9E9E7';

// Monochrome editorial card: small label, rule, giant name, footer line.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${LIGHT}"/>
  <rect width="1200" height="44" fill="${INK}"/>
  <text x="60" y="28" fill="${LIGHT}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="3">OPEN TO INTERNSHIPS &amp; FREELANCE</text>
  <text x="60" y="140" fill="${INK}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="6">FULL-STACK DEVELOPER</text>
  <rect x="60" y="162" width="56" height="2" fill="${INK}"/>
  <text x="54" y="390" fill="${INK}" font-family="'Inter Tight', 'Arial Black', Arial, sans-serif" font-size="150" font-weight="900" letter-spacing="-6">ANSHIKA</text>
  <text x="54" y="530" fill="${INK}" font-family="'Inter Tight', 'Arial Black', Arial, sans-serif" font-size="150" font-weight="900" letter-spacing="-6">AGARWAL</text>
  <text x="1140" y="590" text-anchor="end" fill="${INK}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="4">PORTFOLIO</text>
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og-default.png');
console.log('created public/og-default.png');

const favicon = await readFile('public/favicon.svg');
for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(favicon, { density: 72 * (size / 64) }).resize(size, size).png().toFile(`public/${file}`);
  console.log(`created public/${file}`);
}
