<template>
  <footer class="bg-neutral-lightest text-neutral-dark py-8 mt-16 border-t border-neutral-light">
    <div class="container mx-auto px-4 text-center">
      <p class="text-sm">
        &copy; {{ currentYear }} 不労所得への道. All rights reserved.
      </p>

      <div class="mt-4 space-x-6">
        <a href="https://github.com/penpengusa2k/" target="_blank" rel="noopener noreferrer" class="text-sm text-neutral-dark hover:text-primary transition-colors duration-200">
          GitHub
        </a>
        <NuxtLink to="/privacy-policy" class="text-sm text-neutral-dark hover:text-primary transition-colors duration-200">
          プライバシーポリシー
        </NuxtLink>
      </div>

      <div class="mt-6 text-xs text-neutral-dark">
        <p>ITの力で、自由な働き方と安定した収入源を。このサイトは、その挑戦の記録です。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 現在の年を取得
const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* スコープ付きスタイルが必要な場合はここに記述 */
</style>
