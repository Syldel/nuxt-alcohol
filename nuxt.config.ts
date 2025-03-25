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
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap',
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
})
