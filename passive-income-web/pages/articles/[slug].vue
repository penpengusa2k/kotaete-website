<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center py-16 text-gray-600 text-xl">
      <p>記事を読み込み中...</p>
      <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-center py-16 text-red-600 text-xl">
      <p>記事の読み込みに失敗しました。</p>
      <p class="text-sm text-red-400 mt-2">エラー: {{ error.message }}</p>
      <NuxtLink to="/articles" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">&larr; 記事一覧へ戻る</NuxtLink>
    </div>
    <div v-else-if="article">
      <div class="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <img :src="article.image" :alt="article.title" class="w-full h-64 object-cover rounded-lg shadow-md mb-6">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{{ article.title }}</h1>
        <p class="text-lg text-gray-600 mb-4">{{ article.description }}</p>
        <div class="text-gray-500 text-sm flex items-center space-x-4">
          <span class="flex items-center">
            <span class="material-icons-outlined text-base mr-1">calendar_today</span>
            {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
          </span>
          <span class="flex items-center">
            <span class="material-icons-outlined text-base mr-1">category</span>
            <div class="flex flex-wrap gap-2"> <span
                v-for="catName in article.category"
                :key="catName"
                class="px-1 py-0.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg"
              >
                {{ catName }}
              </span>
            </div>
          </span>
        </div>
      </div>

      <div class="prose lg:prose-lg max-w-none text-gray-800 leading-relaxed bg-white p-6 shadow-lg rounded-lg">
        <div v-html="article.renderedHtmlContent">
          </div>
      </div>

      <NuxtLink to="/articles" class="text-blue-600 hover:text-blue-800 mt-12 inline-block font-medium">&larr; 記事一覧へ戻る</NuxtLink>
    </div>
    <div v-else class="text-center py-16 text-gray-600 text-xl">
      <p>指定された記事は見つかりませんでした。</p>
      <NuxtLink to="/articles" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">&larr; 記事一覧へ戻る</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { compileMarkdown } from '~/utils/markdown';

const route = useRoute();
const slug = route.params.slug;

const { data: article, pending, error } = await useAsyncData(`article-${slug}`, async () => {
  const res = await $fetch(`/api/article/${slug}`);
  return res;
});

if (article.value && article.value.contentBlocks) {
  const notion = new Client({ auth: useRuntimeConfig().notionSecret });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const mdblocks = await n2m.blocksToMarkdown(article.value.contentBlocks);
  const mdString = n2m.toMarkdownString(mdblocks);

  article.value.renderedHtmlContent = await compileMarkdown(mdString.parent);
} else {
  // article.value が null の場合や contentBlocks がない場合、ここで初期化
  // ただし、useAsyncData の戻り値が null になる可能性も考慮し、
  // template側で article.value が存在しない場合のハンドリングも重要
  if (article.value) { // article.value が null でない場合のみ処理
    article.value.renderedHtmlContent = '<p>記事本文の読み込みに失敗しました。</p>';
  }
}

useHead({
  title: article.value?.title ? `${article.value.title} - 不労所得への道` : '記事詳細 - 不労所得への道',
  meta: [
    { name: 'description', content: article.value?.description || '不労所得構築に関する記事の詳細ページです。' }
  ]
});
</script>

<style scoped>
/* Google Fonts Material Icons を使用している場合 */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

.material-icons-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}

/* proseクラスはtypographyプラグインが自動的にスタイルを適用するため、
   ここで個別にh1, pなどを書く必要は通常ありません。
   ここでは例として、プロパティ情報の要素に対して直接Tailwindクラスを適用しています。
*/
</style>
