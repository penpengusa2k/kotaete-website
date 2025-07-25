<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg">
    <div class="max-w-4xl mx-auto">
      <nav class="p-4 flex justify-between items-center">
        <NuxtLink to="/">
          <img src="/site-title.png" alt="KOTAETE" class="h-8">
        </NuxtLink>
        <transition name="fade">
          <div v-show="showButtons" class="flex items-center space-x-4">
            <NuxtLink to="/contact" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[90px]">
              <span class="material-icons-outlined mr-1 text-base">mail_outline</span>
              目安箱
            </NuxtLink>
            <NuxtLink to="/create" class="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[80px]">
              <span class="material-icons-outlined mr-2">add_circle_outline</span>
              NEW
            </NuxtLink>
          </div>
        </transition>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showButtons = ref(false);

onMounted(() => {
  setTimeout(() => {
    showButtons.value = true;
  }, 100); // 100msの遅延
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
