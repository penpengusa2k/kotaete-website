<template>
  <footer class="w-full bg-gray-800 text-gray-300 py-8 mt-12">
    <!-- PC表示 -->
    <div class="hidden md:flex max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 justify-between items-start">
      <!-- ロゴと著作権 -->
      <div class="flex flex-col items-start space-y-2">
        <NuxtLink to="/">
          <img src="/site-title.png" alt="KOTAETE" class="h-10 filter brightness-0 invert">
        </NuxtLink>
        <p class="text-sm">&copy; 2025 KOTAETE. All rights reserved.</p>
      </div>

      <!-- サイトマップ -->
      <div class="flex flex-col items-start space-y-2">
        <h3 class="text-lg font-semibold text-white mb-2">サイトマップ</h3>
        <NuxtLink to="/about" class="hover:text-white transition-colors duration-200">このサイトについて</NuxtLink>
        <NuxtLink to="/how-to-use" class="hover:text-white transition-colors duration-200">使い方</NuxtLink>
        <NuxtLink to="/faq" class="hover:text-white transition-colors duration-200">よくある質問</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-white transition-colors duration-200">お問い合わせ</NuxtLink>
        <NuxtLink to="/roadmap" class="hover:text-white transition-colors duration-200">ロードマップ</NuxtLink>
        <NuxtLink to="/privacy" class="hover:text-white transition-colors duration-200">プライバシーポリシー</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-white transition-colors duration-200">利用規約</NuxtLink>
      </div>

      <!-- ソーシャル -->
      <div class="flex flex-col items-start space-y-2">
        <h3 class="text-lg font-semibold text-white mb-2">つながる</h3>
        <a href="https://x.com/kotaete_xyz" class="hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">X (旧Twitter)</a>
      </div>
    </div>

    <!-- スマホ表示 -->
    <div class="md:hidden flex flex-col items-center space-y-6">
      <!-- ロゴ -->
      <div class="flex flex-col items-center space-y-2">
        <NuxtLink to="/">
          <img src="/site-title.png" alt="KOTAETE" class="h-10 filter brightness-0 invert">
        </NuxtLink>
        <p class="text-sm text-center">&copy; 2025 KOTAETE. All rights reserved.</p>
      </div>

      <!-- リンク部分 横並び -->
      <div class="w-full flex justify-between px-6">
        <!-- サイトマップ -->
        <div class="flex flex-col items-start space-y-1">
          <h3 class="text-base font-semibold text-white mb-1">サイトマップ</h3>
          <NuxtLink to="/about" class="text-sm hover:text-white transition-colors duration-200">このサイトについて</NuxtLink>
          <NuxtLink to="/how-to-use" class="text-sm hover:text-white transition-colors duration-200">使い方</NuxtLink>
          <NuxtLink to="/faq" class="text-sm hover:text-white transition-colors duration-200">よくある質問</NuxtLink>
          <NuxtLink to="/contact" class="text-sm hover:text-white transition-colors duration-200">お問い合わせ</NuxtLink>
          <NuxtLink to="/roadmap" class="text-sm hover:text-white transition-colors duration-200">ロードマップ</NuxtLink>
          <NuxtLink to="/privacy" class="text-sm hover:text-white transition-colors duration-200">プライバシーポリシー</NuxtLink>
          <NuxtLink to="/terms" class="text-sm hover:text-white transition-colors duration-200">利用規約</NuxtLink>
        </div>

        <!-- つながる -->
        <div class="flex flex-col items-start space-y-1 text-left">
          <h3 class="text-base font-semibold text-white mb-1">つながる</h3>
          <a href="https://x.com/kotaete_xyz" class="text-sm hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">X (旧Twitter)</a>
        </div>
      </div>
    </div>
  </footer>
</template>
