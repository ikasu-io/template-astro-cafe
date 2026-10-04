// Small helpers around the content: the site settings, opening hours and
// dates, shared by the pages so each one stays mostly markup.
import { getCollection, getEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/data/site.yaml is missing');
  return entry.data;
}

export type Site = Awaited<ReturnType<typeof getSite>>;
export type Day = Site['hours'][number];

/** "07:30" → "7:30" */
export const formatTime = (t: string) => t.replace(/^0/, '');

export const dayHours = (d: Day) => ('closed' in d ? 'Closed' : `${formatTime(d.open)} – ${formatTime(d.close)}`);

/** Consecutive days with the same hours merged: "Tuesday – Friday: 7:30 – 16:00". */
export function groupedHours(hours: Day[], short = false) {
  const name = (d: Day) => (short ? d.day.slice(0, 3) : d.day);
  const groups: { days: string; hours: string }[] = [];
  let start = 0;
  for (let i = 1; i <= hours.length; i++) {
    if (i === hours.length || dayHours(hours[i]) !== dayHours(hours[start])) {
      const first = name(hours[start]);
      const last = name(hours[i - 1]);
      groups.push({ days: first === last ? first : `${first} – ${last}`, hours: dayHours(hours[start]) });
      start = i;
    }
  }
  return groups;
}

export const formatDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

export const formatPrice = (p: number) => `£${p.toFixed(2)}`;

/** Events split into upcoming (soonest first) and past (latest first), as of the build. */
export async function getEvents(now = new Date()) {
  const all = await getCollection('events');
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const upcoming = all.filter((e) => e.data.date >= today).sort((a, b) => +a.data.date - +b.data.date);
  const past = all.filter((e) => e.data.date < today).sort((a, b) => +b.data.date - +a.data.date);
  return { upcoming, past };
}

export async function getPosts() {
  const posts = await getCollection('journal', (p) => !p.data.draft);
  return posts.sort((a, b) => +b.data.date - +a.data.date);
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
