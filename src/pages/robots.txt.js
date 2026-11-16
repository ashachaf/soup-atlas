import { abs } from '../lib/data.js';

// Crawlers only read robots.txt at the root of a domain, so this takes effect once the site
// has its own domain. On github.io, submit the sitemap in Google Search Console instead.
export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
