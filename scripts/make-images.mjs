// Builds the site icon and the social share image from the doodle drawings and brand.json.
// Run after changing the brand name, colors or drawings:  node scripts/make-images.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const brand = JSON.parse(readFileSync('src/data/brand.json', 'utf8'));
const doodles = readFileSync('src/components/Doodles.astro', 'utf8');
const defs = doodles.match(/<defs>([\s\S]*?)<\/defs>/)[1];
const outline = brand.doodles.outline;
const { bg, ink, muted, accent } = brand.colors;

const use = (id, x, y, size, rot = 0) =>
  `<use href="#d-${id}" transform="translate(${x} ${y}) rotate(${rot} ${size / 2} ${size / 2}) scale(${size / 64})" />`;

// Site icon: the soup bowl on a light tile.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="${outline}">
  <defs>${defs}</defs>
  <rect width="64" height="64" rx="14" fill="${bg}" />
  ${use('bowl', 4, 6, 56)}
</svg>`;
writeFileSync('public/favicon.svg', icon);
await sharp(Buffer.from(icon), { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');

// Share image, 1200x630: name and tagline in the middle, ingredients around the edges.
const ring = [
  ['carrot', 60, 40, 150, -15], ['drumstick', 980, 30, 160, 20], ['herb', 40, 420, 150, 10],
  ['lemon', 1010, 430, 140, -10], ['onion', 250, 470, 120, 15], ['chili', 830, 480, 120, -20],
  ['mushroom', 270, 30, 110, 10], ['garlic', 820, 50, 110, -10], ['star', 560, 500, 100, 15],
];
const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" color="${outline}">
  <defs>${defs}</defs>
  <rect width="1200" height="630" fill="${bg}" />
  ${ring.map(([id, x, y, s, r]) => use(id, x, y, s, r)).join('\n  ')}
  ${use('bowl', 540, 110, 120)}
  <text x="600" y="345" text-anchor="middle" direction="rtl" font-family="Arial Hebrew, SF Hebrew, sans-serif" font-weight="700" font-size="96" fill="${ink}">${brand.name}</text>
  <text x="600" y="420" text-anchor="middle" direction="rtl" font-family="Arial Hebrew, SF Hebrew, sans-serif" font-size="34" fill="${muted}">${brand.tagline}</text>
  <rect x="520" y="445" width="160" height="6" rx="3" fill="${accent}" />
</svg>`;
await sharp(Buffer.from(share)).png().toFile('public/og-image.png');
console.log('Wrote public/favicon.svg, public/apple-touch-icon.png, public/og-image.png');
