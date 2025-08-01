<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg',
    'transition-transform duration-300 ease-in-out',
    isHeaderVisible ? 'translate-y-0' : '-translate-y-full',
    'md:translate-y-0'
  ]">
    <div class="max-w-4xl mx-auto">
      <nav class="p-4 flex justify-between items-center">
        <NuxtLink to="/" @click="isMenuOpen = false">
          <img src="/site-title.png" alt="KOTAETE" class="h-8">
        </NuxtLink>

        <!-- PC Nav -->
        <div class="hidden md:flex items-center space-x-6">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/ranking" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 w-[100px]">
              <span class="material-icons-outlined mr-1 text-base">emoji_events</span>
              RANK
            </NuxtLink>
            <NuxtLink to="/contact" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[90px]">
              <span class="material-icons-outlined mr-1 text-base">mail_outline</span>
              目安箱
            </NuxtLink>
            <NuxtLink to="/create" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[80px]">
              <span class="material-icons-outlined mr-2">add_circle_outline</span>
              NEW
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Nav Toggle -->
        <div class="md:hidden relative top-1">
          <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
            <span v-if="!isMenuOpen" class="material-icons-outlined">menu</span>
            <span v-else class="material-icons-outlined">close</span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div :class="[
        'md:hidden bg-white bg-opacity-95 shadow-lg',
        'transition-all duration-300 ease-in-out overflow-hidden',
        isMenuOpen ? 'max-h-screen' : 'max-h-0'
      ]">
        <div class="flex flex-col items-center space-y-4 p-4">
          <NuxtLink to="/about" @click="isMenuOpen = false" class="w-full text-center py-2 rounded-md hover:bg-gray-100">KOTAETEについて</NuxtLink>
          <NuxtLink to="/how-to-use" @click="isMenuOpen = false" class="w-full text-center py-2 rounded-md hover:bg-gray-100">使い方</NuxtLink>
          <NuxtLink to="/faq" @click="isMenuOpen = false" class="w-full text-center py-2 rounded-md hover:bg-gray-100">FAQ</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMenuOpen = ref(false);
const lastScrollY = ref(0);
const isHeaderVisible = ref(true);

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY < lastScrollY.value || currentScrollY < 100) {
    // スクロールアップ、またはページ上部100px以内にいる場合
    isHeaderVisible.value = true;
  } else {
    // スクロールダウン
    isHeaderVisible.value = false;
  }

  // ヘッダーが非表示になる際にメニューも閉じる
  if (!isHeaderVisible.value) {
    isMenuOpen.value = false;
  }

  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
