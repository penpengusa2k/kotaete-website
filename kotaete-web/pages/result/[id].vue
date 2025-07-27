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

        <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
          <p class="font-bold mb-1">重要なお知らせ:</p>
          <p class="text-sm">このKOTAETEは、回答期限から60日経過すると、その結果を含め自動的にシステムから削除されます。削除されたアンケートは復元できませんので、必要な情報は早めにダウンロードしてください。</p>
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
                <th class="py-2 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">回答日時</th>
                <th v-for="(question, qIndex) in surveyData.questions" :key="qIndex" class="py-2 px-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  <Tooltip :content="formatQuestionHeader(question, qIndex)">
                    <span class="cursor-help">{{ `Q${qIndex + 1}` }}</span>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-light">
              <tr v-for="(result, rIndex) in results" :key="rIndex" class="hover:bg-neutral-lightest">
                <td class="py-2 px-3 text-sm text-neutral-darkest">
                  <span v-if="surveyData.anonymous">匿名ユーザー ({{ getRespondentIdShort(result) }})</span>
                  <span v-else>{{ getUsername(result) }}</span>
                </td>
                <td class="py-2 px-3 text-sm text-neutral-darkest">{{ formatTimestamp(result) }}</td>
                <td v-for="(question, qIndex) in surveyData.questions" :key="qIndex" class="py-2 px-3 text-sm text-neutral-darkest">
                  <span v-if="question.type === 'date'">
                    <Tooltip v-if="formatDateOnly(getAnswerByIndex(result, qIndex)) && String(formatDateOnly(getAnswerByIndex(result, qIndex))).length > 20" :content="formatDateOnly(getAnswerByIndex(result, qIndex))">
                      <span class="inline-block max-w-[120px] truncate cursor-help">{{ truncateText(formatDateOnly(getAnswerByIndex(result, qIndex)), 20) }}</span>
                    </Tooltip>
                    <span v-else>{{ truncateText(formatDateOnly(getAnswerByIndex(result, qIndex)), 20) }}</span>
                  </span>
                  <span v-else>
                    <Tooltip v-if="getAnswerByIndex(result, qIndex) && String(getAnswerByIndex(result, qIndex)).length > 20" :content="getAnswerByIndex(result, qIndex)">
                      <span class="inline-block max-w-[120px] truncate cursor-help">{{ truncateText(getAnswerByIndex(result, qIndex), 20) }}</span>
                    </Tooltip>
                    <span v-else>{{ truncateText(getAnswerByIndex(result, qIndex), 20) }}</span>
                  </span>
                </td>
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

// システムカラムのインデックスを動的に取得するためのComputedプロパティ
const systemColumnIndices = computed(() => {
  const indices = {
    respondent_id: resultHeaders.value.indexOf('respondent_id'),
    timestamp: resultHeaders.value.indexOf('timestamp'),
    username: resultHeaders.value.indexOf('username'),
  };
  return indices;
});

// 質問の回答が始まるカラムのオフセットを計算
const questionColumnOffset = computed(() => {
  if (!surveyData.value || !resultHeaders.value) return 0;
  // usernameがあるかないかでオフセットが変わる。
  // respondent_id と timestamp は常に存在
  let offset = 2; // respondent_id, timestamp
  if (systemColumnIndices.value.username !== -1) { // usernameが存在する場合
    offset = 3; // username, respondent_id, timestamp
  }
  return offset;
});

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

// 回答者IDのショートバージョンを取得
const getRespondentIdShort = (resultRow) => {
  const uuidIndex = systemColumnIndices.value.respondent_id;
  return uuidIndex !== -1 && resultRow[uuidIndex] ? String(resultRow[uuidIndex]).substring(0, 6) : 'N/A';
};

// ユーザー名を取得
const getUsername = (resultRow) => {
  const usernameIndex = systemColumnIndices.value.username;
  // 匿名ユーザーの場合、またはユーザー名が空の場合は「匿名ユーザー (UUID短縮形)」を返す
  if (surveyData.value.anonymous || !resultRow[usernameIndex] || String(resultRow[usernameIndex]).trim() === '') {
    return `匿名ユーザー (${getRespondentIdShort(resultRow)})`;
  }
  return String(resultRow[usernameIndex]);
};


