import ING from '../data/ingredients.json';
import META from '../data/meta.json';
import BRAND from '../data/brand.json';

const modules = import.meta.glob('../data/recipes/*.json', { eager: true });
export const recipes = Object.values(modules).map((m) => m.default ?? m);
export { ING, META, BRAND };

// The site may be served from a sub-path (GitHub Pages serves it under /soup-atlas), so every
// internal link goes through link().
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const link = (path) => `${BASE}${path}`;

// Absolute URL for structured data and social tags. Without a configured site (local dev)
// it falls back to the relative link.
const SITE = import.meta.env.SITE;
export const abs = (path) => (SITE ? new URL(link(path), SITE).href : link(path));

// Date used for recipes that have no "published" field of their own.
export const LAUNCH_DATE = '2026-11-16';

/** BreadcrumbList structured data from [name, path] pairs. */
export const breadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

// Fail the build on bad data instead of rendering a broken page.
for (const r of recipes) {
  for (const line of r.ingredients) {
    if (!ING[line.id]) throw new Error(`${r.slug}: unknown ingredient "${line.id}"`);
  }
  for (const slug of [...(r.goesWith ?? []), ...(r.seeAlso ?? [])]) {
    if (!modules[`../data/recipes/${slug}.json`]) throw new Error(`${r.slug}: links to unknown recipe "${slug}"`);
  }
  for (const f of [r.family, ...(r.alsoIn ?? [])]) {
    if (!META.families[f]) throw new Error(`${r.slug}: unknown family "${f}"`);
  }
}

export const bySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]));
export const he = (id) => ING[id].he;
export const roleOf = (line) => line.role ?? 'core';

export const inFamily = (r, family) => r.family === family || (r.alsoIn ?? []).includes(family);
export const familyMembers = (family) => recipes.filter((r) => inFamily(r, family));
export const familyReference = (family) =>
  recipes.find((r) => r.family === family && r.reference) ?? familyMembers(family)[0];

/** Unique ingredient ids of a recipe for the given roles, without pantry staples. */
export function ids(r, roles = ['core', 'optional']) {
  const out = r.ingredients.filter((l) => roles.includes(roleOf(l)) && !ING[l.id].staple).map((l) => l.id);
  return [...new Set(out)];
}
export const coreIds = (r) => ids(r, ['core']);

/**
 * What a recipe adds and drops compared with another one. Only core ingredients count as a
 * difference, and an ingredient the other recipe lists as optional is not a difference.
 */
export function diff(r, ref) {
  const mine = new Set(ids(r));
  const theirs = new Set(ids(ref));
  return {
    added: coreIds(r).filter((x) => !theirs.has(x)),
    removed: coreIds(ref).filter((x) => !mine.has(x)),
  };
}

export const topFlavors = (r) =>
  Object.entries(r.flavor)
    .filter(([, v]) => v >= 2)
    .sort((x, y) => y[1] - x[1])
    .map(([k]) => k);

export const totalTime = (r) => r.prep + r.cook;
export function fmtTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} דק'`;
  const hours = h === 1 ? 'שעה' : h === 2 ? 'שעתיים' : `${h} שעות`;
  return m ? `${hours} ו-${m} דק'` : hours;
}
