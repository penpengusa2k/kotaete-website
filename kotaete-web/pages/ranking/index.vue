
<template>
  <div>
    <div class="flex items-center mb-6">
      <span class="material-icons-outlined text-4xl text-primary mr-2">leaderboard</span>
      <h1 class="text-3xl font-bold">KOTAETEランキング</h1>
    </div>

    <div class="mb-4 flex justify-center bg-gray-100 rounded-lg p-1">
      <button @click="switchRankingType('daily')" :class="['flex-1 text-center py-2 px-4 font-semibold transition-all duration-300 rounded-md', rankingType === 'daily' ? 'bg-white text-primary shadow' : 'text-gray-500 hover:bg-gray-200']">
        デイリー
      </button>
      <button @click="switchRankingType('weekly')" :class="['flex-1 text-center py-2 px-4 font-semibold transition-all duration-300 rounded-md', rankingType === 'weekly' ? 'bg-white text-primary shadow' : 'text-gray-500 hover:bg-gray-200']">
        ウィークリー
      </button>
    </div>

    <!-- タブ切り替え -->
    <div class="mb-6 flex border-b border-gray-200">
      <button @click="activeTab = 'likes'" :class="['flex-1 text-center py-3 px-4 font-semibold transition-colors duration-200', activeTab === 'likes' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500 hover:bg-gray-100']">
        <span class="material-icons-outlined mr-1 align-middle">favorite</span>
        いいね数
      </button>
      <button @click="activeTab = 'responses'" :class="['flex-1 text-center py-3 px-4 font-semibold transition-colors duration-200', activeTab === 'responses' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:bg-gray-100']">
        <span class="material-icons-outlined mr-1 align-middle">people</span>
        回答数
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 flex flex-col items-center justify-center">
      <svg class="animate-spin h-10 w-10 text-gray-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-lg text-gray-600">ランキングを読み込み中...</p>
    </div>

    <div v-else-if="error" class="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
      <h2 class="font-bold text-xl mb-2">エラーが発生しました</h2>
      <p class="text-base">ランキングの読み込みに失敗しました。{{ error }}</p>
    </div>

    <div v-else>
      <!-- いいね数ランキング -->
      <div v-show="activeTab === 'likes'" class="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-neutral-light">
        <ol class="space-y-8">
          <li v-for="(item, index) in rankings.likes" :key="item.id">
            <div class="relative group">
              <NuxtLink :to="`/result/${item.id}`">
                <div :class="['absolute top-0 left-0 z-10 w-12 h-12 flex items-center justify-center text-xl font-bold text-white rounded-br-lg', getRankColor(index)]">
                  {{ index + 1 }}
                </div>
                <img :src="`/api/ogp/${item.id}`" :alt="`${item.title}のOGP画像`" class="w-full h-auto rounded-lg shadow-md border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
              </NuxtLink>
            </div>
            <div class="mt-3">
              <h3 class="font-semibold text-lg text-neutral-darkest mb-1">
                <NuxtLink :to="`/result/${item.id}`" class="hover:text-primary hover:underline break-all">
                  {{ item.title }}
                </NuxtLink>
              </h3>
              <div class="text-sm text-gray-600 flex items-center">
                <span class="material-icons-outlined text-base mr-1 text-pink-500">thumb_up</span>
                +{{ item.like_count }} いいね
              </div>
            </div>
          </li>
        </ol>
        <p v-if="rankings.likes.length === 0" class="text-center text-gray-500 py-8">ランキングデータがまだありません。</p>
      </div>

      <!-- 回答数ランキング -->
      <div v-show="activeTab === 'responses'" class="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-neutral-light">
        <ol class="space-y-8">
          <li v-for="(item, index) in rankings.responses" :key="item.id">
            <div class="relative group">
              <NuxtLink :to="`/result/${item.id}`">
                <div :class="['absolute top-0 left-0 z-10 w-12 h-12 flex items-center justify-center text-xl font-bold text-white rounded-br-lg', getRankColor(index)]">
                  {{ index + 1 }}
                </div>
                <img :src="`/api/ogp/${item.id}`" :alt="`${item.title}のOGP画像`" class="w-full h-auto rounded-lg shadow-md border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
              </NuxtLink>
            </div>
            <div class="mt-3">
              <h3 class="font-semibold text-lg text-neutral-darkest mb-1">
                <NuxtLink :to="`/result/${item.id}`" class="hover:text-primary hover:underline break-all">
                  {{ item.title }}
                </NuxtLink>
              </h3>
              <div class="text-sm text-gray-600 flex items-center">
                <span class="material-icons-outlined text-base mr-1 text-blue-500">question_answer</span>
                +{{ item.response_count }} 回答
              </div>
            </div>
          </li>
        </ol>
        <p v-if="rankings.responses.length === 0" class="text-center text-gray-500 py-8">ランキングデータがまだありません。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const error = ref(null);
const rankings = ref({ likes: [], responses: [] });
const activeTab = ref('likes'); // 'likes' or 'responses'
const rankingType = ref('daily'); // 'daily' or 'weekly'

const fetchRankings = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await $fetch(`/api/gas-proxy?action=getRankings&type=${rankingType.value}`);
    if (response.result === 'success') {
      rankings.value = response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const switchRankingType = (type) => {
  rankingType.value = type;
  fetchRankings();
};

const getRankColor = (index) => {
  switch (index) {
    case 0: return 'bg-yellow-400 border-2 border-yellow-500 shadow-lg'; // Gold
    case 1: return 'bg-gray-400 border-2 border-gray-500 shadow-md';  // Silver
    case 2: return 'bg-yellow-600 border-2 border-yellow-700 shadow'; // Bronze
    default: return 'bg-gray-500 bg-opacity-80';
  }
};

onMounted(() => {
  fetchRankings();
});
</script>
