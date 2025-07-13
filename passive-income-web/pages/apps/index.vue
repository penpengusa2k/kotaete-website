<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">アプリ一覧</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="app in apps" :key="app.slug" class="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <NuxtLink :to="`/apps/${app.slug}`">
          <img :src="app.thumbnail" :alt="`${app.name} thumbnail`" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-2">{{ app.name }}</h2>
            <p class="text-gray-700 dark:text-gray-300">{{ app.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: apps, error } = await useAsyncData('apps', () => $fetch('/api/apps'));
</script>