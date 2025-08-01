<template>
  <footer class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-t-lg">
    <nav class="max-w-4xl mx-auto">
      <div class="flex justify-around items-center p-2">
        <NuxtLink to="/" exact-active-class="text-primary" class="flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-colors">
          <span class="material-icons-outlined">home</span>
          <span class="text-xs">ホーム</span>
        </NuxtLink>
        <NuxtLink to="/create" exact-active-class="text-primary" class="flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-colors">
          <span class="material-icons-outlined">add_circle_outline</span>
          <span class="text-xs">NEW</span>
        </NuxtLink>
        <NuxtLink to="/ranking" exact-active-class="text-primary" class="flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-colors">
          <span class="material-icons-outlined">emoji_events</span>
          <span class="text-xs">RANK</span>
        </NuxtLink>
        <NuxtLink to="/contact" exact-active-class="text-primary" class="flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-colors">
          <span class="material-icons-outlined">mail_outline</span>
          <span class="text-xs">目安箱</span>
        </NuxtLink>
      </div>
    </nav>
  </footer>
</template>

<script setup>
// No script needed for this simple component
</script>
