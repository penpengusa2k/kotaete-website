<template>
  <div v-if="isHydrated" class="container mx-auto p-4 relative">
    <h1 class="text-3xl font-bold mb-6">KOTAETE作成完了！🎉</h1>

    <div class="p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-bold mb-3">KOTAETE「{{ surveyTitle }}」が作成されました！</h2>
      <p class="mb-4">以下のURLを共有して、KOTAETEを開始しましょう！</p>

      <!-- Answer URL -->
      <div class="mb-4">
        <p class="font-bold text-lg mb-1 shrink-0">回答用URL:</p>
        <div class="flex items-center">
          <div class="overflow-x-auto whitespace-nowrap bg-white p-1 rounded flex-grow">
            <a :href="answerUrl" target="_blank" class="text-blue-600 hover:underline"> {{ answerUrl }}</a>
          </div>
          <button @click="copyToClipboard(answerUrl, $event)" class="ml-2 p-1 bg-gray-200 hover:bg-gray-300 rounded shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Result URL -->
      <div class="mb-4">
        <p class="font-bold text-lg mb-1 shrink-0">結果確認用URL:</p>
        <div class="flex items-center">
          <div class="overflow-x-auto whitespace-nowrap bg-white p-1 rounded flex-grow">
            <a :href="resultUrl" target="_blank" class="text-blue-600 hover:underline"> {{ resultUrl }}</a>
          </div>
          <button @click="copyToClipboard(resultUrl, $event)" class="ml-2 p-1 bg-gray-200 hover:bg-gray-300 rounded shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Viewing Key -->
      <div v-if="isRestricted" class="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        <p class="font-bold text-lg mb-1">重要: 結果閲覧キー</p>
        <div class="flex items-center mb-2">
          <div class="overflow-x-auto whitespace-nowrap bg-yellow-50 p-1 rounded flex-grow">
            <p class="font-mono text-xl"> {{ viewingKey }}</p>
          </div>
          <button @click="copyToClipboard(viewingKey, $event)" class="ml-2 p-1 bg-gray-200 hover:bg-gray-300 rounded shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
        </div>
        <p class="text-sm mt-2">このKOTAETEは非公開設定です。上記の結果閲覧キーを大切に保存してください。このキーを知っている人のみが結果を閲覧できます。</p>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-xl font-bold mb-3">SNSでシェアしよう！</h3>
      <div class="flex flex-wrap gap-3">
        <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`" target="_blank" class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.597-8.717L5.25 22H1.942l7.356-8.406L2.25 2.25h3.308l5.979 7.679L18.244 2.25zM10.449 19.92L4.31 4.6H6.02L12.15 19.92h-1.701zm.464-1.797l-1.702-1.701L16.17 4.6h1.701l-7.058 13.523z"></path></svg>
          Xでシェア
        </a>
        <a :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(answerUrl)}&text=${encodeURIComponent(lineShareText)}`" target="_blank" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L10 12.586l4.293-4.293a1 1 0 011.414 1.414z"></path></svg>
          LINEでシェア
        </a>
        <a :href="`https://www.threads.net/intent/post?text=${encodeURIComponent(postText)}`" target="_blank" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 3.09 1.407 5.862 3.636 7.758l.364.305c.393.33.884.517 1.4.517.547 0 1.077-.2 1.49-.56l1.42-1.243c.347-.304.78-.465 1.23-.465h.9c.665 0 1.304.263 1.77.73l1.16 1.16c.453.452 1.1.707 1.77.707.513 0 1.007-.17 1.41-.48l.347-.287C20.582 17.837 22 15.073 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          Threadsでシェア
        </a>
      </div>
    </div>

    <div class="p-4 bg-gray-50 rounded border">
      <div class="flex items-center mb-1">
        <p class="text-sm font-semibold mr-2">コピーして拡散しよう！:</p>
        <button @click="copyToClipboard(postText, $event)" class="p-1 bg-gray-200 hover:bg-gray-300 rounded">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
        </button>
      </div>
      <textarea readonly class="w-full p-1 text-sm border rounded bg-white" rows="3" @focus="$event.target.select()" ref="postTextarea">{{ postText }}</textarea>
    </div>

    <div class="mt-8 text-center">
      <NuxtLink to="/" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        トップページに戻る
      </NuxtLink>
    </div>

    <transition name="fade">
      <div v-if="showCopiedMessage" class="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
        クリップボードにコピーしました！
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCreateStore } from '~/stores/create';

const isHydrated = ref(false)
const showCopiedMessage = ref(false)

onMounted(() => {
  isHydrated.value = true
  if (postTextarea.value) {
    postTextarea.value.style.height = 'auto';
    postTextarea.value.style.height = postTextarea.value.scrollHeight + 'px';
  }
});

const route = useRoute();
const createStore = useCreateStore();

const surveyId = route.params.id;
const surveyTitle = computed(() => createStore.title || '新しいKOTAETE')
const isRestricted = computed(() => createStore.isRestricted === true)
const viewingKey = computed(() => createStore.viewingKey || '')

const baseUrl = useRequestURL().origin;
const answerUrl = computed(() => `${baseUrl}/answer/${surveyId}`);
const resultUrl = computed(() => `${baseUrl}/result/${surveyId}`);

const postTextarea = ref(null);

const postText = computed(() => {
  return `KOTAETE「${surveyTitle.value}」が爆誕！ぜひKOTAETEください！
${answerUrl.value}
#KOTAETE #KOTAETEは簡単に作成できるアンケートサービスです`;
});

const lineShareText = computed(() => {
  return `KOTAETE「${surveyTitle.value}」にご協力ください！KOTAETEであなたの意見をサクッと送信！`;
});

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  } catch (err) {
    console.error('クリップボードへのコピーに失敗しました:', err);
    alert('クリップボードへのコピーに失敗しました。手動でコピーしてください。');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
