<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <header class="w-full max-w-4xl mb-8">
      <nav class="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center">
        <NuxtLink to="/" class="mb-4 sm:mb-0">
          <img src="/site-title.png" alt="KOTAETE" class="h-8">
        </NuxtLink>
        <div>
          <NuxtLink to="/create" class="text-gray-700 hover:text-blue-600 transition-colors duration-200">KOTAETE作成</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="max-w-4xl w-full bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
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
</script>