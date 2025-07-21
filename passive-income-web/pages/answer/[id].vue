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
      <div v-if="hasAccess">
        <div class="mb-8 p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-700">
          <h1 class="text-3xl font-bold mb-2 break-words">{{ survey.title }}</h1>
        <p class="text-gray-600 mb-2">Created by {{ survey.creator_name || '名無し' }}</p>
        <p class="text-gray-600 mb-6">{{ survey.description }}</p>
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
              >
              <p class="text-right text-sm text-gray-500 mt-1">{{ responses[index]?.length || 0 }} / 500</p>
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
                  >
                  <span class="ml-3 text-base">{{ option.value }}</span>
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
                    >
                    <span class="ml-3 text-base">{{ option.value }}</span>
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

      <div v-else-if="showKeyInput" class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">閲覧キーの入力</h2>
        <p class="text-gray-700 mb-4">このKOTAETEの結果を確認するには閲覧キーを入力してください。</p>
        <div class="mb-4">
          <label for="accessKey" class="block text-gray-700 text-sm font-bold mb-2">閲覧キー</label>
          <input
            type="text"
            id="accessKey"
            v-model="inputKey"
            @keyup.enter="submitKey"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="閲覧キーを入力"
          >
        </div>
        <p v-if="keyErrorMessage" class="text-red-500 text-sm mb-4">{{ keyErrorMessage }}</p>
        <button
          @click="submitKey"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          キーを送信
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#app'

const route = useRoute();
const surveyId = route.params.id;

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
const showKeyInput = ref(false); // 閲覧キー入力フォームの表示制御
const inputKey = ref(''); // 入力された閲覧キー
const keyErrorMessage = ref(''); // 閲覧キー入力のエラーメッセージ
const hasAccess = ref(false); // コンテンツ表示制御

// OGPメタタグの設定
watch(survey, (newSurvey) => {
  if (newSurvey) {
    const ogpImageUrl = `${window.location.origin}/api/ogp/${surveyId}`;
    useHead({
      title: newSurvey.title,
      meta: [
        { property: 'og:title', content: newSurvey.title },
        { property: 'og:description', content: newSurvey.description || 'KOTAETEは簡単・無料のアンケート作成サービスです。' },
        { property: 'og:image', content: ogpImageUrl },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: newSurvey.title },
        { name: 'twitter:description', content: newSurvey.description || 'KOTAETEは簡単・無料のアンケート作成サービスです。' },
        { name: 'twitter:image', content: ogpImageUrl },
      ],
    });
  }
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

      // 閲覧キーが設定されている場合は、hasAccessをfalseに設定し、入力フォームを表示
      if (survey.value.result_restricted) {
        hasAccess.value = false;
        showKeyInput.value = true; // 閲覧キー入力フォームを表示
      } else {
        hasAccess.value = true; // 閲覧キーが不要な場合はすぐにアクセス許可
      }

      responses.value = survey.value.questions.map(q => {
        if (q.type === 'checkbox') return [];
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

const submitKey = async () => {
  keyErrorMessage.value = '';
  if (!inputKey.value) {
    keyErrorMessage.value = '閲覧キーを入力してください。';
    return;
  }

  try {
    const response = await $fetch(`/api/gas-proxy?action=checkKey&id=${surveyId}&key=${inputKey.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.result === 'success' && response.data.isValid) {
      hasAccess.value = true;
      showKeyInput.value = false;
    } else {
      keyErrorMessage.value = '閲覧キーが正しくありません。';
    }
  } catch (e) {
    console.error('Error checking key:', e);
    keyErrorMessage.value = '閲覧キーの確認中にエラーが発生しました。';
  }
};

const goToResults = async () => {
  if (survey.value.result_restricted) {
    showKeyInput.value = true; // 結果ページへの遷移時もキー入力フォームを表示
  } else {
    navigateTo(`/result/${surveyId}`);
  }
};
</script>
