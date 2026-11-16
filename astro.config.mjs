import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH are set by the deploy workflow (for GitHub Pages:
// https://<user>.github.io and /<repo>). Locally both are unset and the site runs at /.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  // The sitemap needs `site`, so it is only written in the deploy build.
  integrations: process.env.SITE_URL ? [sitemap({ filter: (page) => !page.includes('/404') })] : [],
  server: { port: 4321 },
});
