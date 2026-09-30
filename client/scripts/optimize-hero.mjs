// One-off build helper: turns the original 5.5 MB hero cutout into web-ready
// files in public/images/. Trims the empty transparent border, then writes
// WebP at three widths (for srcset) and one palette-compressed PNG fallback.
// Run with: npm run optimize:hero
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Source photo lives outside public/ so the 5.5 MB original never ships.
const INPUT = 'assets-src/anshika-cutout.png';
const OUT_DIR = 'public/images';
const NAME = 'anshika-cutout';
const WEBP_WIDTHS = [480, 800, 1200];
const PNG_WIDTH = 800;

await mkdir(OUT_DIR, { recursive: true });

// Trim transparent edges once, keep the result in memory.
const trimmed = await sharp(INPUT).trim({ threshold: 1 }).toBuffer();
const { width, height } = await sharp(trimmed).metadata();
console.log(`trimmed source: ${width}x${height}`);

for (const w of WEBP_WIDTHS) {
  const info = await sharp(trimmed)
    .resize({ width: w })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT_DIR}/${NAME}-${w}.webp`);
  console.log(`${NAME}-${w}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

const png = await sharp(trimmed)
  .resize({ width: PNG_WIDTH })
  .png({ palette: true, quality: 85, compressionLevel: 9 })
  .toFile(`${OUT_DIR}/${NAME}.png`);
console.log(`${NAME}.png  ${png.width}x${png.height}  ${(png.size / 1024).toFixed(0)} KB`);
