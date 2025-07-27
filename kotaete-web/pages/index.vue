<template>
  <div>
    <div class="text-center">
      <img src="/site-title.png" alt="KOTAETE" class="h-16 sm:h-20 mb-4 animate-fade-in-down-logo mx-auto block">
      <p class="mt-3 text-lg sm:text-xl text-gray-600 animate-fade-in-up-text">
        あなたの「知りたい」に、みんなの答えを。<br/>
        KOTAETEは簡単・無料のアンケート作成サービスです。
      </p>

      <div class="mt-4 text-center text-gray-500 animate-fade-in-up-text delay-count h-8 flex items-center justify-center">
        <p v-if="!loadingCount && totalCreatedCount !== null" class="text-sm sm:text-base animate-fade-in-text">
          これまでに作成されたKOTAETEの数: <strong class="text-primary text-xl sm:text-2xl">{{ totalCreatedCount }}</strong> 件
        </p>
        <p v-else-if="!loadingCount" class="text-sm sm:text-base text-gray-400 animate-fade-in-text">
          これまでに作成されたKOTAETEの数: <strong class="text-gray-400 text-xl sm:text-2xl">---</strong> 件
        </p>
        </div>
      <div class="mt-4 sm:mt-6 text-center">
        <NuxtLink to="/create" class="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-subtle-bounce custom-button-width">
          <span class="material-icons-outlined mr-2">add_circle_outline</span>
          さっそくKOTAETEを試してみる
        </NuxtLink>
      </div>
    </div>

    <div class="mt-10 sm:mt-16 text-center animate-section-fade-in">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">KOTAETEの使い方</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 bg-white rounded-lg shadow-md animate-card-fade-in delay-1">
          <div class="text-blue-600 text-5xl mb-4">1</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">KOTAETEを作成</h3>
          <p class="text-gray-700">タイトルと質問を入力するだけで、簡単にあなたのKOTAETE（アンケート）が完成します。</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md animate-card-fade-in delay-2">
          <div class="text-blue-600 text-5xl mb-4">2</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">URLをシェア</h3>
          <p class="text-gray-700">作成された専用URLをSNSやメールで共有。あっという間に回答が集まります。</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md animate-card-fade-in delay-3">
          <div class="text-blue-600 text-5xl mb-4">3</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">結果を確認・分析</h3>
          <p class="text-gray-700">集まった回答はリアルタイムでグラフ化。CSVダウンロードで詳細な分析も可能です。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const totalCreatedCount = ref(null);
const loadingCount = ref(true); // ローディング状態を管理

const fetchTotalCreatedCount = async () => {
  loadingCount.value = true; // 読み込み開始時にtrueに設定
  try {
    const response = await $fetch('/api/gas-proxy?action=getStats');
    if (response.result === 'success') {
      totalCreatedCount.value = response.totalCreatedCount;
    } else {
      console.error('Failed to fetch total created count:', response.message);
      totalCreatedCount.value = null; // エラー時はnullに戻す
    }
  } catch (error) {
    console.error('Error fetching total created count:', error);
    totalCreatedCount.value = null; // エラー時はnullに戻す
  } finally {
    // APIコールが完了したら、数ミリ秒遅延させてフェードイン効果を与える
    setTimeout(() => {
      loadingCount.value = false; // 読み込み完了時にfalseに設定
    }, 100); // 100msの遅延
  }
};

onMounted(() => {
  fetchTotalCreatedCount();
});
</script>

<style scoped>
/* ロゴのフェードイン */
@keyframes fadeInDownLogo {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down-logo {
  opacity: 0; /* 初期状態を非表示に設定 */
  animation: fadeInDownLogo 0.8s ease-out forwards;
}

/* 説明文のフェードイン */
@keyframes fadeInUpText {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up-text {
  opacity: 0; /* 初期状態を非表示に設定 */
  animation: fadeInUpText 1s ease-out forwards 0.2s;
}

/* カウント表示の遅延アニメーションのタイミング */
.animate-fade-in-up-text.delay-count {
  animation-delay: 0.5s;
}

/* 新規追加: 件数テキストのフェードインアニメーション */
@keyframes fadeInText {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-text {
  opacity: 0;
  animation: fadeInText 0.5s ease-out forwards; /* 0.5秒でふわっと表示 */
}


/* ボタンの控えめなバウンス */
@keyframes subtleBounce {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-3px); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-1px); }
  80% { transform: translateY(0); }
}
.animate-subtle-bounce {
  animation: subtleBounce 1s ease-out 0.6s 1 forwards;
}

/* KOTAETEの使い方セクション全体を遅延フェードイン */
@keyframes sectionFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-section-fade-in {
  opacity: 0;
  animation: sectionFadeIn 1s ease-out forwards 1.2s;
}

/* 各カードのフェードイン */
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-card-fade-in {
  opacity: 0;
  animation: cardFadeIn 0.6s ease-out forwards;
}

/* カードごとの遅延設定 */
.animate-card-fade-in.delay-1 { animation-delay: 1.5s; }
.animate-card-fade-in.delay-2 { animation-delay: 1.7s; }
.animate-card-fade-in.delay-3 { animation-delay: 1.9s; }

/* ボタンの初期幅を固定してリサイズを防ぐ */
.custom-button-width {
  min-width: 280px;
}
/* smブレイクポイントでのボタンの幅調整 */
@media (min-width: 640px) {
  .custom-button-width {
    min-width: 320px;
  }
}
</style>
