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

    <div class="mt-10 sm:mt-16 text-center animate-section-fade-in delay-spread-section">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">KOTAETEを広めて応援しよう！</h2>
      <p class="text-lg sm:text-xl text-gray-600 mb-8">
        KOTAETEを気に入っていただけたら、ぜひSNSでシェアして応援してください。<br/>
        あなたのシェアが、KOTAETEの成長を支えます！
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`" target="_blank" class="p-5 bg-white rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 animate-share-card-fade-in delay-share-1">
          <svg class="w-10 h-10 mb-2 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.597-8.717L5.25 22H1.942l7.356-8.406L2.25 2.25h3.308l5.979 7.679L18.244 2.25zM10.449 19.92L4.31 4.6H6.02L12.15 19.92h-1.701zm.464-1.797l-1.702-1.701L16.17 4.6h1.701l-7.058 13.523z"></path>
          </svg>
          <span class="text-lg font-semibold text-gray-900">Xでシェア</span>
        </a>
        <a :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`" target="_blank" class="p-5 bg-white rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 animate-share-card-fade-in delay-share-2">
          <svg class="w-10 h-10 mb-2 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0007 2.00067C6.48667 2.00067 2.00067 6.48667 2.00067 12.0007C2.00067 17.5147 6.48667 22.0007 12.0007 22.0007C17.5147 22.0007 22.0007 17.5147 22.0007 12.0007C22.0007 6.48667 17.5147 2.00067 12.0007 2.00067ZM16.2733 16.0355C15.8202 16.5912 14.8817 17.1147 13.0694 17.1147C10.749 17.1147 8.97495 15.6593 8.97495 13.2384C8.97495 10.8358 10.7061 9.42398 13.0456 9.42398C14.0044 9.42398 14.7571 9.77884 15.3409 10.282C15.5492 9.0792 15.8428 7.97011 15.8428 7.97011L14.7562 7.97011C14.7562 7.97011 13.7548 8.01956 12.9157 8.01956C10.2731 8.01956 8.52809 9.94303 8.52809 12.8252C8.52809 15.7073 10.284 17.6308 12.9266 17.6308C14.4691 17.6308 15.7297 16.7469 16.5936 15.8252C16.9238 15.4851 17.1472 15.0622 17.2882 14.6548H16.2733V16.0355Z"/>
          </svg>
          <span class="text-lg font-semibold text-gray-900">LINEでシェア</span>
        </a>
        <a :href="`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`" target="_blank" class="p-5 bg-white rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 animate-share-card-fade-in delay-share-3">
          <svg class="w-10 h-10 mb-2 text-purple-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 3.09 1.407 5.862 3.636 7.758l.364.305c.393.33.884.517 1.4.517.547 0 1.077-.2 1.49-.56l1.42-1.243c.347-.304.78-.465 1.23-.465h.9c.665 0 1.304.263 1.77.73l1.16 1.16c.453.452 1.1.707 1.77.707.513 0 1.007-.17 1.41-.48l.347-.287C20.582 17.837 22 15.073 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span class="text-lg font-semibold text-gray-900">Threadsでシェア</span>
        </a>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const totalCreatedCount = ref(null);
const loadingCount = ref(true); // ローディング状態を管理
const baseUrl = useRuntimeConfig().public.baseUrl;

useHead({
  title: 'KOTAETE - 簡単・無料のアンケート作成サービス',
  meta: [
    { name: 'description', content: 'KOTAETEは、登録不要で簡単に使える無料のアンケート作成サービスです。あなたの「知りたい」を、みんなの答えで解決しましょう。' },
    { property: 'og:title', content: 'KOTAETE - 簡単・無料のアンケート作成サービス' },
    { property: 'og:description', content: 'KOTAETEは、登録不要で簡単に使える無料のアンケート作成サービスです。あなたの「知りたい」を、みんなの答えで解決しましょう。' },
    { property: 'og:image', content: `${baseUrl}/default-ogp.png` },
    { property: 'og:url', content: baseUrl },
    { property: 'twitter:card', content: 'summary_large_image' },
  ],
})

const shareText = computed(() => {
  return `あなたの「知りたい」に、みんなの答えを.\n簡単・無料のアンケート作成サービス「KOTAETE」を試してみよう！\n${baseUrl}`;
});

const fetchTotalCreatedCount = async () => {
  loadingCount.value = true;
  try {
    const response = await $fetch('/api/gas-proxy?action=getStats');
    if (response.result === 'success') {
      totalCreatedCount.value = response.totalCreatedCount;
    } else {
      console.error('Failed to fetch total created count:', response.message);
      totalCreatedCount.value = null;
    }
  } catch (error) {
    console.error('Error fetching total created count:', error);
    totalCreatedCount.value = null;
  } finally {
    setTimeout(() => {
      loadingCount.value = false;
    }, 100);
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
  opacity: 0;
  animation: fadeInDownLogo 0.8s ease-out forwards;
}

/* 説明文のフェードイン */
@keyframes fadeInUpText {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up-text {
  opacity: 0;
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
  animation: fadeInText 0.5s ease-out forwards;
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


/* 新規追加: シェアセクション全体を遅延フェードイン */
.animate-section-fade-in.delay-spread-section {
  animation-delay: 2.2s; /* 使い方セクションの終了後に開始 */
}

/* 新規追加: シェアカードのフェードインアニメーション */
@keyframes shareCardFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-share-card-fade-in {
  opacity: 0;
  animation: shareCardFadeIn 0.6s ease-out forwards;
}
.animate-share-card-fade-in.delay-share-1 { animation-delay: 2.5s; } /* セクション開始 + 0.3s */
.animate-share-card-fade-in.delay-share-2 { animation-delay: 2.7s; } /* セクション開始 + 0.5s */
.animate-share-card-fade-in.delay-share-3 { animation-delay: 2.9s; } /* セクション開始 + 0.7s */


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
