export default defineNuxtConfig({
  modules: [
    '@nuxtjs/google-adsense',
    '@pinia/nuxt'
  ],
  plugins: [
    '~/plugins/persistedstate.client.ts'
  ],
  googleAdsense: {
    id: process.env.NUXT_PUBLIC_GOOGLE_ADSENSE_ID
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      gasApiUrl: process.env.NUXT_PUBLIC_GAS_API_URL || '',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'localhost:3000',
    }
  },
  app: {

    head: {
      title: 'KOTAETE',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Nuxt 3とGoogle Sheetsで作るアンケートアプリ' },
        { name: 'keywords', content: 'アンケート, KOTAETE, Google Sheets, Nuxt.js, 簡単, 無料, フォーム' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' }
      ]
    }
  }
})
