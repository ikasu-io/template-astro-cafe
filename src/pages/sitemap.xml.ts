// Sitemap for search engines, written by hand: the fixed pages plus every
// event and journal post.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPosts } from '../lib/site';

export const GET: APIRoute = async ({ site: base }) => {
  const paths = [
    '/', '/menu', '/about', '/events', '/journal', '/visit',
    ...(await getCollection('events')).map((e) => `/events/${e.id}`),
    ...(await getPosts()).map((p) => `/journal/${p.id}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(p, base).href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
