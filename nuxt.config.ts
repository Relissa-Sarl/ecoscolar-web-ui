// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    'nuxt-zod-i18n',
    '@nuxtjs/google-fonts'
  ],
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-CH', name: 'Français', file: 'fr.json' },
      { code: 'it', iso: 'it-CH', name: 'Italiano', file: 'it.json' },
      { code: 'de', iso: 'de-CH', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'fr',
    langDir: '../locales/', // Chemin relatif depuis /app
    strategy: 'prefix_except_default'
  },
  devtools: {
    enabled: true
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    }
  },
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://localhost:5001/api'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
