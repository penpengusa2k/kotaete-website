<template>
  <div>
    <div v-if="loading" class="text-center py-10 flex flex-col items-center justify-center">
      <svg class="animate-spin h-10 w-10 text-gray-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-lg text-gray-600">集計結果を読み込み中...</p>
    </div>
    <div v-else-if="error" class="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
      <h2 class="font-bold text-xl mb-2">エラーが発生しました</h2>
      <p class="text-base">{{ error }}</p>
    </div>
    <div v-else-if="surveyData">
      <div v-if="hasAccess">
        <div class="mb-8 p-4 bg-white rounded-lg shadow-md border-l-4" :class="isExpired ? 'border-red-700' : 'border-blue-700'">
          <h1 class="text-3xl font-bold mb-2">「{{ surveyData.title }}」の集計結果</h1>
          <p class="text-base font-medium" :class="isExpired ? 'text-red-700' : 'text-green-700'">
            <span class="font-bold">{{ isExpired ? '回答締切済' : '回答受付中' }}:</span>
            {{ formatDeadline(surveyData.deadline) }}
          </p>
          <p class="text-gray-600 mb-2">Created by {{ surveyData.creator_name || '名無し' }}</p>
        </div>

        <div v-for="(question, index) in surveyData.questions" :key="index" class="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
            <span class="inline-block border-l-4 border-teal-700 pl-3">Q{{ index + 1 }}. {{ question.text }}</span>
          </h2>

          <div v-if="question.type === 'text' || question.type === 'date'" class="mt-4">
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded-lg border border-gray-200">
              <li v-for="(answer, aIndex) in getAnswersForQuestion(index)" :key="aIndex" class="mb-2 text-gray-700 last:mb-0">
                {{ answer.text }} 
                <span v-if="surveyData.anonymous" class="text-xs text-gray-500 ml-2">(匿名ユーザー {{ answer.respondentIdShort }})</span>
                <span v-else class="text-xs text-gray-500 ml-2">({{ answer.username }})</span>
              </li>
              <li v-if="getAnswersForQuestion(index).length === 0" class="text-gray-500 text-sm italic">
                まだ回答がありません。
              </li>
            </ul>
          </div>

          <div v-if="question.type === 'radio' || question.type === 'checkbox'" class="mt-4 space-y-4">
            <div v-for="option in question.options" :key="option.value" class="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div class="flex items-center mb-1">
                    <span class="text-gray-700 break-all flex-grow min-w-0 overflow-hidden mr-2">{{ option.value }}</span>
                    <span class="font-bold text-blue-700 flex-shrink-0 whitespace-nowrap">{{ countOccurrences(index, option.value) }}票</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" :style="{ width: getPercentage(countOccurrences(index, option.value)) + '%' }"></div>
                </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mt-10 mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">全回答データ（総回答数: <span class="text-blue-600">{{ results.length }}</span>件）</h2>
          <div class="flex items-center">
            <button @click="downloadCsv" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-md transition-colors duration-200">
              CSVダウンロード
            </button>
          </div>
        </div>

          <div class="overflow-x-auto relative z-0 border border-gray-200 rounded-lg shadow-md">
            <table class="min-w-full bg-white table-fixed">
              <thead>
                <tr class="bg-gray-800"> <th
                    v-for="(header, hIndex) in resultHeaders"
                    :key="hIndex"
                    class="py-3 px-4 border-b border-gray-700 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap overflow-visible sm:text-sm" >
                    <template v-if="formatHeader(header) && formatHeader(header).length > 20">
                      <Tooltip :content="formatHeader(header)">
                        <span class="inline-block max-w-[120px] truncate cursor-help">
                          {{ truncateText(formatHeader(header), 20) }}
                        </span>
                      </Tooltip>
                    </template>
                    <span v-else class="inline-block max-w-[120px] truncate">
                      {{ truncateText(formatHeader(header), 20) }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(result, rIndex) in results"
                  :key="rIndex"
                  class="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td
                    v-for="(header, hIndex) in resultHeaders"
                    :key="hIndex"
                    class="py-3 px-4 border-b border-gray-200 text-sm text-gray-800 whitespace-nowrap overflow-visible"
                  >
                    <span v-if="header === 'respondent_id'">
                      <span v-if="surveyData.anonymous">
                        匿名ユーザー ({{ result[hIndex]?.substring(0, 6) || 'N/A' }})
                      </span>
                      <span v-else>
                        {{ result[hIndex] || 'N/A' }}
                      </span>
                    </span>

                    <span v-else-if="header === 'timestamp'">
                      {{ new Date(result[hIndex]).toLocaleString() }}
                    </span>

                    <template v-else>
                      <template v-if="surveyData.questions.find(q => q.text === header && q.type === 'date')">
                        <span class="inline-block max-w-[150px] truncate">
                          {{ formatDateOnly(result[hIndex]) }}
                        </span>
                      </template>
                      <template v-else>
                        <Tooltip 
                          v-if="result[hIndex] && String(result[hIndex]).length > 50" 
                          :content="result[hIndex]">
                          <span class="inline-block max-w-[150px] truncate cursor-help">
                            {{ truncateText(result[hIndex]) }}
                          </span>
                        </Tooltip>
                        <span v-else class="inline-block max-w-[150px] truncate">
                          {{ truncateText(result[hIndex]) }}
                        </span>
                      </template>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="results.length === 0" class="text-center py-8 text-gray-500 text-lg bg-white">
              まだ回答データがありません。
            </div>
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
          :disabled="submittingKey"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
        >
          <span v-if="submittingKey" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            送信中...
          </span>
          <span v-else>キーを送信</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tooltip from '~/components/Tooltip.vue'

const route = useRoute();
const router = useRouter();
const surveyId = route.params.id;
let viewingKey = route.query.key;

const surveyData = ref(null);
const results = ref([]);
const resultHeaders = ref([]);
const loading = ref(true);
const error = ref('');
const showKeyInput = ref(false); // 閲覧キー入力フォームの表示制御
const inputKey = ref(''); // 入力された閲覧キー
const keyErrorMessage = ref(''); // 閲覧キー入力のエラーメッセージ
const hasAccess = ref(false); // コンテンツ表示制御
const submittingKey = ref(false); // キー送信中のローディング状態

const isExpired = computed(() => {
  if (!surveyData.value || !surveyData.value.deadline) return false;
  return new Date(surveyData.value.deadline) < new Date();
});

const formatDeadline = (deadline) => {
  if (!deadline) return '設定なし';
  const date = new Date(deadline);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatDateOnly = (dateInput) => {
  if (!dateInput) return '';
  let date;
  try {
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return ''; // エラー時は空文字列を返す
  }
};

const fetchSurveyAndResults = async (key = null) => {
  // Reset only key-related error messages, not general error
  keyErrorMessage.value = '';

  // Initial loading state for the whole page
  if (!surveyData.value && !showKeyInput.value) {
    loading.value = true;
  }

  try {
    const surveyRes = await $fetch(`/api/gas-proxy?action=get&id=${surveyId}`);

    if (surveyRes.result === 'success') {
      surveyData.value = surveyRes.data;
      surveyData.value.questions = JSON.parse(surveyRes.data.questions);

      // If restricted and no key provided yet (initial load or direct access without key)
      if (surveyData.value.result_restricted && !key) {
        showKeyInput.value = true;
        hasAccess.value = false;
        loading.value = false; // Stop main loading, show key input
        return;
      }

      const currentKey = key || viewingKey;
      const resultsRes = await $fetch(`/api/gas-proxy?action=results&id=${surveyId}${currentKey ? `&viewing_key=${currentKey}` : ''}`);

      if (resultsRes.result === 'success' && resultsRes.data.length > 0) {
        resultHeaders.value = resultsRes.data.shift();
        results.value = resultsRes.data;
        hasAccess.value = true;
        showKeyInput.value = false; // Hide key input on success
        error.value = ''; // Clear any previous general error
      } else if (resultsRes.result !== 'success') {
        // This is specifically for incorrect key or no data with key
        results.value = [];
        resultHeaders.value = [];
        // DO NOT set error.value here. Use keyErrorMessage.value instead.
        keyErrorMessage.value = '結果の取得に失敗しました。閲覧キーが正しくない可能性があります。';
        hasAccess.value = false;
        showKeyInput.value = true; // Keep key input form visible
        inputKey.value = ''; // Clear input for re-entry
      }
    } else {
      // This is a general error fetching survey data itself
      throw new Error(surveyRes.message || 'KOTAETE情報の取得に失敗しました。');
    }
  } catch (e) {
    console.error('Error fetching results:', e);
    error.value = e.message; // Set general error for unrecoverable issues
    hasAccess.value = false;
    showKeyInput.value = false; // Hide key input if general error occurs
  } finally {
    loading.value = false;
  }
};

const submitKey = async () => {
  keyErrorMessage.value = '';
  if (!inputKey.value) {
    keyErrorMessage.value = '閲覧キーを入力してください。';
    return;
  }

  submittingKey.value = true; // ローディング開始
  try {
    await fetchSurveyAndResults(inputKey.value);
  } finally {
    submittingKey.value = false; // ローディング終了
  }
};

onMounted(async () => {
  await fetchSurveyAndResults(viewingKey);
});

const getAnswersForQuestion = (questionIndex) => {
  const question = surveyData.value.questions[questionIndex];
  const questionText = question.text;
  const questionColIndex = resultHeaders.value.indexOf(questionText);
  if (questionColIndex === -1) return [];

  const respondentIdCol = resultHeaders.value.indexOf('respondent_id');
  const usernameCol = resultHeaders.value.indexOf('username');

  return results.value.map(res => ({
    text: question.type === 'date' ? formatDateOnly(res[questionColIndex]) : res[questionColIndex],
    respondentIdShort: respondentIdCol !== -1 ? res[respondentIdCol]?.substring(0, 6) || 'N/A' : 'N/A',
    username: usernameCol !== -1 ? res[usernameCol] || 'N/A' : 'N/A'
  })).filter(ans => ans.text);
};

const countOccurrences = (questionIndex, optionValue) => {
    const questionText = surveyData.value.questions[questionIndex].text;
    const questionColIndex = resultHeaders.value.indexOf(questionText);
    if (questionColIndex === -1) return 0;

    const answers = results.value.map(res => res[questionColIndex]).filter(Boolean);
    return answers.reduce((count, answer) => {
        const individualAnswers = String(answer).split(', ');
        return count + (individualAnswers.includes(optionValue) ? 1 : 0);
    }, 0);
};

const totalResponses = computed(() => results.value.length);

const getPercentage = (count) => {
  if (totalResponses.value === 0) return 0;
  return (count / totalResponses.value) * 100;
};

const truncateText = (text, maxLength = 50) => {
  if (typeof text !== 'string') return text;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatHeader = (header) => {
  const headerMap = {
    respondent_id: '回答者ID',
    timestamp: 'タイムスタンプ',
    username: 'ユーザー名'
  };
  return headerMap[header] || header;
};

const downloadCsv = () => {
  if (results.value.length === 0) {
    alert('ダウンロードするデータがありません。');
    return;
  }

  const headers = resultHeaders.value.map(header => `"${formatHeader(header).replace(/"/g, '""')}"`).join(',');
  const rows = results.value.map(row => {
    return row.map((cell, cellIndex) => {
      const header = resultHeaders.value[cellIndex];
      // 質問のヘッダーの場合のみ、日付タイプをチェックしてフォーマット
      const question = surveyData.value.questions.find(q => q.text === header);
      if (question && question.type === 'date') {
        return `"${formatDateOnly(cell).replace(/"/g, '""')}"`;
      } else {
        return `"${String(cell).replace(/"/g, '""')}"`;
      }
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `survey_results_${surveyId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
