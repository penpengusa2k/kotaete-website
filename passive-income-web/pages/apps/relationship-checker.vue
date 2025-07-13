<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-4xl font-bold mb-6 text-center text-rose-600 drop-shadow">
      地獄の関係相性チェッカー 🔥
    </h1>

    <div class="bg-white shadow-xl rounded-xl p-6 mb-8 border border-rose-200">
      <p class="text-lg text-gray-800 mb-4">
        名前を2つ入力して、あなたたちの因縁…もとい関係を暴きます。
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label for="name1" class="block text-sm font-semibold text-rose-600">名前（あなた）</label>
          <input
            type="text"
            id="name1"
            v-model="name1"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            placeholder="例: 佐藤花子"
          />
        </div>
        <div>
          <label for="name2" class="block text-sm font-semibold text-rose-600">名前（相手）</label>
          <input
            type="text"
            id="name2"
            v-model="name2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            placeholder="例: 山田太郎"
          />
        </div>
      </div>

      <button
        @click="diagnoseRelationship"
        :disabled="!name1 || !name2 || loading"
        class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition"
      >
        {{ loading ? '診断中...' : '運命を暴く！' }}
      </button>
    </div>

    <div v-if="results.love || results.friendship || results.work" id="diagnosis-results" class="bg-white shadow-lg rounded-xl p-6 mb-8 border-t-4 border-rose-500">
      <h2 class="text-2xl font-bold mb-4 text-center text-rose-700">診断レポート 📜</h2>

      <div class="space-y-6">
        <div v-if="averageCompatibility !== null" class="bg-rose-50 border-l-4 border-rose-400 text-rose-800 p-4" role="alert">
          <p class="font-bold text-xl mb-2">総合相性地獄度: {{ averageCompatibility }}%</p>
          <p class="text-base">{{ name1 }} と {{ name2 }} の関係は {{ averageCompatibility }}% の業火でつながっています🔥</p>
        </div>

        <div v-if="results.love" class="bg-pink-50 border-l-4 border-pink-400 text-pink-800 p-4">
          <p class="font-bold text-lg mb-1">💘 恋愛：{{ results.love.title }}（{{ results.love.compatibility }}%）</p>
          <p class="text-sm">{{ results.love.description }}</p>
        </div>

        <div v-if="results.friendship" class="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4">
          <p class="font-bold text-lg mb-1">👯‍♀️ 友情：{{ results.friendship.title }}（{{ results.friendship.compatibility }}%）</p>
          <p class="text-sm">{{ results.friendship.description }}</p>
        </div>

        <div v-if="results.work" class="bg-green-50 border-l-4 border-green-400 text-green-800 p-4">
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

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">エラー:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import html2canvas from 'html2canvas';

// OGP画像を定義
const route = useRoute();
defineOgImage({
  component: 'OgImageRelationship',
  props: {
    name1: route.query.name1 as string || '診断前',
    name2: route.query.name2 as string || '診断前',
    love: route.query.love as string || '診断前',
    friendship: route.query.friendship as string || '診断前',
    work: route.query.work as string || '診断前',
  },
});

interface RelationshipResult {
  title: string;
  description: string;
  category: string;
  compatibility: number;
}

interface DiagnosisResults {
  love: RelationshipResult | null;
  friendship: RelationshipResult | null;
  work: RelationshipResult | null;
}

const name1 = ref('');
const name2 = ref('');
const results = ref<DiagnosisResults>({
  love: null,
  friendship: null,
  work: null,
});
const loading = ref(false);
const error = ref<string | null>(null);

// ページ読み込み時にURLクエリから状態を復元
onMounted(() => {
  if (route.query.name1) name1.value = route.query.name1 as string;
  if (route.query.name2) name2.value = route.query.name2 as string;
  if (route.query.love_title) {
    results.value.love = {
      title: route.query.love_title as string,
      compatibility: parseInt(route.query.love_comp as string, 10),
      description: route.query.love_desc as string,
      category: 'love',
    };
  }
  if (route.query.friend_title) {
    results.value.friendship = {
      title: route.query.friend_title as string,
      compatibility: parseInt(route.query.friend_comp as string, 10),
      description: route.query.friend_desc as string,
      category: 'friendship',
    };
  }
  if (route.query.work_title) {
    results.value.work = {
      title: route.query.work_title as string,
      compatibility: parseInt(route.query.work_comp as string, 10),
      description: route.query.work_desc as string,
      category: 'work',
    };
  }
});

const diagnoseRelationship = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<DiagnosisResults>('/api/relationship-checker', {
      method: 'POST',
      body: { name1: name1.value, name2: name2.value },
    });
    results.value = response;

    // OGP画像とページ表示に必要なクエリパラメータを生成
    const params = new URLSearchParams();
    params.set('name1', name1.value);
    params.set('name2', name2.value);
    if (response.love) {
      params.set('love', `${response.love.title}（${response.love.compatibility}%）`);
      params.set('love_title', response.love.title);
      params.set('love_comp', response.love.compatibility.toString());
      params.set('love_desc', response.love.description);
    }
    if (response.friendship) {
      params.set('friendship', `${response.friendship.title}（${response.friendship.compatibility}%）`);
      params.set('friend_title', response.friendship.title);
      params.set('friend_comp', response.friendship.compatibility.toString());
      params.set('friend_desc', response.friendship.description);
    }
    if (response.work) {
      params.set('work', `${response.work.title}（${response.work.compatibility}%）`);
      params.set('work_title', response.work.title);
      params.set('work_comp', response.work.compatibility.toString());
      params.set('work_desc', response.work.description);
    }

    if (process.client) {
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }

  } catch (e: any) {
    error.value = e.data?.statusMessage || '診断中にエラーが発生しました。';
  } finally {
    loading.value = false;
  }
};

const averageCompatibility = computed(() => {
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

const twitterShareUrl = computed(() => {
  const shareText = `【地獄の関係相性チェッカー】\n${name1.value} と ${name2.value} の関係は...${averageCompatibility.value !== null ? `総合相性度: ${averageCompatibility.value}%でした！` : ''}\n\n${results.value.love ? `💘恋愛: ${results.value.love.title} (${results.value.love.compatibility}%)\n` : ''}${results.value.friendship ? `👯友情: ${results.value.friendship.title} (${results.value.friendship.compatibility}%)\n` : ''}${results.value.work ? `💼仕事: ${results.value.work.title} (${results.value.work.compatibility}%)` : ''}\n#地獄の相性診断`;

  if (process.client) {
    const url = window.location.href; // 現在のURL（クエリパラメータ付き）をそのまま使う
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  }
  // SSR時にはダミーのURLを返す
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
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
      error.value = '画像の保存に失敗しました。';
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
