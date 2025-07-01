<template>
  <div class="container mx-auto px-4 py-8">
    <section class="text-center py-16 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg shadow-lg mb-12 dark:from-neutral-darkest/20 dark:to-neutral-dark/20">
      <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-darkest dark:text-neutral-lightest leading-tight mb-4 tracking-tight">
        ITスキルで、不労所得を創造する。
        <span class="block text-xl md:text-2xl font-semibold text-neutral-dark dark:text-neutral-light mt-3">
          現役エンジニアが挑戦する、資産形成へのリアルな道のり
        </span>
      </h1>
      <p class="text-lg md:text-xl text-neutral-dark/80 dark:text-neutral-light/80 mb-8 max-w-3xl mx-auto">
        このサイトは、プログラミングや自動化ツールを駆使して「不労所得」を生み出す過程を、成功も失敗も包み隠さず記録する実験場です。
        <br class="hidden sm:inline">IT初心者から経験者まで、誰もが再現可能な情報と学びを共有します。
      </p>
      <NuxtLink to="/articles" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 duration-300">
        <span class="material-icons-outlined mr-2">explore</span> さっそく探求を始める
      </NuxtLink>
    </section>

    <section class="py-12 mb-12">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest dark:text-neutral-lightest mb-10">このサイトの3つの柱</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-neutral-dark shadow-md p-8 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <span class="material-icons-outlined text-secondary text-5xl mb-4">bar_chart</span>
          <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-2">透明性のある実績公開</h3>
          <p class="text-neutral-dark/80 dark:text-neutral-light/80 text-sm">ウェブサイトのPV数や広告収益など、リアルなデータを毎月公開。良い時も悪い時も、すべてが学びの材料です。</p>
        </div>
        <div class="bg-white dark:bg-neutral-dark shadow-md p-8 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <span class="material-icons-outlined text-primary text-5xl mb-4">code_blocks</span>
          <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-2">実践的な技術ノウハウ</h3>
          <p class="text-neutral-dark/80 dark:text-neutral-light/80 text-sm">Webサイト構築、自動化ツール開発、実際に使用している技術やコードを具体的に解説します。</p>
        </div>
        <div class="bg-white dark:bg-neutral-dark shadow-md p-8 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <span class="material-icons-outlined text-accent text-5xl mb-4">construction</span>
          <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-2">自作ツール開発記</h3>
          <p class="text-neutral-dark/80 dark:text-neutral-light/80 text-sm">収益化を加速させるためのオリジナルツールやアプリケーション開発の全過程を、アイデア出しから実装まで記録します。</p>
        </div>
      </div>
    </section>

    <section class="py-12">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest dark:text-neutral-lightest mb-10">最新の挑戦記録</h2>
      
      <div v-if="pending" class="text-center py-8 text-neutral-dark dark:text-neutral-light">
        <p>最新記事を読み込み中...</p>
        <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      <div v-else-if="error" class="text-center py-8 text-danger">
        <p>記事の読み込みに失敗しました。</p>
        <p class="text-sm text-danger/80 mt-2">エラー: {{ error.message }}</p>
      </div>
      <div v-else-if="latestArticles && latestArticles.length > 0" class="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        <NuxtLink
          v-for="article in latestArticles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="bg-white dark:bg-neutral-dark rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row group" style="text-decoration: none;"
        >
          <div class="w-full md:w-1/3 flex-shrink-0">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-48 object-cover md:h-full md:rounded-l-lg md:rounded-t-none rounded-t-lg"
            >
          </div>
          <div class="p-6 flex-grow md:w-2/3">
            <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">{{ article.title }}</h3>
            <div class="text-neutral-dark/70 dark:text-neutral-light/70 text-sm mb-3 flex items-center space-x-4">
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1.5">calendar_today</span>
                {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
              </span>
              <span class="flex items-center">
                <span class="material-icons-outlined text-base mr-1.5">folder_open</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="catName in article.category"
                    :key="catName"
                    @click.prevent="goToCategoryPage(catName)"
                    class="px-2 py-0.5 bg-neutral-light dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest text-xs font-medium rounded-full hover:bg-primary/20 hover:text-primary-dark transition-colors duration-200 cursor-pointer"
                  >
                    {{ catName }}
                  </button>
                </div>
              </span>
            </div>
            <p class="text-neutral-dark/80 dark:text-neutral-light/80 text-sm mb-4 line-clamp-3">{{ article.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-8 text-neutral-dark dark:text-neutral-light">
        <p>現在、表示できる最新記事はありません。</p>
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/articles" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 duration-300">
          すべての記録を見る
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
  title: '不労所得への道 | ITスキルで始める資産形成',
  meta: [
    { name: 'description', content: 'ITスキルを活用した不労所得構築に特化した情報サイト。副業、自動化、Webサイト収益化、FIREなどの実践的なノウハウと過程を全て公開します。' }
  ]
})
</script>

<style scoped>
/* 今は特になし */
</style>
