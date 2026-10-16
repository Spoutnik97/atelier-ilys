import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://atelier-ilys.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      // Adds hreflang links between /page and /en/page in the sitemap
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-GB' } },
    }),
  ],
})
