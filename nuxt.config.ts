import type { RuntimeConfig } from 'nuxt/schema'

import process from 'node:process'

import { ESpiritType } from './types/alcohol.type'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/apollo', '@nuxt/image'],
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
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://m.media-amazon.com',
          crossorigin: '',
        },
      ],
    },
  },
  runtimeConfig: {
    // Variables d'environnement privées
    // apiSecret: process.env.API_SECRET || 'default-secret',

    // Variables d'environnement publiques (accessibles côté client)
    public: {
      gqlHost: process.env.GQL_HOST || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      ngrokHeader: process.env.NUXT_ENV_ADD_NGROK_HEADER,
      amazonTag: process.env.NUXT_PUBLIC_AMAZON_TAG,
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

        const allRoutes: string[] = []
        const langCode = 'fr_FR'

        try {
          const nuxtConfig = (await import('./nuxt.config')).default
          const nuxtRuntimeConfig = (nuxtConfig?.runtimeConfig || {}) as RuntimeConfig

          for (const type of Object.values(ESpiritType) as ESpiritType[]) {
            const routesForType = await getAlcoholRoutes({ type, langCode }, nuxtRuntimeConfig, { removeBaseUrl: true })
            allRoutes.push(...routesForType)
          }
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
