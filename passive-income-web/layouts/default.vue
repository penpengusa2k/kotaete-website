<template>
  <div class="flex flex-col min-h-screen font-sans text-gray-800">
    <AppHeader />

    <nav class="container mx-auto px-4 py-4 text-sm text-gray-500" aria-label="breadcrumb">
      <ol class="list-none p-0 inline-flex flex-wrap items-center">
        <li class="flex items-center">
          <NuxtLink to="/" class="breadcrumb-link">ホーム</NuxtLink>
        </li>
        <template v-if="breadcrumbs.length > 0">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
            <span class="material-icons-outlined text-sm mx-2">chevron_right</span>
            <NuxtLink
              v-if="index < breadcrumbs.length - 1 || crumb.isLink"
              :to="crumb.path"
              class="breadcrumb-link"
            >
              {{ crumb.name }}
            </NuxtLink>
            <span v-else class="text-gray-700 whitespace-nowrap">
              {{ crumb.name }}
            </span>
          </li>
        </template>
      </ol>
    </nav>
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const articleDataForBreadcrumb = ref(null);

const { query } = route;

watch(() => route.params.slug, async (newSlug) => {
  if (route.path.startsWith('/articles/') && newSlug) {
    try {
      articleDataForBreadcrumb.value = await $fetch(`/api/article/${newSlug}`);
    } catch (e) {
      console.error('Failed to fetch article data for breadcrumb:', e);
      articleDataForBreadcrumb.value = null;
    }
  } else {
    articleDataForBreadcrumb.value = null;
  }
}, { immediate: true });

const breadcrumbs = computed(() => {
  const crumbs = [];
  const pathParts = route.path.split('/').filter(part => part !== '');
  let currentPath = '';

  pathParts.forEach((part, index) => {
    currentPath += `/${part}`;
    let name = part;

    if (part === 'articles') {
      name = '記事一覧';
    } else if (part === 'about') {
      name = 'サイトについて';
    } else if (part === 'contact') {
      name = 'お問い合わせ';
    }

    const isLastSegment = index === pathParts.length - 1;

    if (route.path.startsWith('/articles/') && route.params.slug === part) {
      return;
    }

    crumbs.push({ name: name, path: currentPath, isLink: !isLastSegment });
  });

  if (route.path === '/articles') {
    if (query.category) {
      crumbs.push({ name: query.category, path: `/articles?category=${query.category}`, isLink: false });
    } else if (query.search) {
      crumbs.push({ name: `検索結果: "${query.search}"`, path: `/articles?search=${query.search}`, isLink: false });
    }
  }

  if (route.path.startsWith('/articles/') && route.params.slug) {
    if (articleDataForBreadcrumb.value) {
      crumbs.push({ name: articleDataForBreadcrumb.value.title, path: route.path, isLink: false });
    }
  }

  return crumbs;
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

body {
  @apply bg-gray-50;
}

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

.breadcrumb-link {
  @apply text-gray-700 whitespace-nowrap;
  text-decoration: none;
  transition: color 0.2s ease-in-out, text-decoration-color 0.2s ease-in-out;
}

.breadcrumb-link:hover {
  @apply text-blue-600 underline;
  text-underline-offset: 2px;
}
</style>
