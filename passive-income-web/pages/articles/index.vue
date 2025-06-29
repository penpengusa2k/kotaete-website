<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">記事一覧</h1>
    <p class="text-lg text-gray-600 mb-10">
      不労所得構築に関する最新の知見や実践的なノウハウをお届けします。
      新しい記事を随時追加していきますので、ぜひ定期的にチェックしてください。
    </p>

    <div class="md:grid md:grid-cols-4 md:gap-8">
      <div class="md:col-span-3">
        <section class="py-6">
          <div v-if="pending" class="text-center py-16 text-gray-600 text-xl">
            <p>記事を読み込み中...</p>
            <div class="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          </div>
          <div v-else-if="error" class="text-center py-16 text-red-600 text-xl">
            <p>記事の読み込みに失敗しました。</p>
            <p class="text-sm text-red-400 mt-2">エラー: {{ error.message }}</p>
          </div>
          <div v-else-if="filteredArticles && filteredArticles.length > 0" class="grid grid-cols-1 gap-8">
            <NuxtLink
              v-for="article in paginatedArticles"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row group"
              style="text-decoration: none;"
            >
              <div class="w-full md:w-1/3 flex-shrink-0 h-full flex items-center justify-center bg-gray-100">
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="w-full aspect-[4/3] object-cover md:rounded-l-lg md:rounded-r-none"
                  
                  > </div>
              <div class="p-6 flex-grow">
                <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">{{ article.title }}</h3>
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
                        @click.prevent="goToCategoryPage(catName)" class="px-1 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg hover:bg-blue-200 hover:text-blue-900 transition-colors duration-200 cursor-pointer"
                      >
                        {{ catName }}
                      </button>
                    </div>
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ article.description }}</p>
              </div>
            </NuxtLink>

            <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                前へ
              </button>
              <span class="text-gray-700">ページ {{ currentPage }} / {{ totalPages }}</span>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          </div>
          <div v-else class="text-center py-16 text-gray-600 text-xl">
            <p>現在、公開されている記事はありません。</p>
            <p class="text-base mt-2">Notionデータベースに記事を追加し、「Published」にチェックを入れてください。</p>
          </div>
        </section>
      </div>

      <aside class="md:col-span-1 mt-8 md:mt-0 px-4 py-6 bg-gray-50 rounded-lg shadow-sm">
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">記事検索</h3>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="キーワードを入力..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">カテゴリ</h3>
          <ul class="space-y-2">
            <li>
              <button
                @click="selectCategory(null)"
                :class="{ 'font-bold text-blue-600': !selectedCategory }"
                class="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left w-full flex justify-between items-center"
              >
                <span>すべての記事</span>
                <span class="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{{ allArticles?.length || 0 }}</span>
              </button>
            </li>
            <li v-for="category in uniqueCategoriesWithCount" :key="category.name">
              <button
                @click="selectCategory(category.name)"
                :class="{ 'font-bold text-blue-600': selectedCategory === category.name }"
                class="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left w-full flex justify-between items-center"
              >
                <span>{{ category.name }}</span>
                <span class="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{{ category.count }}</span>
              </button>
            </li>
          </ul>
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

watch([currentPage, selectedCategory, searchQuery], () => {
  const query = {};
  if (currentPage.value !== 1) {
    query.page = currentPage.value;
  }
  if (selectedCategory.value) {
    query.category = selectedCategory.value;
  }
  if (searchQuery.value) {
    query.search = searchQuery.value;
  }
  router.push({ query: query });
});

const uniqueCategoriesWithCount = computed(() => {
  if (!allArticles.value) return [];

  const categoryCounts = {};
  allArticles.value.forEach(article => {
    if (article.category && Array.isArray(article.category)) {
      article.category.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    }
  });

  const categoriesWithCount = Object.keys(categoryCounts)
    .map(name => ({ name, count: categoryCounts[name] }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return categoriesWithCount;
});


const selectCategory = (category) => {
  selectedCategory.value = category;
  searchQuery.value = '';
  currentPage.value = 1;
};

const goToCategoryPage = (catName) => {
  router.push({ path: '/articles', query: { category: catName } });
};


const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

const filteredArticles = computed(() => {
  if (!allArticles.value) return [];

  let result = allArticles.value;

  if (selectedCategory.value) {
    result = result.filter(article =>
      article.category && Array.isArray(article.category) && article.category.includes(selectedCategory.value)
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(article =>
      (article.title && article.title.toLowerCase().includes(query)) ||
      (article.description && article.description.toLowerCase().includes(query))
    );
  }

  result.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return result;
});

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage));
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  return filteredArticles.value.slice(start, end);
});

useHead({
  title: '記事一覧 - 不労所得への道',
  meta: [
    { name: 'description', content: '不労所得構築に関するプログラミング、自動化、オンラインビジネスなどの記事一覧。' }
  ]
})
</script>

<style scoped>
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
