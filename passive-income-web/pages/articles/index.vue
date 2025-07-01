<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-darkest dark:text-neutral-lightest mb-4">挑戦の記録</h1>
    <p class="text-lg text-neutral-dark/80 dark:text-neutral-light/80 mb-10">
      不労所得を構築するための試行錯誤の全記録です。
      <br class="hidden sm:inline">新しい挑戦は随時追加されていきます。
    </p>

    <div class="md:grid md:grid-cols-4 md:gap-8">
      <div class="md:col-span-3">
        <section class="py-6">
          <div v-if="pending" class="text-center py-16 text-neutral-dark dark:text-neutral-light text-xl">
            <p>記録を読み込んでいます...</p>
            <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="error" class="text-center py-16 text-danger text-xl">
            <p>記録の読み込みに失敗しました。</p>
            <p class="text-sm text-danger/80 mt-2">エラー: {{ error.message }}</p>
          </div>
          <div v-else-if="filteredArticles && filteredArticles.length > 0" class="grid grid-cols-1 gap-8">
            <NuxtLink
              v-for="article in paginatedArticles"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="bg-white dark:bg-neutral-dark rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row group"
              style="text-decoration: none;"
            >
              <div class="w-full md:w-1/3 flex-shrink-0">
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div class="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">{{ article.title }}</h3>
                  <div class="text-neutral-dark/70 dark:text-neutral-light/70 text-sm mb-3 flex items-center space-x-4">
                    <span class="flex items-center">
                      <span class="material-icons-outlined text-base mr-1.5">calendar_today</span>
                      {{ article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明' }}
                    </span>
                  </div>
                  <p class="text-neutral-dark/80 dark:text-neutral-light/80 text-sm mb-4 line-clamp-3">{{ article.description }}</p>
                </div>
                <div class="flex flex-wrap gap-2 mt-auto">
                  <button
                    v-for="catName in article.category"
                    :key="catName"
                    @click.prevent="selectCategory(catName)"
                    class="px-2 py-1 bg-neutral-light dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest text-xs font-medium rounded-full hover:bg-primary/20 hover:text-primary-dark transition-colors duration-200 cursor-pointer"
                  >
                    {{ catName }}
                  </button>
                </div>
              </div>
            </NuxtLink>

            <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-8">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
                <span class="material-icons-outlined">chevron_left</span>
              </button>
              <span class="text-neutral-dark dark:text-neutral-light font-medium">ページ {{ currentPage }} / {{ totalPages }}</span>
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
                <span class="material-icons-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div v-else class="text-center py-16 text-neutral-dark dark:text-neutral-light text-xl">
            <p>該当する記録はありません。</p>
            <p class="text-base mt-2">新しい挑戦にご期待ください。</p>
          </div>
        </section>
      </div>

      <aside class="md:col-span-1 mt-8 md:mt-0">
        <div class="sticky top-24">
          <div class="bg-white dark:bg-neutral-dark rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-4">検索</h3>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="キーワードで探す..."
                class="w-full pl-10 pr-4 py-2 border border-neutral-light dark:border-neutral-darkest rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-dark text-neutral-darkest dark:text-neutral-lightest"
              />
              <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark dark:text-neutral-light">search</span>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-dark rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold text-neutral-darkest dark:text-neutral-lightest mb-4">カテゴリ</h3>
            <ul class="space-y-2">
              <li>
                <button @click="selectCategory(null)" :class="{ 'font-bold text-primary': !selectedCategory }" class="category-button text-neutral-dark dark:text-neutral-light">
                  <span>すべての記録</span>
                  <span class="category-count bg-neutral-light dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest">{{ allArticles?.length || 0 }}</span>
                </button>
              </li>
              <li v-for="category in uniqueCategoriesWithCount" :key="category.name">
                <button @click="selectCategory(category.name)" :class="{ 'font-bold text-primary': selectedCategory === category.name }" class="category-button text-neutral-dark dark:text-neutral-light">
                  <span>{{ category.name }}</span>
                  <span class="category-count bg-neutral-light dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest">{{ category.count }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const articlesPerPage = 20;

const currentPage = ref(parseInt(route.query.page) || 1);
const selectedCategory = ref(route.query.category || null);
const searchQuery = ref(route.query.search || '');

const { data: allArticles, pending, error } = await useAsyncData(
  'articles-list',
  async () => {
    return await $fetch('/api/articles');
  }
);

watch(
  () => route.query,
  (query) => {
    selectedCategory.value = query.category || null;
    searchQuery.value = query.search || '';
    currentPage.value = parseInt(query.page) || 1;
  },
  { immediate: true }
);

watch([currentPage, selectedCategory, searchQuery], () => {
  const query = {};
  if (currentPage.value !== 1) query.page = currentPage.value;
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (searchQuery.value) query.search = searchQuery.value;

  router.push({ query });
});

const uniqueCategoriesWithCount = computed(() => {
  if (!allArticles.value) return [];

  const counts = {};
  allArticles.value.forEach(article => {
    article.category?.forEach(cat => {
      counts[cat] = (counts[cat] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const selectCategory = (category) => {
  selectedCategory.value = category;
  searchQuery.value = '';
  currentPage.value = 1;
};

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

const filteredArticles = computed(() => {
  if (!allArticles.value) return [];

  let result = [...allArticles.value];

  if (selectedCategory.value) {
    result = result.filter(article =>
      article.category?.includes(selectedCategory.value)
    );
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(article =>
      article.title?.toLowerCase().includes(q) ||
      article.description?.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) =>
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / articlesPerPage)
);

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  return filteredArticles.value.slice(start, start + articlesPerPage);
});

useHead({
  title: '挑戦の記録一覧',
  meta: [
    {
      name: 'description',
      content: '不労所得構築に関するプログラミング、自動化、オンラインビジネスなどの挑戦の記録一覧。'
    }
  ]
});
</script>

<style scoped>
.pagination-button {
  @apply w-10 h-10 flex items-center justify-center bg-white text-neutral-dark rounded-full shadow-md hover:bg-neutral-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.category-button {
  @apply text-neutral-dark/80 hover:text-primary transition-colors duration-200 text-left w-full flex justify-between items-center py-1;
}

.category-count {
  @apply text-xs px-2 py-0.5 bg-neutral-light text-neutral-darkest font-medium rounded-full;
}

/* Material Icons のスタイルはそのまま維持 */
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

/* min-width: 768px でのスタイルもそのまま維持 */
@media (min-width: 768px) {
  .md\:rounded-l-lg {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  .md\:rounded-r-none {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
