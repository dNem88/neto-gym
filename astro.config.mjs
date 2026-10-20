import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  output: 'static',
  site: 'https://website.com',

  adapter: cloudflare(),  
  // Uncomment for deployment

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),

  integrations: [
    react(),
    icon(),
    markdoc(),
    keystatic({
      configFile: 'keystatic.config.ts',
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/privacy-policy') &&
        !page.includes('/cookie-policy') &&
        !page.includes('/excluzivna-oferta'),
    }),
  ],
});