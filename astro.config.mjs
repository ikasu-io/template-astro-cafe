// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The address the site will be published at; used for canonical URLs,
  // the sitemap, the RSS feed and social previews. Change it to your domain.
  site: 'https://terntide.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
