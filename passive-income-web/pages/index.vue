<template>
  <div>
    <div class="text-center">
      <img src="/site-title.png" alt="KOTAETE" class="h-16 sm:h-20 mb-4 animate-fade-in-down mx-auto block">
      <p class="mt-3 text-lg sm:text-xl text-gray-600 animate-fade-in-up">
        あなたの「知りたい」に、みんなの応えを。<br/>
        KOTAETEは簡単・無料のアンケート作成サービスです。
      </p>
      <div class="mt-10 sm:mt-12 text-center">
        <NuxtLink to="/create" class="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-bounce-once">
          <span class="material-icons-outlined mr-2">add_circle_outline</span>
          新しいKOTAETEを作成する
        </NuxtLink>
      </div>
    </div>

    <!-- How to Use Section -->
    <div class="mt-16 sm:mt-24 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">KOTAETEの使い方</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="text-blue-600 text-5xl mb-4">1</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">KOTAETEを作成</h3>
          <p class="text-gray-700">タイトルと質問を入力するだけで、簡単にあなたのKOTAETE（アンケート）が完成します。</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="text-blue-600 text-5xl mb-4">2</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">URLをシェア</h3>
          <p class="text-gray-700">作成された専用URLをSNSやメールで共有。あっという間に回答が集まります。</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="text-blue-600 text-5xl mb-4">3</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">結果を確認・分析</h3>
          <p class="text-gray-700">集まった回答はリアルタイムでグラフ化。CSVダウンロードで詳細な分析も可能です。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 必要であればここにスクリプトを追加
</script>

<style scoped>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fadeInDown 1s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards 0.3s;
}

@keyframes bounceOnce {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-5px); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-2px); }
  80% { transform: translateY(0); }
}
.animate-bounce-once {
  animation: bounceOnce 1.5s ease-out 1s 1;
}
</style>
