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
      <div class="flex items-center mb-4">
        <span class="text-3xl font-bold mr-2 text-primary">Let's</span>
        <img src="/site-title.png" alt="KOTAETE" class="h-10">
      </div>
      <div class="mb-6 p-4 border rounded">
        <h1 class="text-3xl font-bold break-words mb-2">{{ survey.title }}</h1>
        <p class="text-gray-600 mb-2">Created by {{ survey.creator_name || '名無し' }}</p>
        <p class="text-gray-600 mb-2 whitespace-pre-wrap">{{ survey.description }}</p>
        <p class="text-base font-medium" :class="isExpired ? 'text-red-700' : 'text-green-700'">
          <span class="font-bold">{{ isExpired ? '回答締切済' : '回答受付中' }}:</span>
          {{ formatDeadline(survey.deadline) }}
        </p>
      </div>
      <hr class="my-6">

      <div v-if="isExpired" class="mb-6 p-4 border rounded border-red-500">
        <p class="text-lg text-red-700 font-semibold mb-3">このKOTAETEは回答期限を過ぎています。</p>
        <button @click="goToResults" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          結果を確認する
        </button>
      </div>

      <div v-else-if="hasSubmitted" class="mb-6 p-4 border rounded border-amber-500">
        <p class="text-lg text-amber-700 font-semibold mb-3">
          <span v-if="submitStatus === 'success'">ご回答ありがとうございました！</span>
          <span v-else>このKOTAETEには既に回答済みです。ご協力ありがとうございました。</span>
        </p>
        <button @click="goToResults" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          途中結果を確認する
        </button>
      </div>

      <form @submit.prevent="submitResponse" v-else>
        <div v-if="!survey.anonymous" class="mb-4">
          <label for="username" class="block text-gray-700 font-bold mb-2">ユーザー名 <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="あなたの名前を入力してください"
            :disabled="loading"
          >
        </div>

        <hr v-if="!survey.anonymous" class="my-6">
        <div v-for="(question, index) in survey.questions" :key="index" class="mb-6 p-4 border rounded">
          <label class="block text-gray-700 font-bold mb-2">
            Q{{ index + 1 }}. {{ question.text }} <span class="text-red-500">*</span>
          </label>

          <div v-if="question.type === 'text'" class="mt-2">
            <textarea
              v-model="responses[index]"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              maxlength="500"
              rows="3"
              :disabled="loading"
              @input="adjustTextareaHeight"
            ></textarea>
            <p class="text-right text-sm text-gray-500 mt-1">{{ responses[index]?.length || 0 }} / 500</p>
          </div>

          <div v-if="question.type === 'date'" class="mt-2">
            <input
              type="date"
              v-model="responses[index]"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              :disabled="loading"
            >
          </div>

          <div v-if="question.type === 'radio'" class="mt-2 space-y-2">
            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
              <label class="inline-flex items-center cursor-pointer text-gray-700">
                <input
                  type="radio"
                  :name="`question-${index}`"
                  :value="option.value"
                  v-model="responses[index]"
                  class="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  required
                  :disabled="loading"
                >
                <span class="ml-3 break-all">{{ option.value }}</span>
              </label>
            </div>
          </div>

          <div v-if="question.type === 'checkbox'" class="mt-2 space-y-2">
               <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
                  <label class="inline-flex items-center cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      :value="option.value"
                      v-model="responses[index]"
                      class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      :disabled="loading"
                    >
                    <span class="ml-3 break-all">{{ option.value }}</span>
                  </label>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :class="[ (submitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700', 'text-white font-bold py-3 px-6 rounded-full w-full text-xl flex items-center justify-center' ]"
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
        </div>
      </form>

      <div v-if="submitStatus === 'error'" class="mt-4 p-4 rounded border bg-red-100 border-red-400 text-red-700">
        <p>{{ submitMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useAsyncData, useHead, useRuntimeConfig, navigateTo } from '#imports';
import { formatDeadline } from '~/utils/formatters';

const route = useRoute();
const surveyId = route.params.id;
const config = useRuntimeConfig();

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

const isExpired = computed(() => {
  if (!survey.value || !survey.value.deadline) return false;
  return new Date(survey.value.deadline) < new Date();
});

const { data: surveyData, pending, error: fetchError } = await useAsyncData('survey', async () => {
  const res = await $fetch(`/api/gas-proxy?action=get&id=${surveyId}`);
  if (res.result !== 'success') throw new Error(res.message || 'Fetch failed');
  res.data.questions = JSON.parse(res.data.questions);
  return res.data;
});

survey.value = surveyData.value;
if (survey.value) {
  responses.value = survey.value.questions.map(q => (q.type === 'checkbox' ? [] : ''));
}
loading.value = pending.value;
error.value = fetchError.value?.message || '';

useHead(() => {
  const baseUrl = config.public.baseUrl;
  const ogpImageUrl = `${baseUrl}/api/ogp/${surveyId}`;
  const pageUrl = `${baseUrl}${route.fullPath}`;
  const title = surveyData.value?.title || 'KOTAETE';
  const desc = surveyData.value?.description || 'KOTAETEは簡単にアンケートを作成・回答できるサービスです。';

  return {
    title: `KOTAETE: ${title}`,
    meta: [
      { property: 'og:title', content: `KOTAETE: ${title}` },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: pageUrl },
      { property: 'og:image', content: ogpImageUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'KOTAETE' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `KOTAETE: ${title}` },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: ogpImageUrl },
    ]
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
  await getOrCreateRespondentId();
  if (survey.value) {
    responses.value = survey.value.questions.map(q => (q.type === 'checkbox' ? [] : ''));
  }
});

const adjustTextareaHeight = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

const submitResponse = async () => {
  const now = new Date();
  const deadline = new Date(survey.value.deadline);
  if (deadline < now) {
    submitMessage.value = 'このKOTAETEは回答期限を過ぎています。ページを更新します。';
    submitStatus.value = 'error';
    isExpired.value = true;
    setTimeout(() => {
      location.reload();
    }, 2000);
    return;
  }

  if (!survey.value.anonymous && (!username.value || username.value.trim() === '')) {
    submitMessage.value = 'ユーザー名を入力してください。';
    submitStatus.value = 'error';
    return;
  }

  // Checkbox validation
  for (let i = 0; i < survey.value.questions.length; i++) {
    const question = survey.value.questions[i];
    if (question.type === 'checkbox' && responses.value[i].length === 0) {
        alert(`質問${i + 1}に回答してください。`);
        return;
    }
  }


  submitting.value = true;
  submitMessage.value = '';
  submitStatus.value = '';

  const formattedResponses = [...responses.value];
  survey.value.questions.forEach((q, index) => {
    if (q.type === 'checkbox') {
      formattedResponses[index] = responses.value[index].join(', ');
    }
  });

  try {
    const response = await $fetch('/api/gas-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'answer',
        data: {
          id: surveyId,
          respondent_id: respondentId.value,
          username: survey.value.anonymous ? null : username.value,
          answers: formattedResponses
        }
      })
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

const goToResults = () => {
  navigateTo(`/result/${surveyId}`);
};
</script>
