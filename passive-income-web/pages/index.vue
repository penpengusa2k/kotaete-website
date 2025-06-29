<template>
  <div class="container mx-auto px-4 py-8">
    <section class="text-center py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
        不労所得への道
        <span class="block text-xl md:text-2xl font-semibold text-gray-700 mt-2">
          IT×??で始める資産形成・FIREへのロードマップ
        </span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        このサイトは、ウェブサイトの広告収入を通じて不労所得を達成するまでの道のりを記録し、その過程をすべて公開します。
        <br class="hidden sm:inline">副業やちょっとしたお小遣い稼ぎ、在宅での収益化を目指す方々に向けて、私が人柱となり、実際に試行錯誤した内容を共有します。
      </p>
      <NuxtLink to="/articles" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
        <span class="material-icons-outlined mr-2">article</span> すべての記事を見る
      </NuxtLink>
    </section>

    <section class="py-12 mb-12">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">このサイトで追求すること</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-blue-500 text-5xl mb-4">analytics</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">リアルな収益報告</h3>
          <p class="text-gray-600 text-sm">広告収入の実績を定期的に公開し、透明性をもって不労所得構築の過程を示します。</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-green-500 text-5xl mb-4">code</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">実践的なIT技術の公開</h3>
          <p class="text-gray-600 text-sm">プログラミング、自動化、システム構築の具体的なノウハウを共有。</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-purple-500 text-5xl mb-4">build_circle</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">ツール・アプリ開発の記録</h3>
          <p class="text-gray-600 text-sm">不労所得を加速させるための自作ツールやアプリケーションの開発過程を記録。</p>
        </div>
      </div>
    </section>

    <section class="py-12">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">最新記事</h2>
      
      <div v-if="pending" class="text-center py-8 text-gray-600">
        <p>最新記事を読み込み中...</p>
        <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-600">
        <p>記事の読み込みに失敗しました。</p>
        <p class="text-sm text-red-400 mt-2">エラー: {{ error.message }}</p>
      </div>
      <div v-else-if="latestArticles && latestArticles.length > 0" class="grid grid-cols-1 gap-8 max-w-3xl mx-auto"> <NuxtLink
          v-for="article in latestArticles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row group" style="text-decoration: none;"
        >
          <div class="w-full h-48 md:w-1/3 md:h-auto flex-shrink-0"> <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" >
          </div>
          <div class="p-6 flex-grow md:w-2/3"> <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">{{ article.title }}</h3>
            <div class="text-gray-500 text-sm mb-3 flex items-center space-x-3">
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1">calendar_today</span>
                {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
              </span>
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1">category</span>
                <div class="flex flex-wrap gap-1">
                  <button
                    v-for="catName in article.category"
                    :key="catName"
                    @click.prevent="goToCategoryPage(catName)"
                    class="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg hover:bg-blue-200 hover:text-blue-900 transition-colors duration-200 cursor-pointer"
                  >
                    {{ catName }}
                  </button>
                </div>
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ article.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-8 text-gray-600">
        <p>現在、表示できる最新記事はありません。</p>
      </div>

      <div class="text-center mt-10">
        <NuxtLink to="/articles" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          すべての記事を見る
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { data: articlesData, pending, error } = await useAsyncData(
  'latest-articles-homepage',
  async () => {
    const res = await $fetch('/api/articles');
    if (res && Array.isArray(res)) {
      return res.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    }
    return [];
  }
);

const latestArticles = computed(() => {
  if (articlesData.value && Array.isArray(articlesData.value)) {
    return articlesData.value.slice(0, 3);
  }
  return [];
});

const goToCategoryPage = (catName) => {
  router.push({ path: '/articles', query: { category: catName } });
};

useHead({
  title: '不労所得への道 | ITスキル×副業で始める資産形成・FIREへのロードマップ',
  meta: [
    { name: 'description', content: 'ITスキルを活用した不労所得構築に特化した情報サイト。副業、自動化、Webサイト収益化、FIREなどの実践的なノウハウと過程を全て公開します。' }
  ]
})
</script>

<style scoped>
/* 今は特になし */
</style>
