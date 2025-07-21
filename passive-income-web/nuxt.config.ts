export default defineNuxtConfig({
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' }
      ]
    }
  }
})
