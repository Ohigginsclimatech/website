// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Dominio definitivo del sitio (también está en public/CNAME)
export default defineConfig({
  site: 'https://olivarclima.cl',
  integrations: [react(), sitemap()],
});
