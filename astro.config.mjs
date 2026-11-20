import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jonathanpollack.net',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'rose-pine-dawn', dark: 'rose-pine-moon' }, defaultColor: false },
  },
});
