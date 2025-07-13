// nuxt.config.ts
import axios from 'axios';

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-28',
  css: [
    '~/assets/css/main.css',
  ],
  modules: ['nuxt-og-image'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap' },
      ]
    }
  },
  runtimeConfig: {
    notionSecret: process.env.NOTION_SECRET,
    notionArticlesDatabaseId: process.env.NOTION_ARTICLES_DATABASE_ID,
    vercelApiToken: process.env.VERCEL_API_TOKEN,
    vercelProjectId: process.env.VERCEL_PROJECT_ID,
    public: {
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'https://furoshotoku.net'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
// Nitroの設定
  nitro: {
    // プリレンダリングに関する設定
    prerender: {
      // 事前に生成する静的ページのルート（URLパス）を定義
      // ここにリストされているパスは、ビルド時に静的なHTMLファイルとして生成される
      routes: [
        '/', // トップページ
        '/articles', // 記事一覧ページ
        '/performance', // パフォーマンス関連ページ（例）
        '/about', // 会社概要や自己紹介ページ
        '/contact', // お問い合わせページ
        '/privacy-policy' // プライバシーポリシーページ
      ]
    }
  },
  // Nuxtのライフサイクルフック
  // ビルドプロセス中の特定のタイミングで実行される処理を定義
  hooks: {
    // Nitroのコンフィグが準備される直前に実行される非同期フック
    async 'nitro:config'(nitroConfig) {
      try {
        // 環境に応じてAPIのベースURLを決定
        // 本番環境（production）の場合はvercelにて設定
        const baseURL =
          process.env.NODE_ENV === 'production'
            ? process.env.NUXT_PUBLIC_BASE_URL
            : 'http://localhost:3000';

        // 記事データを非同期で取得
        const { data: articles } = await axios.get(`${baseURL}/api/articles`);

        // performanceページで使用する記事数をruntimeConfigに設定
        if (nitroConfig.runtimeConfig && nitroConfig.runtimeConfig.public) {
          nitroConfig.runtimeConfig.public.articleCount = articles.length;
          console.log(`[Nitro Config] Article Count: ${articles.length}`);
        }

        // 取得した記事データ（articles）を元に、動的な記事ページのルートを生成
        // 各記事のスラッグ（URLの一部になる識別子）を使って '/articles/スラッグ' の形式のパスを作成
        const dynamicRoutes = articles.map((article: any) => `/articles/${article.slug}`);

        // nitroConfig.prerender が存在しない場合、空のオブジェクトで初期化
        nitroConfig.prerender ||= {};
        // nitroConfig.prerender.routes が存在しない場合、空の配列で初期化
        nitroConfig.prerender.routes ||= [];

        // 生成した動的なルートを、既存のプリレンダリングルートの配列に追加
        nitroConfig.prerender.routes.push(...dynamicRoutes);

        // コンソールにプリレンダリングされる動的ルートを出力（デバッグ用）
        console.log('[Prerender routes]', dynamicRoutes);
      } catch (error: any) {
        // APIからの記事データ取得中にエラーが発生した場合の処理
        // エラーメッセージをコンソールに出力
        console.error('🔥 Failed to fetch article routes:', error.message || error);
      }
    }
  }
});
