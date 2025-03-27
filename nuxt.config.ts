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
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt'],
    },
  },
})
