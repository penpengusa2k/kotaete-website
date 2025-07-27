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
        <img src="/site-title.png" alt="KOTAETE" class="h-10 mt-1">
      </div>
      <div class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
        <h2 class="text-2xl font-bold break-words mb-2">{{ survey.title }}</h2>
        <p class="text-gray-600 mb-2">Created by {{ survey.creator_name || '名無し' }}</p>
        <p class="text-gray-600 mb-2 whitespace-pre-wrap">{{ survey.description }}</p>
        <p class="text-base font-medium" :class="isExpired ? 'text-danger' : 'text-secondary'">
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
      <div v-if="hasSubmitted" class="mt-4 text-center">
        <NuxtLink to="/contact" class="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">
          ご意見・ご要望・その他お問合わせはこちら！
        </NuxtLink>
      </div>

      <form @submit.prevent="submitResponse" v-else>
        <div v-if="!survey.anonymous" class="mb-4">
          <label for="username" class="block text-gray-700 font-bold mb-2">ユーザー名 <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="username"
            v-model="username"
            :class="[
              'appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm',
              formSubmitted && validationErrors.username ? 'border-red-500' : ''
            ]"
            placeholder="あなたの名前を入力してください"
            :disabled="loading"
            @blur="formSubmitted && validateForm()"
            @input="formSubmitted && validateForm()"
          >
          <p v-if="formSubmitted && validationErrors.username" class="text-red-500 text-xs italic mt-1">{{ validationErrors.username }}</p>
        </div>

        <hr v-if="!survey.anonymous" class="my-6">
        <div v-for="(question, index) in survey.questions" :key="index" class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
          <label class="block text-gray-700 font-bold mb-2">
            Q{{ index + 1 }}. {{ question.text }}
            <span class="text-red-500" v-if="question.type === 'text' || question.type === 'date' || question.type === 'radio'">*</span>
          </label>

          <div v-if="question.type === 'text'" class="mt-2">
            <textarea
              v-model="responses[index]"
              :class="[
                'appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm',
                formSubmitted && validationErrors[index] ? 'border-red-500' : ''
              ]"
              maxlength="500"
              rows="3"
              :disabled="loading"
              @input="adjustTextareaHeight($event); formSubmitted && validateForm()"
              @blur="formSubmitted && validateForm()"
            ></textarea>
            <p v-if="formSubmitted && validationErrors[index]" class="text-red-500 text-xs italic mt-1">{{ validationErrors[index] }}</p>
            <p class="text-right text-sm text-gray-500 mt-1">{{ responses[index]?.length || 0 }} / 500</p>
          </div>

          <div v-if="question.type === 'date'" class="mt-2">
            <input
              type="date"
              v-model="responses[index]"
              :class="[
                'appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm',
                formSubmitted && validationErrors[index] ? 'border-red-500' : ''
              ]"
              :disabled="loading"
              @change="formSubmitted && validateForm()"
              @click="openDatePicker($event)"
              @blur="formSubmitted && validateForm()"
            >
            <p v-if="formSubmitted && validationErrors[index]" class="text-red-500 text-xs italic mt-1">{{ validationErrors[index] }}</p>
          </div>

          <div v-if="question.type === 'radio'" class="mt-2 space-y-2">
            <div
              :class="[
                'p-2 rounded', // Add padding and rounding to the container
                formSubmitted && validationErrors[index] ? 'border border-red-500' : '' // Apply red border to container
              ]"
            >
              <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
                <label class="inline-flex items-center cursor-pointer text-gray-700">
                  <input
                    type="radio"
                    :name="`question-${index}`"
                    :value="option.value"
                    v-model="responses[index]"
                    class="form-radio h-5 w-5 text-primary border-neutral-light focus:ring-primary-dark transition-colors duration-200"
                    :disabled="loading"
                    @change="formSubmitted && validateForm()"
                  >
                  <span class="ml-3 break-all">{{ option.value }}</span>
                </label>
              </div>
            </div>
            <p v-if="formSubmitted && validationErrors[index]" class="text-red-500 text-xs italic mt-1">{{ validationErrors[index] }}</p>
          </div>

          <div v-if="question.type === 'checkbox'" class="mt-2 space-y-2">
            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
              <label class="inline-flex items-center cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  :value="option.value"
                  v-model="responses[index]"
                  class="form-checkbox h-5 w-5 text-primary border-neutral-light rounded focus:ring-primary-dark transition-colors duration-200"
                  :disabled="loading"
                  @change="formSubmitted && validateForm()"
                >
                <span class="ml-3 break-all">{{ option.value }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="formSubmitted && Object.keys(validationErrors).length > 0" class="mt-4 p-4 rounded border bg-red-100 border-red-400 text-red-700">
          <p>必須項目に未入力があります。</p>
        </div>

        <div class="mt-8">
          <button
            type="submit"
            :class="[ submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark', 'text-white font-bold py-3 px-6 rounded-lg w-full text-xl flex items-center justify-center shadow-md transition-colors duration-300' ]"
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
import { ref, computed, onMounted, watch } from 'vue';
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
const formSubmitted = ref(false); // フォームが一度でも送信されようとしたかどうかのフラグ
const validationErrors = ref({}); // バリデーションエラーを保持するオブジェクト

const isExpired = computed(() => {
  if (!survey.value || !survey.value.deadline) return false;
  return new Date(survey.value.deadline) < new Date();
});

const { data: surveyData, pending, error: fetchError } = await useAsyncData('survey', async () => {
  const res = await $fetch(`/api/gas-proxy?action=get&id=${surveyId}`);
  if (res.result !== 'success') {
    // ライフサイクルで削除された場合などを想定
    throw new Error(res.message || 'KOTAETEが見つかりませんでした。');
  }
  res.data.questions = JSON.parse(res.data.questions);
  return res.data;
});

// データ取得でエラーが発生した場合（例: アンケートが存在しない）、ホームページにリダイレクト
if (fetchError.value) {
  await navigateTo('/', { redirectCode: 301 }); // 301リダイレクト
}

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

// responses と username の変更を監視する watch は、
// formSubmitted が true の場合のみ validateForm を呼び出すように変更
watch([responses, username], () => {
  if (formSubmitted.value) {
    validateForm();
  }
}, { deep: true });


const adjustTextareaHeight = (event) => {
  if (event && event.target) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
};

const openDatePicker = (event) => {
  if (event.target) {
    try {
      event.target.showPicker();
    } catch (error) {
      console.error("showPicker() is not supported by this browser.", error);
    }
  }
};

const validateForm = () => {
  const errors = {};

  // ユーザー名のバリデーション
  if (!survey.value.anonymous && (!username.value || username.value.trim() === '')) {
    errors.username = 'ユーザー名を入力してください。';
  }

  // 各質問のバリデーション
  survey.value.questions.forEach((question, index) => {
    const responseValue = responses.value[index];

    switch (question.type) {
      case 'text':
      case 'date':
        if (!responseValue || (typeof responseValue === 'string' && responseValue.trim() === '')) {
          errors[index] = 'この質問は必須です。';
        }
        break;
      case 'radio':
        if (!responseValue || responseValue === '') {
          errors[index] = 'いずれかの選択肢を選んでください。';
        }
        break;
      case 'checkbox':
        // チェックボックスは未入力を許容するため、ここでは必須チェックを行わない
        break;
    }
  });
  validationErrors.value = errors; // validationErrors を更新
  return Object.keys(errors).length === 0; // エラーがなければtrue
};

const submitResponse = async () => {
  // 送信ボタンが押されたタイミングで formSubmitted を true に設定
  // これにより、formSubmitted に依存するバリデーション表示が有効になる
  formSubmitted.value = true; 

  // フォーム全体のバリデーションを実行
  if (!validateForm()) {
    // バリデーションエラーがある場合は、具体的なエラーメッセージと赤枠で知らせる
    // サーバー送信エラーと区別するため、submitMessage/submitStatusは更新しない
    submitMessage.value = ''; // 以前のエラーメッセージをクリア
    submitStatus.value = ''; // 以前のエラーステータスをクリア

    // エラーがある場合は一番上のエラー要素にスクロール
    const firstErrorElement = document.querySelector('.border-red-500');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const now = new Date();
  const deadline = new Date(survey.value.deadline);
  if (deadline < now) {
    submitMessage.value = 'このKOTAETEは回答期限を過ぎています。ページを更新します。';
    submitStatus.value = 'error';
    setTimeout(() => {
      location.reload();
    }, 2000);
    return;
  }

  submitting.value = true;
  submitMessage.value = ''; // サーバー送信前のメッセージをクリア
  submitStatus.value = ''; // サーバー送信前のステータスをクリア

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
      // わずかな遅延を挟んで hasSubmitted を更新
      // DOM の更新サイクルを考慮し、エラーを防ぐための対策
      setTimeout(() => {
        hasSubmitted.value = true;
        localStorage.setItem(`submitted_${surveyId}`, 'true');
      }, 100); // 100ミリ秒の遅延
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

<style scoped>
/* input[type="date"]のデフォルトカレンダーアイコンを非表示 */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
