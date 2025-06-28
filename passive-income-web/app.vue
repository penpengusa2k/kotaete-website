<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s - 不労所得への道',
  meta: [
    { name: 'description', content: 'ITを駆使して不労所得を得るためのツール開発やノウハウを共有するサイトです。' }
  ]
})
</script>