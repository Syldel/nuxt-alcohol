import type { RuntimeConfig } from 'nuxt/schema'

import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/apollo'],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@use "@/assets/styles/global" as *;`,
        },
      },
    },
  },
  css: ['~/assets/styles/fonts.css'],
  runtimeConfig: {
    // Variables d'environnement privées
    // apiSecret: process.env.API_SECRET || 'default-secret',

    // Variables d'environnement publiques (accessibles côté client)
    public: {
      gqlHost: process.env.GQL_HOST || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      ngrokHeader: process.env.NUXT_ENV_ADD_NGROK_HEADER,
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GQL_HOST || '',
        httpLinkOptions: {
          headers: process.env.NUXT_ENV_ADD_NGROK_HEADER === 'true'
            ? { 'ngrok-skip-browser-warning': 'true' }
            : {},
        },
      },
    },
  },
  nitro: {
    hooks: {
      'prerender:routes': async (routes) => {
        const { getAlcoholRoutes, generateUniqueParentUrls } = await import('./utils/getRoutes')

        let allRoutes: string[] = []

        const type = 'whisky'
        const langCode = 'fr_FR'

        try {
          const nuxtConfig = (await import('./nuxt.config')).default
          const nuxtRuntimeConfig = (nuxtConfig?.runtimeConfig || {}) as RuntimeConfig

          allRoutes = await getAlcoholRoutes({ type, langCode }, nuxtRuntimeConfig, { removeBaseUrl: true })
        }
        catch (error) {
          console.error('Error generating routes for pre-rendering:', error)
        }

        if (allRoutes.length) {
          for (const route of generateUniqueParentUrls(allRoutes)) {
            routes.add(route)
          }
        }
      },
    },
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt', '/alcools'],
    },
  },
})
