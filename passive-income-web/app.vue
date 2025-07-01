<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s | 不労所得への道',
  meta: [
    { name: 'description', content: 'ITスキルで不労所得を築く。現役エンジニアが挑戦の過程を全公開。副業、自動化、Webサイト収益化のリアルな情報がここに。' }
  ]
})
</script>