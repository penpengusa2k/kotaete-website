<template>
  <div v-if="app" class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <img :src="app.icon" :alt="app.name" class="w-24 h-24 mx-auto mb-4">
      <h1 class="text-4xl font-bold">{{ app.name }}</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">バージョン: {{ app.version }}</p>
    </div>

    <hr class="my-8">

    <component :is="appComponent" />

  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import DefaultAppDetail from '~/components/apps/DefaultAppDetail.vue';

const route = useRoute();
const app = ref(null);
const error = ref(null);

const appComponent = computed(() => {
  if (!app.value || !app.value.component) {
    return DefaultAppDetail;
  }
  const componentName = app.value.component;
  return defineAsyncComponent(() => 
    import(`../../components/apps/${componentName}.vue`)
      .catch(() => {
        console.error(`Failed to load component: ${componentName}`);
        return DefaultAppDetail; // フォールバックコンポーネント
      })
  );
});

// appデータはdefault.vueレイアウトで取得されるため、ここでは不要
// onMounted(async () => {
//   try {
//     const slug = route.params.slug;
//     const response = await fetch(`/api/apps/${slug}`);
//     if (!response.ok) {
//       throw new Error('App not found');
//     }
//     app.value = await response.json();
//   } catch (e) {
//     error.value = e;
//     console.error('Failed to fetch app details:', e);
//   }
// });

// レイアウトからappデータを取得
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    try {
      const response = await fetch(`/api/apps/${newSlug}`);
      if (response.ok) {
        app.value = await response.json();
      } else {
        app.value = null;
      }
    } catch (e) {
      console.error('Failed to fetch app details:', e);
      app.value = null;
    }
  }
}, { immediate: true });
</script>
