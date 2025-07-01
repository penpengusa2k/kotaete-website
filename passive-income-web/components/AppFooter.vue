<template>
  <footer class="bg-neutral-lightest dark:bg-neutral-darkest text-neutral-dark dark:text-neutral-light py-8 mt-16 border-t border-neutral-light dark:border-neutral-dark">
    <div class="container mx-auto px-4 text-center">
      <p class="text-sm text-neutral-darkest dark:text-neutral-light">
        &copy; {{ currentYear }} 不労所得への道. All rights reserved.
      </p>

      <div class="mt-4 space-x-6">
        <a href="https://github.com/penpengusa2k/" target="_blank" rel="noopener noreferrer" class="text-sm text-neutral-darkest dark:text-neutral-light hover:text-primary transition-colors duration-200">
          GitHub
        </a>
        <NuxtLink to="/privacy-policy" class="text-sm text-neutral-darkest dark:text-neutral-light hover:text-primary transition-colors duration-200">
          プライバシーポリシー
        </NuxtLink>
      </div>

      <div class="mt-6 text-xs text-neutral-darkest dark:text-neutral-light">
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
