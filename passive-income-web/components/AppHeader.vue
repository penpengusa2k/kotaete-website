<template>
  <header class="bg-white text-gray-800 shadow-sm py-3 relative z-20">
    <div class="container mx-auto flex justify-between items-center px-4">
      <NuxtLink to="/" class="flex items-center text-xl md:text-2xl font-medium tracking-tight text-gray-900 hover:text-gray-700 transition-colors duration-200">
        <span class="material-icons-outlined text-yellow-500 text-2xl md:text-3xl mr-2">
          lightbulb
        </span>
        不労所得への道
      </NuxtLink>

      <nav class="hidden md:block">
        <ul class="flex space-x-6">
          <li>
            <NuxtLink to="/articles" class="relative py-2 px-3 group text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm md:text-base font-medium">
              記事
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="relative py-2 px-3 group text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm md:text-base font-medium">
              サイトについて
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/performance" class="relative py-2 px-3 group text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm md:text-base font-medium">
              実績
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
          <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-white shadow-md absolute top-full left-0 w-full">
        <nav class="px-4 py-3">
          <ul class="space-y-3">
            <li>
              <NuxtLink @click="isMenuOpen = false" to="/articles" class="block hover:bg-gray-100 py-2 px-3 rounded-md transition duration-200 text-base font-medium">
                記事
              </NuxtLink>
            </li>
            <li>
              <NuxtLink @click="isMenuOpen = false" to="/about" class="block hover:bg-gray-100 py-2 px-3 rounded-md transition duration-200 text-base font-medium">
                サイトについて
              </NuxtLink>
            </li>
            <li>
              <NuxtLink @click="isMenuOpen = false" to="/performance" class="block hover:bg-gray-100 py-2 px-3 rounded-md transition duration-200 text-base font-medium">
                実績
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const route = useRoute();
watch(route, () => {
  isMenuOpen.value = false;
});
</script>