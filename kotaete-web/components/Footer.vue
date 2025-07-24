<template>
  <footer class="w-full bg-gray-800 text-gray-300 py-8 mt-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
      <!-- ロゴと著作権 -->
      <div class="flex flex-col items-center md:items-start space-y-2">
        <NuxtLink to="/">
          <img src="/site-title.png" alt="KOTAETE" class="h-10 filter brightness-0 invert"> <!-- ロゴを白くする -->
        </NuxtLink>
        <p class="text-sm">&copy; 2025 KOTAETE. All rights reserved.</p>
      </div>

      <!-- ナビゲーションリンク -->
      <div class="flex flex-col items-center md:items-start space-y-2">
        <h3 class="text-lg font-semibold text-white mb-2">サイトマップ</h3>
        <NuxtLink to="/about" class="hover:text-white transition-colors duration-200">このサイトについて</NuxtLink>
        <NuxtLink to="/how-to-use" class="hover:text-white transition-colors duration-200">使い方</NuxtLink>
        <NuxtLink to="/privacy" class="hover:text-white transition-colors duration-200">プライバシーポリシー</NuxtLink>
        <NuxtLink to="/faq" class="hover:text-white transition-colors duration-200">よくある質問</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-white transition-colors duration-200">お問い合わせ</NuxtLink>
      </div>

      <!-- ソーシャルメディアリンクなど（将来的に追加可能） -->
      <div class="flex flex-col items-center md:items-start space-y-2">
        <h3 class="text-lg font-semibold text-white mb-2">つながる</h3>
        <a href="https://x.com/kotaete_xyz" class="hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">X (旧Twitter)</a>
        <!-- 他のソーシャルメディアリンクや関連サイトへのリンクを追加可能 -->
      </div>
    </div>
  </footer>
</template>
