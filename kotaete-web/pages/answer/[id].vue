<template>
  <div>
    <div v-if="loading" class="text-center py-10 flex flex-col items-center justify-center">
      <svg class="animate-spin h-10 w-10 text-gray-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-lg text-gray-600">KOTAETEを読み込み中...</p>
    </div>
    <div v-else-if="error" class="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
      <h2 class="font-bold text-xl mb-2">エラーが発生しました</h2>
      <p class="text-base">{{ error }}</p>
    </div>
    <div v-else-if="survey">
      <div class="mb-8 p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-700">
        <h1 class="text-3xl font-bold mb-2 break-words">{{ survey.title }}</h1>
      <p class="text-gray-600 mb-6">{{ survey.description }}</p>
      <p class="text-gray-600 mb-2">Created by {{ survey.creator_name || '名無し' }}</p>
      </div>

      <div v-if="isExpired" class="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-red-700">
        <p class="text-lg text-red-700 font-semibold mb-3">このKOTAETEは回答期限を過ぎています。</p>
        <button @click="goToResults" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
          結果を確認する
        </button>
      </div>

      <div v-else-if="hasSubmitted" class="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-amber-500">
        <p class="text-lg text-amber-700 font-semibold mb-3">
          <span v-if="submitStatus === 'success'">ご回答ありがとうございました！</span>
          <span v-else>このKOTAETEには既に回答済みです。ご協力ありがとうございました。</span>
        </p>
        <button @click="goToResults" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
          途中結果を確認する
        </button>
      </div>

      <form @submit.prevent="submitResponse" v-else>
        <div v-if="!survey.anonymous" class="mb-6 p-6 bg-white rounded-lg shadow-md border-l-4 border-gray-400">
          <label for="username" class="block text-gray-700 font-bold text-lg mb-2">ユーザー名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
            required 
            placeholder="あなたの名前を入力してください"
            :disabled="loading"
          >
        </div>

        <div v-for="(question, index) in survey.questions" :key="index" class="mb-8 p-6 bg-white rounded-lg shadow-md">
          <label class="block text-gray-700 font-bold text-xl mb-4 pb-2 border-b-2 border-gray-200">
            <span class="inline-block border-l-4 border-teal-700 pl-3">Q{{ index + 1 }}. {{ question.text }}</span>
          </label>
          
          <div v-if="question.type === 'text'" class="mt-4">
            <input 
              type="text" 
              v-model="responses[index]" 
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              required 
              maxlength="500"
              :disabled="loading"
            >
            <p class="text-right text-sm text-gray-500 mt-1">{{ responses[index]?.length || 0 }} / 500</p>
          </div>

          <div v-if="question.type === 'date'" class="mt-4">
            <input 
              type="date" 
              v-model="responses[index]" 
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              required
              :disabled="loading"
            >
          </div>

          <div v-if="question.type === 'radio'" class="mt-4 space-y-3">
            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
              <label class="inline-flex items-center cursor-pointer text-gray-700">
                <input 
                  type="radio" 
                  :name="`question-${index}`" 
                  :value="option.value" 
                  v-model="responses[index]" 
                  class="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 transition-colors duration-200" 
                  required
                  :disabled="loading"
                >
                <span class="ml-3 text-base break-all">{{ option.value }}</span>
              </label>
            </div>
          </div>

          <div v-if="question.type === 'checkbox'" class="mt-4 space-y-3">
               <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
                  <label class="inline-flex items-center cursor-pointer text-gray-700">
                    <input 
                      type="checkbox" 
                      :value="option.value" 
                      v-model="responses[index][oIndex]" 
                      class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                      :disabled="loading"
                    >
                    <span class="ml-3 text-base break-all">{{ option.value }}</span>
                  </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg w-full transition-colors duration-200 flex items-center justify-center" 
            :disabled="submitting"
          >
            <span v-if="submitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            送信中...
          </span>
          <span v-else>回答を送信</span>
        </button>
      </form>

      <div v-if="submitStatus === 'error'" class="mt-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 shadow-sm">
        <p>{{ submitMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead, useRuntimeConfig } from '#app'

const route = useRoute();
const surveyId = route.params.id;
const config = useRuntimeConfig(); // ここに移動

const survey = ref(null);
const responses = ref([]);
const loading = ref(true);
const error = ref('');
const submitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref('');
const respondentId = ref('');
const hasSubmitted = ref(false);
const username = ref('');
const isExpired = ref(false);

// OGPメタタグの設定
useHead(() => {
  const baseUrl = config.public.baseUrl;
  const ogpImageUrl = `${baseUrl}/api/ogp/${surveyId}`;
  const pageUrl = `${baseUrl}${route.fullPath}`;

  return {
    title: survey.value ? `KOTAETE: ${survey.value.title}` : 'KOTAETE',
    meta: [
      { property: 'og:title', content: survey.value ? `KOTAETE: ${survey.value.title}` : 'KOTAETE' },
      { property: 'og:description', content: survey.value ? survey.value.description : 'KOTAETEは簡単にアンケートを作成・回答できるサービスです。' },
      { property: 'og:url', content: pageUrl },
      { property: 'og:image', content: ogpImageUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'KOTAETE' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: survey.value ? `KOTAETE: ${survey.value.title}` : 'KOTAETE' },
      { name: 'twitter:description', content: survey.value ? survey.value.description : 'KOTAETEは簡単にアンケートを作成・回答できるサービスです。' },
      { name: 'twitter:image', content: ogpImageUrl },
    ],
  };
});

const getOrCreateRespondentId = async () => {
  const { v4: uuidv4 } = await import('uuid');
  const storageKey = `respondent_id_${surveyId}`;
  let storedId = localStorage.getItem(storageKey);
  if (storedId) {
    respondentId.value = storedId;
  } else {
    storedId = uuidv4();
    localStorage.setItem(storageKey, storedId);
    respondentId.value = storedId;
  }
  hasSubmitted.value = localStorage.getItem(`submitted_${surveyId}`) === 'true';
};

onMounted(async () => {
  try {
    await getOrCreateRespondentId();

    const response = await $fetch(`/api/gas-proxy?action=get&id=${surveyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.result === 'success') {
      survey.value = response.data;
      survey.value.questions = JSON.parse(response.data.questions);

      if (survey.value.deadline && new Date(survey.value.deadline) < new Date()) {
        isExpired.value = true;
      }

      responses.value = survey.value.questions.map(q => {
        if (q.type === 'checkbox') return [];
        if (q.type === 'date') return ''; // 日付タイプも空文字列で初期化
        return '';
      });
    } else {
      error.value = response.message;
    }
  } catch (e) {
    console.error('Error fetching survey:', e);
    error.value = 'KOTAETEの読み込みに失敗しました。URLを確認してください。';
  } finally {
    loading.value = false;
  }
});

const submitResponse = async () => {
  if (!survey.value.anonymous && (!username.value || username.value.trim() === '')) {
    submitMessage.value = 'ユーザー名を入力してください。';
    submitStatus.value = 'error';
    return;
  }

  submitting.value = true;
  submitMessage.value = '';
  submitStatus.value = '';

  const formattedResponses = [...responses.value];
  survey.value.questions.forEach((q, index) => {
      if (q.type === 'checkbox') {
          const checkedOptions = q.options.filter((opt, optIndex) => formattedResponses[index] && formattedResponses[index][optIndex]);
          formattedResponses[index] = checkedOptions.map(opt => opt.value).join(', ');
      }
  });

  try {
    const response = await $fetch('/api/gas-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ 
        action: 'answer', 
        data: { 
          id: surveyId, 
          respondent_id: respondentId.value,
          username: survey.value.anonymous ? null : username.value,
          answers: formattedResponses 
        } 
      }),
    });

    if (response.result === 'success') {
      submitMessage.value = 'ご回答ありがとうございました！';
      submitStatus.value = 'success';
      hasSubmitted.value = true;
      localStorage.setItem(`submitted_${surveyId}`, 'true');
    } else {
      submitMessage.value = `回答の送信に失敗しました: ${response.message}`;
      submitStatus.value = 'error';
    }
  } catch (e) {
    console.error('Error submitting response:', e);
    submitMessage.value = '回答の送信中にエラーが発生しました。';
    submitStatus.value = 'error';
  } finally {
    submitting.value = false;
  }
};

const goToResults = async () => {
  navigateTo(`/result/${surveyId}`);
};
</script>
