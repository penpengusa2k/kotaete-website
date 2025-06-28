<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">記事一覧</h1>
    <p class="text-lg text-gray-600 mb-10">
      不労所得構築に関する最新の知見や実践的なノウハウをお届けします。
      新しい記事を随時追加していきますので、ぜひ定期的にチェックしてください。
    </p>

    <section class="py-6">
      <div v-if="pending" class="text-center py-16 text-gray-600 text-xl">
        <p>記事を読み込み中...</p>
        <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
      </div>
      <div v-else-if="error" class="text-center py-16 text-red-600 text-xl">
        <p>記事の読み込みに失敗しました。</p>
        <p class="text-sm text-red-400 mt-2">エラー: {{ error.message }}</p>
      </div>
      <div v-else-if="articles && articles.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="article in articles" :key="article.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{{ article.title }}</h3>
            <div class="text-gray-500 text-sm mb-3 flex items-center space-x-3">
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1">calendar_today</span>
                {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
              </span>
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1">category</span>
                <div class="flex flex-wrap gap-1"> <span
                    v-for="catName in article.category"
                    :key="catName"
                    class="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg"
                  >
                    {{ catName }}
                  </span>
                </div>
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ article.description }}</p>
            <NuxtLink :to="`/articles/${article.slug}`" class="text-blue-600 hover:text-blue-800 font-medium text-sm">続きを読む &rarr;</NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16 text-gray-600 text-xl">
        <p>現在、公開されている記事はありません。</p>
        <p class="text-base mt-2">Notionデータベースに記事を追加し、「Published」にチェックを入れてください。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// useAsyncDataでサーバーサイドAPIから記事データを取得
// 'articles-list' はデータのユニークなキー
const { data: articles, pending, error } = await useAsyncData('articles-list', () =>
  $fetch('/api/articles') // 作成したサーバーサイドルートのエンドポイント
);

useHead({
  title: '記事一覧 - 不労所得への道',
  meta: [
    { name: 'description', content: '不労所得構築に関するプログラミング、自動化、オンラインビジネスなどの記事一覧。' }
  ]
})
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
.material-icons-outlined {
  /* Google Fonts Material Icons を使用している場合 */
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
</style>
