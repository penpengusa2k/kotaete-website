// nuxt.config.ts

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-28',
  css: [
    '~/assets/css/main.css',
  ],
  modules: [
    // `@nuxtjs/google-fonts` は使わないため、ここから削除
  ],
  app: {
    head: {
      link: [
        // マテリアルアイコンのCSSを直接CDNから読み込む (既存)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' },
        // ★ここから追加★ Google Fonts (Inter, Noto Sans JP) を直接CDNから読み込む
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap' },
        // ★ここまで追加★
      ]
    }
  },
  runtimeConfig: {
    // プライベートキー (サーバーサイドでのみ利用可能。クライアントサイドには公開されない)
    notionSecret: process.env.NOTION_SECRET,
    notionArticlesDatabaseId: process.env.NOTION_ARTICLES_DATABASE_ID,
    // 必要であれば、今後ツールデータベースIDも追加する
    // notionToolsDatabaseId: process.env.NOTION_TOOLS_DATABASE_ID,
    public: {
      // ここにクライアントサイドでも利用したい公開情報を記述する
      // 例: baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  // ここに PostCSS の設定を追加します (既存)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // nitro 設定など、その他の設定があればここに追加
})