<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <header class="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg">
      <div class="max-w-4xl mx-auto">
        <nav class="p-4 flex justify-between items-center">
          <NuxtLink to="/">
            <img src="/site-title.png" alt="KOTAETE" class="h-8">
          </NuxtLink>
          <div>
            <NuxtLink to="/create" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-opacity duration-500" :class="{ 'opacity-100 pointer-events-auto': showCreateButton, 'opacity-0 pointer-events-none': !showCreateButton }">
              <span class="material-icons-outlined mr-2">add_circle_outline</span>
              NEW
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    <main class="max-w-4xl w-full bg-white p-6 sm:p-8 rounded-xl shadow-2xl mt-24">
      <slot />
    </main>
    <footer class="w-full max-w-4xl mt-8 text-center">
      <p class="text-gray-700">&copy; 2025 KOTAETE</p>
      <div class="flex justify-center space-x-4 mt-2">
        <NuxtLink to="/privacy" class="text-blue-500 hover:underline text-sm">プライバシーポリシー</NuxtLink>
        <NuxtLink to="/contact" class="text-blue-500 hover:underline text-sm">お問い合わせ</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showCreateButton = ref(false);

onMounted(() => {
  // ページロード後にボタンを表示
  showCreateButton.value = true;
});
</script>
