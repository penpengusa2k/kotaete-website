export default defineNuxtConfig({
  modules: [
    // @nuxtjs/google-adsense は審査通過後に使用でOK（下で補足）
    '@pinia/nuxt'
  ],
  plugins: [
    '~/plugins/persistedstate.client.ts'
  ],
  // googleAdsense通過でhereを有効化
  // googleAdsense: {
  //   id: process.env.NUXT_PUBLIC_GOOGLE_ADSENSE_ID
  // },
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
        { hid: 'description', name: 'description', content: 'KOTAETEは、匿名で本音の回答を集められる無料のアンケート作成ツールです。誰にも言えない質問から、みんなのリアルな意見まで、安心して「知りたい」を解決できます。' },
        { name: 'keywords', content: 'アンケート, 匿名, 本音, 無料, フォーム, 作成, 回答, KOTAETE, シンプル, 投票, 意見収集, ウェブフォーム' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' }
      ],
      script: [
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8037790037502671',
          async: true,
          crossorigin: 'anonymous'
        }
      ]
    }
  }
})
