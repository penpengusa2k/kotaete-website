<template>
  <footer class="bg-gray-50 text-gray-600 py-6 mt-12 shadow-inner">
    <div class="container mx-auto px-4 text-center">
      <p class="text-sm">
        &copy; {{ currentYear }} 不労所得への道. All rights reserved.
      </p>

      <div class="mt-4 space-x-4">
        <a href="https://github.com/penpengusa2k/" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
          GitHub
        </a>
        <NuxtLink to="/privacy-policy" class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
          privacy-policy
        </NuxtLink>
      </div>

      <div class="mt-6 text-xs text-gray-500">
        <p>ITを活用した不労所得構築のための情報を提供しています。</p>
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
