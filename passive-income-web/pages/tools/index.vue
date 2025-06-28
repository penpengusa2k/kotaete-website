<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">ツール</h1>
    <p class="text-lg text-gray-600 mb-10">
      不労所得の構築を加速させる、厳選されたツールやサービスを紹介します。
      時間と労力を節約し、効率的に目標を達成しましょう。
    </p>

    <section class="py-6">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/E3F2FD/2C3E50?text=Automation+Tool" alt="ツール画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Zapier (ザピアー)</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">異なるWebサービス間で自動化ワークフローを簡単に作成できるノーコードツール。メール、SNS、CRMなどを連携し、業務を自動化します。</p>
            <NuxtLink to="/tools/zapier" class="text-blue-600 hover:text-blue-800 font-medium text-sm">詳細を見る &rarr;</NuxtLink>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/E8F5E9/2C3E50?text=Blog+Platform" alt="ツール画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">WordPress.com / WordPress.org</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">世界で最も利用されているブログ・ウェブサイト作成プラットフォーム。豊富なプラグインで収益化やSEO対策も柔軟に対応できます。</p>
            <NuxtLink to="/tools/wordpress" class="text-blue-600 hover:text-blue-800 font-medium text-sm">詳細を見る &rarr;</NuxtLink>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/FFFDE7/2C3E50?text=Learning+Platform" alt="ツール画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Udemy / Coursera</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">プログラミングやビジネススキルをオンラインで学習できるプラットフォーム。不労所得につながるスキル習得に役立ちます。</p>
            <NuxtLink to="/tools/online-courses" class="text-blue-600 hover:text-blue-800 font-medium text-sm">詳細を見る &rarr;</NuxtLink>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img src="https://via.placeholder.com/400x250/FCE4EC/2C3E50?text=Marketing+Tool" alt="ツール画像" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Mailchimp (メールチンプ)</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">効果的なメールマガジンやマーケティングキャンペーンを構築できるツール。見込み客との関係を深め、収益化に貢献します。</p>
            <NuxtLink to="/tools/mailchimp" class="text-blue-600 hover:text-blue-800 font-medium text-sm">詳細を見る &rarr;</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'ツール - 不労所得への道',
  meta: [
    { name: 'description', content: '不労所得構築に役立つプログラミング、自動化、オンラインビジネス関連ツールを厳選して紹介。' }
  ]
})
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
</style>