// タイムスタンプをフォーマット（テーブル表示用）
const formatTimestamp = (resultRow) => {
  const timestampIndex = systemColumnIndices.value.timestamp;
  if (timestampIndex !== -1 && resultRow[timestampIndex]) {
    const date = new Date(resultRow[timestampIndex]);
    if (!isNaN(date.getTime())) {
      // YYYY/MM/DD HH:MM:SS 形式
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-'); // スラッシュをハイフンに置換
    }
  }
  return 'N/A';
};

// 質問に対する回答をインデックスで取得
const getAnswerByIndex = (resultRow, questionIndex) => {
  // resultHeadersの 'username', 'respondent_id', 'timestamp' の位置を正確に把握し、その後の質問回答のインデックスを計算
  const respondentIdIndex = systemColumnIndices.value.respondent_id;
  const timestampIndex = systemColumnIndices.value.timestamp;
  const usernameIndex = systemColumnIndices.value.username;

  // 質問データの開始インデックスを特定する
  // resultHeadersの中から質問Q1, Q2... に該当する部分を見つける
  let startOfQuestionsIndex = 0;
  if (resultHeaders.value.includes('Q1')) { // assuming Q1 is always the first question header
    startOfQuestionsIndex = resultHeaders.value.indexOf('Q1');
  } else {
    // If 'Q1' is not directly in headers (e.g., custom headers from GAS),
    // find the max index of system columns + 1
    startOfQuestionsIndex = Math.max(respondentIdIndex, timestampIndex, usernameIndex) + 1;
  }
  
  const colIndex = startOfQuestionsIndex + questionIndex;
  return resultRow[colIndex];
};


const getAnswersForQuestion = (questionIndex) => {
  const question = surveyData.value.questions[questionIndex];
  const answers = results.value.map(res => {
    const text = getAnswerByIndex(res, questionIndex);
    const respondentIdShort = getRespondentIdShort(res);
    const username = getUsername(res); // getUsername関数を使用

    return {
      text: question.type === 'date' ? formatDateOnly(text) : text,
      respondentIdShort: respondentIdShort,
      username: username
    };
  }).filter(ans => ans.text); // 回答があるもののみをフィルタリング
  return answers;
};


const countOccurrences = (questionIndex, optionValue) => {
  const answers = results.value.map(res => getAnswerByIndex(res, questionIndex)).filter(Boolean);
  return answers.reduce((count, answer) => {
    // チェックボックスの場合、回答がカンマ区切りで複数ある可能性を考慮
    const individualAnswers = String(answer).split(', ').map(s => s.trim());
    return count + (individualAnswers.includes(optionValue) ? 1 : 0);
  }, 0);
};

const totalResponses = computed(() => results.value.length);

const getPercentage = (count) => {
  if (totalResponses.value === 0) return 0;
  // このパーセンテージは、その選択肢を選んだ回答者の割合を示すべき
  // なので、分母は全体の回答数になる
  return (count / totalResponses.value) * 100;
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

  // ヘッダーの生成
  const headers = ['回答者', '回答日時']; // 固定ヘッダー

  surveyData.value.questions.forEach((q, index) => {
    headers.push(formatQuestionHeader(q, index));
  });

  const csvHeaders = headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',');

  // データの生成
  const rows = results.value.map(row => {
    const rowData = [];
    
    // 回答者 (匿名かどうかで表示を分ける)
    rowData.push(`"${String(getUsername(row)).replace(/"/g, '""')}"`);
    
    // 回答日時
    rowData.push(`"${formatTimestamp(row).replace(/"/g, '""')}"`);

    // 各質問の回答
    surveyData.value.questions.forEach((question, qIndex) => {
      let cellData = getAnswerByIndex(row, qIndex);
      // date型の場合はformatDateOnlyを適用
      if (question.type === 'date') {
        cellData = formatDateOnly(cellData);
      }
      rowData.push(`"${String(cellData || '').replace(/"/g, '""')}"`);
    });
    return rowData.join(',');
  });

  const csvContent = [csvHeaders, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `survey_results_${surveyId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
