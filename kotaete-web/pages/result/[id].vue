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
        <div class="flex items-center mb-4">
          <span class="text-3xl font-bold mr-2 text-primary">みんなの</span>
          <img src="/kotae.png" alt="KOTAETE" class="h-10 mt-1">
        </div>
        <div class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
          <h2 class="text-2xl font-bold break-words mb-2">{{ surveyData.title }}</h2>
          <p class="text-gray-600 mb-2">Created by {{ surveyData.creator_name || '名無し' }}</p>
          <p class="text-base font-medium" :class="isExpired ? 'text-danger' : 'text-secondary'">
            <span class="font-bold">{{ isExpired ? '回答締切済' : '回答受付中' }}:</span>
            {{ formatDeadline(surveyData.deadline) }}
          </p>
        </div>

        <hr class="my-6">
        <div v-for="(question, index) in surveyData.questions" :key="index" class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
          <h3 class="text-xl font-bold text-gray-800 mb-3">
            Q{{ index + 1 }}. {{ question.text }}
          </h3>

          <div v-if="question.type === 'text' || question.type === 'date'">
            <ul class="list-disc list-inside bg-neutral-lightest p-3 rounded-lg border border-neutral-light">
              <li v-for="(answer, aIndex) in getAnswersForQuestion(index)" :key="aIndex" class="mb-1 text-gray-700">
                {{ answer.text }}
                <span v-if="surveyData.anonymous" class="text-xs text-gray-500 ml-1"> (匿名ユーザー {{ answer.respondentIdShort }})
                </span>
                <span v-else class="text-xs text-gray-500 ml-1"> ({{ answer.username }}) </span>
              </li>
              <li v-if="getAnswersForQuestion(index).length === 0" class="text-gray-500 text-sm italic">
                まだ回答がありません。
              </li>
            </ul>
          </div>

          <div v-if="question.type === 'radio' || question.type === 'checkbox'" class="space-y-3">
            <div v-for="option in question.options" :key="option.value" class="p-2 bg-neutral-lightest rounded-lg border border-neutral-light">
              <div class="flex items-center justify-between mb-1">
                <span class="text-neutral-darkest break-all mr-2">{{ option.value }}</span>
                <span class="font-bold text-primary whitespace-nowrap">{{ countOccurrences(index, option.value) }}票</span>
              </div>
              <div class="w-full bg-neutral-light rounded-full h-2.5">
                <div class="bg-primary h-2.5 rounded-full" :style="{ width: getPercentage(countOccurrences(index, option.value)) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <hr class="my-6">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">全回答データ<span class="text-sm">（総回答数: </span><span class="text-primary">{{ results.length }}</span><span class="text-sm">件）</span></h2>
          <button @click="downloadCsv" class="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg text-sm shadow-md transition-colors duration-300">
            CSVダウンロード
          </button>
        </div>

        <div class="overflow-x-auto border border-neutral-light rounded-lg shadow-md">
          <table class="min-w-full bg-white">
            <thead class="bg-neutral-darkest">
              <tr>
                <th class="py-2 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">回答者</th>
                <th class="py-2 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">タイムスタンプ</th>
                <th v-for="(question, qIndex) in surveyData.questions" :key="qIndex" class="py-2 px-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  <Tooltip :content="formatQuestionHeader(question, qIndex)">
                    <span class="cursor-help">{{ `Q${qIndex + 1}` }}</span>
                  </Tooltip>
                </th>
                <th v-if="!surveyData.anonymous && resultHeaders.includes('username')" class="py-2 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">ユーザー名</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-light">
              <tr v-for="(result, rIndex) in results" :key="rIndex" class="hover:bg-neutral-lightest">
                <td class="py-2 px-3 text-sm text-neutral-darkest">
                  <span v-if="surveyData.anonymous">匿名ユーザー ({{ result[resultHeaders.indexOf('respondent_id')]?.substring(0, 6) || 'N/A' }})</span>
                  <span v-else>{{ result[resultHeaders.indexOf('respondent_id')] || 'N/A' }}</span>
                </td>
                <td class="py-2 px-3 text-sm text-neutral-darkest">{{ new Date(result[resultHeaders.indexOf('timestamp')]).toLocaleString() }}</td>
                <td v-for="(question, qIndex) in surveyData.questions" :key="qIndex" class="py-2 px-3 text-sm text-neutral-darkest">
                  <Tooltip v-if="result[qIndex + 2] && String(result[qIndex + 2]).length > 20" :content="result[qIndex + 2]">
                    <span class="inline-block max-w-[120px] truncate cursor-help">{{ truncateText(result[qIndex + 2], 20) }}</span>
                  </Tooltip>
                  <span v-else>{{ truncateText(result[qIndex + 2], 20) }}</span>
                </td>
                <td v-if="!surveyData.anonymous && resultHeaders.includes('username')" class="py-2 px-3 text-sm text-neutral-darkest">{{ result[resultHeaders.indexOf('username')] || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="results.length === 0" class="text-center py-4 text-neutral-dark bg-white">
            まだ回答データがありません。
          </div>
        </div>
      </div>

      <div v-else-if="showKeyInput" class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">閲覧キーの入力</h2>
        <p class="text-gray-700 mb-4">このKOTAETEの結果を確認するには閲覧キーを入力してください。</p>
        <div class="mb-4">
          <label for="accessKey" class="block text-gray-700 text-sm font-bold mb-2">閲覧キー</label>
          <input type="text" id="accessKey" v-model="inputKey" @keyup.enter="submitKey" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="閲覧キーを入力">
        </div>
        <p v-if="keyErrorMessage" class="text-red-500 text-sm mb-4">{{ keyErrorMessage }}</p>
        <button @click="submitKey" :disabled="submittingKey" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Tooltip from '~/components/Tooltip.vue'
import { formatDeadline } from '~/utils/formatters'

const route = useRoute();
const surveyId = route.params.id;
let viewingKey = route.query.key;

const surveyData = ref(null);
const results = ref([]);
const resultHeaders = ref([]);
const loading = ref(true);
const error = ref('');
const showKeyInput = ref(false);
const inputKey = ref('');
const keyErrorMessage = ref('');
const hasAccess = ref(false);
const submittingKey = ref(false);

const isExpired = computed(() => {
  if (!surveyData.value || !surveyData.value.deadline) return false;
  return new Date(surveyData.value.deadline) < new Date();
});

const formatDateOnly = (dateInput) => {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

const fetchSurveyAndResults = async (key = null) => {
  keyErrorMessage.value = '';
  if (!surveyData.value && !showKeyInput.value) {
    loading.value = true;
  }

  try {
    const surveyRes = await $fetch(`/api/gas-proxy?action=get&id=${surveyId}`);
    if (surveyRes.result === 'success') {
      surveyData.value = surveyRes.data;
      surveyData.value.questions = JSON.parse(surveyRes.data.questions);

      if (surveyData.value.result_restricted && !key) {
        showKeyInput.value = true;
        hasAccess.value = false;
        loading.value = false;
        return;
      }

      const currentKey = key || viewingKey;
      const resultsRes = await $fetch(`/api/gas-proxy?action=results&id=${surveyId}${currentKey ? `&viewing_key=${currentKey}` : ''}`);
      if (resultsRes.result === 'success' && resultsRes.data.length > 0) {
        resultHeaders.value = resultsRes.data.shift();
        results.value = resultsRes.data;
        hasAccess.value = true;
        showKeyInput.value = false;
        error.value = '';
      } else if (resultsRes.result !== 'success') {
        results.value = [];
        resultHeaders.value = [];
        keyErrorMessage.value = '結果の取得に失敗しました。閲覧キーが正しくない可能性があります。';
        hasAccess.value = false;
        showKeyInput.value = true;
        inputKey.value = '';
      }
    } else {
      throw new Error(surveyRes.message || 'KOTAETE情報の取得に失敗しました。');
    }
  } catch (e) {
    console.error('Error fetching results:', e);
    error.value = e.message;
    hasAccess.value = false;
    showKeyInput.value = false;
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
  submittingKey.value = true;
  try {
    await fetchSurveyAndResults(inputKey.value);
  } finally {
    submittingKey.value = false;
  }
};

onMounted(async () => {
  await fetchSurveyAndResults(viewingKey);
});

const getAnswersForQuestion = (questionIndex) => {
  const questionColIndex = questionIndex + 2;
  if (questionColIndex >= resultHeaders.value.length) return [];
  const question = surveyData.value.questions[questionIndex];
  const respondentIdCol = resultHeaders.value.indexOf('respondent_id');
  const usernameCol = resultHeaders.value.indexOf('username');
  return results.value.map(res => ({
    text: question.type === 'date' ? formatDateOnly(res[questionColIndex]) : res[questionColIndex],
    respondentIdShort: respondentIdCol !== -1 ? res[respondentIdCol]?.substring(0, 6) || 'N/A' : 'N/A',
    username: usernameCol !== -1 ? res[usernameCol] || 'N/A' : 'N/A'
  })).filter(ans => ans.text);
};

const countOccurrences = (questionIndex, optionValue) => {
  const questionColIndex = questionIndex + 2;
  if (questionColIndex >= resultHeaders.value.length) return 0;
  const answers = results.value.map(res => res[questionColIndex]).filter(Boolean);
  return answers.reduce((count, answer) => {
    const individualAnswers = String(answer).split(', ');
    return count + (individualAnswers.includes(optionValue) ? 1 : 0);
  }, 0);
};

const totalResponses = computed(() => results.value.length);

const getPercentage = (count) => {
  if (totalResponses.value === 0) return 0;
  const totalVotesForQuestion = results.value.length;
  if (totalVotesForQuestion === 0) return 0;
  return (count / totalVotesForQuestion) * 100;
};

const truncateText = (text, maxLength = 50) => {
  if (typeof text !== 'string' || !text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatQuestionHeader = (question, index) => {
  return `Q${index + 1}. ${question.text}`;
};

const downloadCsv = () => {
  if (results.value.length === 0) {
    alert('ダウンロードするデータがありません。');
    return;
  }
  const fixedHeaders = ['回答者', 'タイムスタンプ'];
  const questionHeaders = surveyData.value.questions.map((q, index) => formatQuestionHeader(q, index));
  const optionalHeaders = [];
  if (!surveyData.value.anonymous && resultHeaders.value.includes('username')) {
    optionalHeaders.push('ユーザー名');
  }
  const allHeaders = [...fixedHeaders, ...questionHeaders, ...optionalHeaders].map(header => `"${header.replace(/"/g, '""')}"`).join(',');
  const rows = results.value.map(row => {
    const rowData = [];
    rowData.push(`"${String(row[resultHeaders.value.indexOf('respondent_id')] || '').replace(/"/g, '""')}"`);
    rowData.push(`"${new Date(row[resultHeaders.value.indexOf('timestamp')] || '').toLocaleString().replace(/"/g, '""')}"`);
    surveyData.value.questions.forEach((question, qIndex) => {
      const cellData = row[qIndex + 2];
      let formattedCell = cellData;
      if (question.type === 'date') {
        formattedCell = formatDateOnly(cellData);
      }
      rowData.push(`"${String(formattedCell || '').replace(/"/g, '""')}"`);
    });
    if (!surveyData.value.anonymous && resultHeaders.value.includes('username')) {
      rowData.push(`"${String(row[resultHeaders.value.indexOf('username')] || '').replace(/"/g, '""')}"`);
    }
    return rowData.join(',');
  });
  const csvContent = [allHeaders, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `survey_results_${surveyId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

</script>
