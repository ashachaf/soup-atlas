import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the deploy workflow (for GitHub Pages:
// https://<user>.github.io and /<repo>). Locally both are unset and the site runs at /.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  server: { port: 4321 },
});
