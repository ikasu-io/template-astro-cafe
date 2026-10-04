// The journal as an RSS feed, written by hand (no extra package needed).
import type { APIRoute } from 'astro';
import { getPosts, getSite } from '../lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site: base }) => {
  const site = await getSite();
  const posts = await getPosts();
  const items = posts
    .map((p) => {
      const url = new URL(`/journal/${p.id}`, base).href;
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <description>${esc(p.data.summary)}</description>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} journal</title>
    <link>${new URL('/journal', base).href}</link>
    <description>${esc(site.description)}</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
