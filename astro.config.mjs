import { defineConfig } from 'astro/config';

// Set `site` to the real domain before publishing, so canonical URLs and the sitemap are correct.
export default defineConfig({
  server: { port: 4321 },
});
