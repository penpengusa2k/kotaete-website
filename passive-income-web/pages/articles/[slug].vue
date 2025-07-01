<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center py-16 text-neutral-dark text-xl">
      <p>挑戦の記録を読み込んでいます...</p>
      <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-center py-16 text-danger text-xl">
      <p>記録の読み込みに失敗しました。</p>
      <p class="text-sm text-danger/80 mt-2">エラー: {{ error.message }}</p>
      <NuxtLink to="/articles" class="text-primary hover:text-primary-dark mt-4 inline-block">&larr; 記録一覧へ戻る</NuxtLink>
    </div>
    <div v-else-if="article" class="max-w-3xl mx-auto">
      <article class="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8">
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-darkest mb-4">{{ article.title }}</h1>
        <p class="text-lg text-neutral-dark/80 mb-6">{{ article.description }}</p>

        <div class="text-neutral-dark/70 text-sm flex items-center space-x-4 border-t border-b border-neutral-light py-3 mb-6">
          <span class="flex items-center">
            <span class="material-icons-outlined text-base mr-1.5">calendar_today</span>
            {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
          </span>
          <span class="flex items-center">
            <span class="material-icons-outlined text-base mr-1.5">folder_open</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="catName in article.category"
                :key="catName"
                class="px-2 py-1 bg-neutral-light text-neutral-darkest text-xs font-medium rounded-full"
              >
                {{ catName }}
              </span>
            </div>
          </span>
        </div>

        <div class="prose prose-lg max-w-none text-neutral-darkest leading-relaxed" v-html="article.renderedHtmlContent"></div>
      </article>

      <NuxtLink to="/articles" class="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors duration-200">
        <span class="material-icons-outlined mr-1">arrow_back</span>
        すべての記録に戻る
      </NuxtLink>
    </div>
    <div v-else class="text-center py-16 text-neutral-dark text-xl">
      <p>指定された記録は見つかりませんでした。</p>
      <NuxtLink to="/articles" class="text-primary hover:text-primary-dark mt-4 inline-block">&larr; 記録一覧へ戻る</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const { data: article, pending, error } = await useAsyncData(`article-${slug}`, async () => {
  const res = await $fetch(`/api/article/${slug}`);
  return res;
});

useHead({
  title: article.value?.title ? `${article.value.title}` : '挑戦の記録',
  meta: [
    { name: 'description', content: article.value?.description || 'ITスキルを活用した不労所得への挑戦を記録しています。' }
  ]
});
</script>

<style scoped>
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
</style>
