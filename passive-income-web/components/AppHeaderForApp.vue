<template>
  <header class="bg-white dark:bg-neutral-darkest text-neutral-darkest dark:text-neutral-lightest shadow-sm py-3 relative z-20">
    <div class="container mx-auto flex justify-between items-center px-4">
      <NuxtLink to="/apps" class="flex items-center text-xl lg:text-2xl font-bold tracking-tight text-neutral-darkest dark:text-neutral-lightest hover:text-primary transition-colors duration-200">
        <span class="material-icons-outlined text-primary text-3xl lg:text-4xl mr-2">
          Android
        </span>
        BuzzApps
      </NuxtLink>

      <!-- <div class="flex-grow text-center">
        <h1 v-if="app && app.title" class="text-xl lg:text-2xl font-bold text-neutral-darkest dark:text-neutral-lightest truncate">
          {{ app.title }}
        </h1>
        <p v-if="app && app.description" class="text-sm text-neutral-dark dark:text-neutral-light truncate hidden md:block">
          {{ app.description }}
        </p>
      </div> -->

      <button @click="toggleDarkMode" class="p-2 rounded-md hover:bg-neutral-light dark:hover:bg-neutral-dark transition-colors duration-200 flex items-center justify-center">
        <span v-if="isDarkMode" class="material-icons-outlined text-purple-400 text-2xl">dark_mode</span>
        <span v-else class="material-icons-outlined text-yellow-500 text-2xl">light_mode</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  app: Object
});

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (process.client) {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode.value = false;
      document.documentElement.classList.remove('dark');
    }
  }
});
</script>
