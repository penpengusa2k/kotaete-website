#!/bin/bash

# 現在のスクリプトのディレクトリに移動
SCRIPT_DIR="$(dirname "$0")"
cd "$SCRIPT_DIR"

echo "新しいディレクトリ構造を生成します..."

# components ディレクトリ内に既存の AppHeader.vue と AppFooter.vue を確認し、残す
echo "components/ 内の既存ファイルを保持します。"

# layouts ディレクトリ内に既存の default.vue を確認し、残す
echo "layouts/ 内の既存ファイルを保持します。"

# pages ディレクトリは既存のものを利用し、その中に新しいディレクトリを作成
echo "pages/ ディレクトリ内に新しいサブディレクトリを作成します..."
mkdir -p pages/tools
mkdir -p pages/performance

# 新しいトップレベルディレクトリを作成
mkdir -p composables
mkdir -p server/api
mkdir -p types
mkdir -p utils

echo "ダミーコンテンツファイルを生成します..."

# pages/tools/index.vue を作成
cat <<EOF > pages/tools/index.vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-purple-700">
      ツール紹介
    </h1>
    <p class="text-xl text-gray-700 text-center mb-12">
      不労所得構築に役立つITツールやサービスをご紹介します。
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <img src="https://via.placeholder.com/400x250?text=Tool+Image" alt="ツールイメージ" class="w-full h-48 object-cover">
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-2">ツール名 {{ i }}</h2>
          <p class="text-sm text-gray-500 mb-4">カテゴリ: {{ i % 2 == 0 ? '自動化' : 'データ分析' }}</p>
          <p class="text-gray-700 leading-relaxed mb-4">
            このツールは、特定のタスクを自動化し、時間を節約するのに役立ちます。Notion APIとの連携も可能です。
          </p>
          <a href="#" class="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition duration-300" target="_blank" rel="noopener noreferrer">
            詳細を見る &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'ツール紹介',
  meta: [
    { key: 'description', name: 'description', content: '不労所得構築に役立つITツールやサービスを紹介します。' }
  ]
})
</script>
EOF

# pages/performance/index.vue を作成
cat <<EOF > pages/performance/index.vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-green-700">
      不労所得 実績データ
    </h1>
    <p class="text-xl text-gray-700 text-center mb-12">
      ITを駆使した活動による収益とPVの進捗をリアルタイムで公開しています。
    </p>

    <section class="bg-gradient-to-r from-green-50 to-green-100 p-10 rounded-lg shadow-lg text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-6 text-green-700">現在の目標達成状況</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p class="text-xl text-gray-600">総収益</p>
          <p class="text-5xl md:text-6xl font-extrabold text-green-600 mt-2">¥1,234,567</p>
          <p class="text-sm text-gray-500 mt-2">目標: ¥10,000,000</p>
        </div>
        <div>
          <p class="text-xl text-gray-600">月間PV</p>
          <p class="text-5xl md:text-6xl font-extrabold text-green-600 mt-2">98,765</p>
          <p class="text-sm text-gray-500 mt-2">目標: 100,000 PV</p>
        </div>
      </div>
      <p class="text-center text-sm text-gray-500 mt-8">
        ※ これらのデータはダミーであり、Notion連携後に実際のデータを反映します。
      </p>
    </section>

    <section class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">月次レポート概要</h2>
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-4 text-gray-700">2025年5月 月次報告</h3>
        <ul class="list-disc list-inside text-gray-700 mb-6">
          <li>収益: +15%</li>
          <li>PV: +10%</li>
          <li>新しいツールを2つ導入</li>
        </ul>
        <NuxtLink to="#" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
          詳細レポートを見る
        </NuxtLink>
      </div>
      </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '実績データ',
  meta: [
    { key: 'description', name: 'description', content: 'ITを駆使した不労所得の収益・PV実績データを公開しています。' }
  ]
})
</script>
EOF

# ダミーの composables/useNotionApi.ts
cat <<EOF > composables/useNotionApi.ts
// このファイルはNotion API連携時に実装されます。
// 現時点ではダミーまたはプレースホルダーです。
export const useNotionApi = () => {
  const fetchData = async (path: string) => {
    console.log(\`[useNotionApi] Fetching data from: \${path}\`);
    // ここにNotion APIからのデータ取得ロジックを実装します
    return Promise.resolve({ message: \`Data from \${path}\`, data: [] });
  };

  return {
    fetchData,
  };
};
EOF

# ダミーの server/api/articles.ts
cat <<EOF > server/api/articles.ts
// このファイルはNotion API連携時に実装されます。
// 現時点ではダミーまたはプレースホルダーです。
export default defineEventHandler(async (event) => {
  console.log('[server/api/articles] Fetching articles...');
  // ここにNotionデータベースから記事一覧を取得するロジックを実装します
  // 例: const notionClient = new Client({ auth: process.env.NOTION_API_KEY });
  // const response = await notionClient.databases.query({ database_id: 'YOUR_DATABASE_ID' });
  return {
    articles: [
      { id: '1', title: 'ダミー記事1', date: '2025-06-28' },
      { id: '2', title: 'ダミー記事2', date: '2025-06-27' },
    ]
  };
});
EOF

# ダミーの server/api/article/[slug].ts
cat <<EOF > server/api/article/[slug].ts
// このファイルはNotion API連携時に実装されます。
// 現時点ではダミーまたはプレースホルダーです。
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  console.log(\`[server/api/article] Fetching article: \${slug}\`);
  // ここにNotionデータベースから特定の記事を取得するロジックを実装します
  return {
    id: slug,
    title: \`記事タイトル: \${slug}\`,
    content: \`これは \${slug} のダミーコンテンツです。Notion APIから詳細な記事内容を取得します。\`,
    date: '2025-06-28'
  };
});
EOF

# ダミーの types/article.ts
cat <<EOF > types/article.ts
// Notion APIから取得する記事データの型定義の例
export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  // Notion APIのレスポンスに応じて、さらにプロパティを追加
  notionBlocks?: any[]; // Notionのブロックオブジェクト
}

// Notion APIから取得するプロパティの型定義の例 (より詳細な場合)
export interface NotionProperty {
  id: string;
  type: string;
  title?: { title: Array<{ plain_text: string }> }[];
  rich_text?: { rich_text: Array<{ plain_text: string }> }[];
  date?: { date: { start: string } };
  multi_select?: { multi_select: Array<{ name: string }> }[];
  files?: { files: Array<{ file: { url: string } }> }[];
  // ... その他Notionのプロパティタイプ
}
EOF

# ダミーの utils/formatDate.ts
cat <<EOF > utils/formatDate.ts
// 日付フォーマットのユーティリティ関数
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
};
EOF

echo "ディレクトリ構造とダミーコンテンツの生成が完了しました！"
echo "引き続きデザイン作業を進めてください。"
