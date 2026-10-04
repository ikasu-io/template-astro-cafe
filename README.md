# Tern & Tide — a café website built with Astro

> **Tern & Tide is a fictional café.** The town of Port Alder, the people,
> the menu, the events and the photos are all made up. The site, its
> content and its images were generated with AI, and it is maintained with
> [Ikasu](https://ikasu.io), an AI content copilot for static sites.
> Use it as a starting point for your own café, restaurant or bakery.

A complete, ready-to-edit website for a small café: home page with an
"Open now" badge, a menu with dietary filters, about, events, a journal
(blog) and a visit page with opening hours, booking details and a map.

- [Astro](https://astro.build) 7 and [Tailwind CSS](https://tailwindcss.com) 4, nothing else
- Static output, works on any host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, your own server)
- Photos resized and converted to WebP at build time
- Lighthouse 95+ in every category on mobile; works without JavaScript
- Search-engine data for the café and its events (schema.org), sitemap and RSS built in

## Getting started

Needs Node.js 22.12 or newer.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve dist/ locally
```

## Where to change what

Everything you'd normally edit is in plain text files. You never need to
touch a component to change the content.

| To change… | Edit |
|---|---|
| Name, address, phone, email, **opening hours**, a notice bar (e.g. holiday hours) | `src/data/site.yaml` |
| **The menu**: dishes, prices, dietary tags, "sold out" | `src/content/menu/*.yaml` — one file per section; the number in the file name sets the order |
| **Events**: add one, change a date | `src/content/events/*.md` — one file per event |
| **Journal posts** | `src/content/journal/*.md` — one file per post; `draft: true` hides one |
| About and Visit pages, suppliers, FAQ | `src/content/pages/about.md`, `src/content/pages/visit.md` |
| Home page hero, signature dishes, guest quotes | `src/data/home.yaml` |
| **Photos** | `src/assets/images/` — see below |
| Colours and fonts | the `@theme` block at the top of `src/styles/global.css` |
| Your domain (for links in search results and social previews) | `site` in `astro.config.mjs` |

Every file is checked when the site builds (`src/content.config.ts`), so a
typo such as a missing price or a badly written time stops the build with
a message saying which file and which field, instead of producing a broken
page.

### Photos

Content files refer to photos by file name without the extension
(`image: cardamom-bun`). To replace a photo, drop a new file with the same
name into `src/assets/images/` (JPEG, PNG or WebP, ideally no wider than
1600 px) and update its description in `src/data/images.yaml`. To add
one, add the file and a line in `src/data/images.yaml`.

## Licence

The code, content and images are under the [MIT licence](LICENSE); see
[IMAGES.md](IMAGES.md) for where the images come from. The fonts in
`public/fonts/` (Fraunces and Inter) are under the SIL Open Font Licence,
included next to them.
