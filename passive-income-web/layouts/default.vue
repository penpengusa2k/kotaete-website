<template>
  <div class="flex flex-col min-h-screen font-sans bg-neutral-lightest dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest">
    <component :is="isAppPage ? AppHeaderForApp : AppHeader" :app="appDataForHeader" />

    <nav class="container mx-auto px-4 py-3 text-sm text-neutral-darkest dark:text-neutral-light" aria-label="breadcrumb">
      <ol class="list-none p-0 inline-flex flex-wrap items-center">
        <template v-if="breadcrumbs.length > 0">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
            <span v-if="index > 0" class="material-icons-outlined text-base mx-1">chevron_right</span>
            <NuxtLink
              v-if="crumb.isLink"
              :to="crumb.path"
              class="breadcrumb-link"
            >
              {{ crumb.name }}
            </NuxtLink>
            <span v-else class="text-neutral-darkest dark:text-neutral-lightest font-medium whitespace-nowrap">
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
    <Analytics />
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Analytics } from '@vercel/analytics/nuxt'
import AppHeader from '~/components/AppHeader.vue';
import AppHeaderForApp from '~/components/AppHeaderForApp.vue';

const route = useRoute();
const config = useRuntimeConfig();

const appDataForHeader = ref(null);

const isAppPage = computed(() => route.path.startsWith('/apps/') && route.params.slug);

watch(() => route.params.slug, async (newSlug) => {
  if (isAppPage.value && newSlug) {
    try {
      const response = await fetch(`/api/apps/${newSlug}`);
      if (response.ok) {
        appDataForHeader.value = await response.json();
      } else {
        appDataForHeader.value = null;
      }
    } catch (e) {
      console.error('Failed to fetch app data for header:', e);
      appDataForHeader.value = null;
    }
  } else {
    appDataForHeader.value = null;
  }
}, { immediate: true });

const { data: articleDataForBreadcrumb } = await useAsyncData(
  () => `article-breadcrumb-${route.params.slug}`,
  async () => {
    if (route.path.startsWith('/articles/') && route.params.slug) {
      try {
        return await $fetch(`/api/article/${route.params.slug}`);
      } catch (e) {
        console.error('Failed to fetch article data for breadcrumb:', e);
        return null;
      }
    }
    return null;
  },
  { watch: [() => route.params.slug] } // slug の変更を監視
);

const breadcrumbs = computed(() => {
  const crumbs = [];
  crumbs.push({ name: 'ホーム', path: '/', isLink: true });

  const pathParts = route.path.split('/').filter(part => part !== '');
  let currentPath = '';

  pathParts.forEach((part, index) => {
    currentPath += `/${part}`;
    let name = part;
    let isLink = true; // デフォルトはリンク

    // パスセグメントに対応する表示名を設定
    if (part === 'articles') {
      name = '記事一覧';
    } else if (part === 'about') {
      name = 'サイトについて';
    } else if (part === 'contact') {
      name = 'お問い合わせ';
    }

    const isLastSegment = index === pathParts.length - 1;

    // 記事詳細ページのslug部分の処理 (記事タイトルを表示)
    if (part === route.params.slug && route.path.startsWith('/articles/')) {
        name = articleDataForBreadcrumb.value ? articleDataForBreadcrumb.value.title : '記事タイトル';
        isLink = false; // 記事詳細の最終項目なのでリンクではない
    } else if (isLastSegment && route.path !== '/articles') { // `/articles` 以外の最終セグメントはリンクにしない
      isLink = false;
    }

    crumbs.push({ name: name, path: currentPath, isLink: isLink });
  });

  // `/articles` ページでカテゴリや検索クエリがある場合、パンくずリストに項目を追加
  if (route.path === '/articles') {
    if (route.query.category) {
      crumbs.push({ name: route.query.category, path: route.fullPath, isLink: false });
    } else if (route.query.search) {
      crumbs.push({ name: `検索結果: "${route.query.search}"`, path: route.fullPath, isLink: false });
    }
  }
  return crumbs;
});
</script>

<style>
/* Material Icons のインポートと基本スタイル */
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
