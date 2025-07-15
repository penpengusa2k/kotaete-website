<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-4xl font-bold mb-6 text-center text-rose-600 drop-shadow">
      地獄の関係相性チェッカー 🔥
    </h1>

    <div v-if="results.love" id="diagnosis-results" class="bg-white shadow-lg rounded-xl p-6 mb-8 border-t-4 border-rose-500">
      <h2 class="text-2xl font-bold mb-4 text-center text-rose-700">診断レポート 📜</h2>

      <div class="space-y-6">
        <div v-if="averageCompatibility !== null" class="bg-rose-50 border-l-4 border-rose-400 text-rose-800 p-4" role="alert">
          <p class="font-bold text-xl mb-2">総合相性地獄度: {{ averageCompatibility }}%</p>
          <p class="text-base">{{ name1 }} と {{ name2 }} の関係は {{ averageCompatibility }}% の業火でつながっています🔥</p>
        </div>

        <div class="bg-pink-50 border-l-4 border-pink-400 text-pink-800 p-4">
          <p class="font-bold text-lg mb-1">💘 恋愛：{{ results.love.title }}（{{ results.love.compatibility }}%）</p>
          <p class="text-sm">{{ results.love.description }}</p>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4">
          <p class="font-bold text-lg mb-1">👯‍♀️ 友情：{{ results.friendship.title }}（{{ results.friendship.compatibility }}%）</p>
          <p class="text-sm">{{ results.friendship.description }}</p>
        </div>

        <div class="bg-green-50 border-l-4 border-green-400 text-green-800 p-4">
          <p class="font-bold text-lg mb-1">💼 仕事：{{ results.work.title }}（{{ results.work.compatibility }}%）</p>
          <p class="text-sm">{{ results.work.description }}</p>
        </div>
      </div>

      <div class="text-center mt-6">
        <button
          @click="saveAsImage"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 mr-3"
        >📸 結果を晒す用に保存</button>

        <a
          :href="twitterShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
        >🐦 Xで晒す</a>
      </div>
    </div>

    <div v-else class="text-center text-gray-600">
      <p>診断結果が見つかりません。名前を入力して診断してください。</p>
      <NuxtLink to="/apps/relationship-checker" class="text-rose-500 hover:underline">診断ページへ戻る</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import html2canvas from 'html2canvas';
import { getPairId, generateResultFromId } from '~/utils/resultGenerator';

const route = useRoute();

// URLから名前を取得
const name1 = computed(() => {
  const val = route.query.name1 as string || 'あなた';
  console.log('Result Page - name1:', val);
  return val;
});
const name2 = computed(() => {
  const val = route.query.name2 as string || 'あの人';
  console.log('Result Page - name2:', val);
  return val;
});

// 名前からハッシュIDを生成し、診断結果を再生成
const results = computed(() => {
  if (name1.value && name2.value) {
    const pairId = getPairId(name1.value, name2.value);
    const generatedResults = generateResultFromId(pairId);
    console.log('Result Page - Generated Results:', generatedResults);
    return generatedResults;
  }
  console.log('Result Page - name1 or name2 is empty, results not generated.');
  return null;
});

// 総合相性度を計算
const averageCompatibility = computed(() => {
  if (!results.value) return null;
  let total = 0;
  let count = 0;
  if (results.value.love) {
    total += results.value.love.compatibility;
    count++;
  }
  if (results.value.friendship) {
    total += results.value.friendship.compatibility;
    count++;
  }
  if (results.value.work) {
    total += results.value.work.compatibility;
    count++;
  }
  return count > 0 ? Math.floor(total / count) : null;
});

// OGP画像を定義
defineOgImage({
  component: 'OgImageRelationship',
  props: {
    name1: name1.value,
    name2: name2.value,
    love: results.value?.love ? `${results.value.love.title}（${results.value.love.compatibility}%）` : '未診断',
    friendship: results.value?.friendship ? `${results.value.friendship.title}（${results.value.friendship.compatibility}%）` : '未診断',
    work: results.value?.work ? `${results.value.work.title}（${results.value.work.compatibility}%）` : '未診断',
  },
});

useHead({
  meta: [
    {
      property: 'og:image',
      content: `https://furoshotoku.net/api/og-image?name1=${encodeURIComponent(name1.value)}&name2=${encodeURIComponent(name2.value)}`,
    }
  ]
});

// X共有URL
const twitterShareUrl = computed(() => {
  const shareText = `【地獄の関係相性チェッカー】\n${name1.value} と ${name2.value} の関係は...${averageCompatibility.value !== null ? `総合相性度: ${averageCompatibility.value}%でした！` : ''}\n\n${results.value?.love ? `💘恋愛: ${results.value.love.title} (${results.value.love.compatibility}%)\n` : ''}${results.value?.friendship ? `👯友情: ${results.value.friendship.title} (${results.value.friendship.compatibility}%)\n` : ''}${results.value?.work ? `💼仕事: ${results.value.work.title} (${results.value.work.compatibility}%)` : ''}\n#地獄の相性診断`;

  const url = window.location.href; // 現在のURL（クエリパラメータ付き）をそのまま使う
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
});

// 画像として保存する関数
const saveAsImage = async () => {
  const element = document.getElementById('diagnosis-results');
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // 高解像度でキャプチャ
        useCORS: true, // 外部リソースを使用する場合に必要
        y: -5, // Y座標を調整して文字のずれを補正
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `relationship-diagnosis-${name1.value}-${name2.value}.png`;
      link.click();
    } catch (err) {
      console.error('画像の保存中にエラーが発生しました:', err);
      // エラーメッセージを表示するなどの処理
    }
  }
};

useHead({
  title: 'なんちゃって関係診断',
  meta: [
    { name: 'description', content: '二人の名前から関係性を診断する、AIも心理学も使わないなんちゃって診断アプリです。' },
  ]
});
</script>
