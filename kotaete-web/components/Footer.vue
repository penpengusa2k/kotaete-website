<template>
  <footer class="bg-neutral-darkest text-white mt-12">
    <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Logo and Copyright -->
      <div class="flex flex-col items-center text-center mb-8">
        <NuxtLink to="/">
          <img src="/site-title.png" alt="KOTAETE" class="h-10 filter brightness-0 invert mb-2">
        </NuxtLink>
        <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} KOTAETE. All rights reserved.</p>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 mb-8"></div>

      <!-- Links -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">KOTAETE</h3>
          <ul class="mt-4 space-y-2">
            <li><NuxtLink to="/about" class="text-base text-gray-400 hover:text-white">KOTAETEについて</NuxtLink></li>
            <li><NuxtLink to="/how-to-use" class="text-base text-gray-400 hover:text-white">使い方</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-base text-gray-400 hover:text-white">FAQ</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">サポート</h3>
          <ul class="mt-4 space-y-2">
            <li><NuxtLink to="/contact" class="text-base text-gray-400 hover:text-white">お問い合わせ</NuxtLink></li>
            <li><NuxtLink to="/roadmap" class="text-base text-gray-400 hover:text-white">ロードマップ</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">法務</h3>
          <ul class="mt-4 space-y-2">
            <li><NuxtLink to="/terms" class="text-base text-gray-400 hover:text-white">利用規約</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-base text-gray-400 hover:text-white">プライバシーポリシー</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">フォロー</h3>
          <ul class="mt-4 space-y-2">
            <li><a href="https://x.com/kotaete_xyz" target="_blank" rel="noopener noreferrer" class="text-base text-gray-400 hover:text-white">X (Twitter)</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed for this simple component
</script>
