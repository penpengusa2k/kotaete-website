<template>
  <div class="container mx-auto px-4 py-8">
    <section class="text-center py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
        不労所得への道
        <span class="block text-xl md:text-2xl font-semibold text-gray-700 mt-2">ITを活用し、経済的自由を手に入れる</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        プログラミング、自動化、オンラインビジネス…<br class="hidden sm:inline">このサイトは、あなたの不労所得構築をサポートする実践的な情報を提供します。
      </p>
      <NuxtLink to="/articles" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
        <span class="material-icons-outlined mr-2">article</span> 最新記事を読む
      </NuxtLink>
    </section>

    <section class="py-12 mb-12">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">このサイトで得られること</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-blue-500 text-5xl mb-4">lightbulb</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">実践的なノウハウ</h3>
          <p class="text-gray-600 text-sm">すぐに役立つ具体的な方法論やステップバイステップのガイドを提供。</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-green-500 text-5xl mb-4">build</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">役立つツールの紹介</h3>
          <p class="text-gray-600 text-sm">不労所得構築を効率化するソフトウェアやサービスのレビュー。</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <span class="material-icons-outlined text-purple-500 text-5xl mb-4">leaderboard</span>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">成功事例と実績</h3>
          <p class="text-gray-600 text-sm">実際の収益データや具体的な成果を公開し、モチベーションを喚起。</p>
        </div>
      </div>
    </section>

    <section class="py-12">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">最新記事</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/E0F2F7/2C3E50?text=Article+Image" alt="記事画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">プログラミングで自動化ツールを作る第一歩</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">Pythonを使って日々のルーティン作業を自動化する方法について解説します。初心者でも理解しやすいように、具体的なコード例を交えながら説明します。</p>
            <NuxtLink to="/articles/programming-automation" class="text-blue-600 hover:text-blue-800 font-medium text-sm">続きを読む &rarr;</NuxtLink>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/E8F5E9/2C3E50?text=Tool+Review" alt="記事画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">おすすめのノーコードツール5選</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">プログラミング知識がなくてもビジネスを自動化できるノーコードツールをご紹介。それぞれの特徴と活用事例を詳しく解説。</p>
            <NuxtLink to="/articles/nocode-tools" class="text-blue-600 hover:text-blue-800 font-medium text-sm">続きを読む &rarr;</NuxtLink>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/FFF3E0/2C3E50?text=Passive+Income" alt="記事画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">ブログで月5万円稼ぐロードマップ</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">ブログをゼロから立ち上げ、収益化するための具体的なステップを解説。SEO対策からコンテンツ作成、収益化戦略まで。</p>
            <NuxtLink to="/articles/blog-roadmap" class="text-blue-600 hover:text-blue-800 font-medium text-sm">続きを読む &rarr;</NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-center mt-10">
        <NuxtLink to="/articles" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          すべての記事を見る
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: '不労所得への道 - ITで経済的自由を',
  meta: [
    { name: 'description', content: 'ITスキルを活用した不労所得構築に特化した情報サイト。実践的なノウハウ、ツールの紹介、成功事例を公開。' }
  ]
})
</script>

<style scoped>
/* 今は特になし */
</style>
