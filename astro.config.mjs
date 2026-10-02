import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jonathanpollack.net',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
