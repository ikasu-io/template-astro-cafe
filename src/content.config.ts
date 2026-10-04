// Content schemas. Every editable piece of the site lives in a YAML or
// Markdown file under src/data/ or src/content/, and is checked against
// these schemas when the site builds, so a typo in a price or a missing
// date fails the build with a clear message instead of a broken page.
//
// Images are referenced by their file name in src/assets/images/, without
// the extension (e.g. `image: cardamom-bun`); see src/lib/images.ts.
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const time = z.string().regex(/^\d{2}:\d{2}$/, 'Use 24-hour time like "07:30"');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/data' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    address: z.object({ street: z.string(), town: z.string() }),
    phone: z.string(),
    email: z.string(),
    timezone: z.string(),
    hours: z
      .array(
        z.union([
          z.object({ day: z.enum(days), closed: z.literal(true) }),
          z.object({ day: z.enum(days), open: time, close: time }),
        ]),
      )
      .length(7, 'List all seven days, Monday to Sunday'),
    supperClub: z.string(),
    notice: z.string().optional(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/data' }),
  schema: z.object({
    hero: z.object({ image: z.string(), intro: z.string() }),
    welcome: z.object({ title: z.string(), text: z.string() }),
    signatures: z.array(z.object({ name: z.string(), description: z.string(), image: z.string() })),
    quotes: z.array(z.object({ text: z.string(), author: z.string() })),
  }),
});

const tag = z.enum(['v', 'vg', 'gf']);

// One file per menu section; the number in the file name sets the order.
const menu = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/menu' }),
  schema: z.object({
    title: z.string(),
    note: z.string().optional(),
    image: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().nonnegative(),
        tags: z.array(tag).default([]),
        soldOut: z.boolean().default(false),
      }),
    ),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    time,
    endTime: time.optional(),
    price: z.string(),
    image: z.string(),
    summary: z.string(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    summary: z.string(),
    image: z.string(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    suppliers: z.array(z.object({ name: z.string(), what: z.string(), text: z.string() })).optional(),
    privateHire: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

// Alt text for every photo, keyed by file name (src/data/images.yaml).
const images = defineCollection({
  loader: file('src/data/images.yaml'),
  schema: z.object({ alt: z.string() }),
});

export const collections = { site, home, menu, events, journal, pages, images };
