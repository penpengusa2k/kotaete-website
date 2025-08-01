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
          <div class="mt-4 flex items-center">
            <button @click="likeSurvey" :disabled="liked" class="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons-outlined mr-2">thumb_up</span>
              いいね！
            </button>
            <span class="ml-4 text-lg font-bold text-gray-700">{{ likeCount }}</span>
          </div>
        </div>

        <div v-if="!isExpired && hasAccess && !hasUserAnswered" class="my-6">
          <button @click="goToAnswerPage" :disabled="isNavigating" class="block w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-75 disabled:cursor-wait">
            <span v-if="isNavigating" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              読み込み中...
            </span>
            <span v-else>
              自分もKOTAEる
            </span>
          </button>
        </div>

        <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
          <p class="font-bold mb-1">重要なお知らせ:</p>
          <p class="text-sm">このKOTAETEは、回答期限から60日経過すると、その結果を含め自動的にシステムから削除されますので、必要な情報は早めにダウンロードしてください。</p>
        </div>

        <hr class="my-6">
        <div v-for="(question, index) in surveyData.questions" :key="index" class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
          <h3 class="text-xl font-bold text-gray-800 mb-3">
            Q{{ index + 1 }}. {{ question.text }}
          </h3>

          <div v-if="question.type === 'text' || question.type === 'date'">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(answer, aIndex) in getAnswersForQuestion(index)" :key="aIndex" class="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                <p class="text-gray-800">{{ answer.text }}</p>
                <p class="text-xs text-gray-500 mt-2 text-right">
                  <span v-if="surveyData.anonymous">匿名ユーザー {{ answer.respondentIdShort }}</span>
                  <span v-else>{{ answer.username }}</span>
                </p>
              </div>
            </div>
            <p v-if="getAnswersForQuestion(index).length === 0" class="text-gray-500 text-sm italic mt-4">
              まだ回答がありません。
            </p>
          </div>

          <div v-if="['5-point', 'radio', 'checkbox'].includes(question.type)" class="p-4 border border-gray-300 rounded-lg bg-white">
            <div v-if="question.type === '5-point'" class="flex items-center mb-2">
              <p class="text-lg font-semibold text-gray-700">平均評価:</p>
              <p class="text-2xl font-bold text-primary ml-2">{{ calculateAverage(index) }}</p>
            </div>
            <div :ref="el => chartContainer[index] = el" class="relative h-56">
              <canvas :id="`chart-${index}`" class="absolute inset-0 w-full h-full bg-white rounded-md z-0"></canvas>
            </div>
            <!-- 凡例を追加 -->
            <div v-if="['radio', 'checkbox'].includes(question.type)" class="mt-4 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-semibold text-gray-600 mb-2">凡例</h4>
              <ul class="list-none space-y-1 text-xs sm:text-sm">
                <li v-for="(option, optIndex) in question.options" :key="optIndex" class="flex items-start">
                  <span class="font-bold mr-2 w-8 shrink-0 text-center">{{ getCircleNumber(optIndex) }}</span>
                  <span class="flex-1 break-words">{{ option.value }}</span>
                </li>
              </ul>
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
                  <span v-else-if="question.type === '5-point'">
                    {{ getAnswerByIndex(result, qIndex) }}
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
import { ref, onMounted, computed, nextTick, onUpdated, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tooltip from '~/components/Tooltip.vue'
import { formatDeadline } from '~/utils/formatters'
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const route = useRoute();
const router = useRouter();
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
const likeCount = ref(0);
const liked = ref(false);
const isNavigating = ref(false);

const hasUserAnswered = computed(() => {
  if (process.client) {
    return localStorage.getItem(`submitted_${surveyId}`) === 'true';
  }
  return false;
});

const goToAnswerPage = async () => {
  isNavigating.value = true;
  try {
    await router.push(`/answer/${surveyId}`);
  } catch (e) {
    console.error('Failed to navigate:', e);
    isNavigating.value = false; // Stop loading if navigation fails
  }
};

// 各チャートのコンテナDOM要素への参照を保持
const chartContainer = ref({});

// カスタムツールチップ要素への参照
let customTooltipEl = null;

const numberedCircle = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
const getCircleNumber = (index) => {
  return numberedCircle[index] || `(${index + 1})`;
};

const systemColumnIndices = computed(() => {
  const indices = {
    respondent_id: resultHeaders.value.indexOf('respondent_id'),
    timestamp: resultHeaders.value.indexOf('timestamp'),
    username: resultHeaders.value.indexOf('username'),
  };
  return indices;
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
      likeCount.value = surveyRes.data.like_count || 0;
      liked.value = localStorage.getItem(`liked_survey_${surveyId}`) === 'true';

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
      await navigateTo('/', { redirectCode: 301 });
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

const likeSurvey = async () => {
  if (liked.value) {
    return;
  }

  // --- Step 1: Update UI and localStorage first (Optimistic Update) ---
  liked.value = true;
  likeCount.value++;
  // Save to localStorage immediately to prevent issues on reload.
  localStorage.setItem(`liked_survey_${surveyId}`, 'true');

  try {
    // --- Step 2: Send request to the backend ---
    const response = await $fetch('/api/gas-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'like', id: surveyId }),
    });

    // --- Step 3: Handle backend response ---
    if (response.result === 'success') {
      // Sync with the actual count from the server to ensure consistency.
      likeCount.value = response.like_count;
    } else {
      // If the server reports a specific failure, notify the user.
      // We do NOT revert the UI here, as the user might have intended to like it.
      // A page refresh will show the true state.
      alert(`サーバーでエラーが発生しました: ${response.message} ページを更新してください。`);
    }
  } catch (error) {
    // This block catches network errors or reloads.
    console.error('Error liking survey:', error);
    // We do NOT revert the UI. The request might have succeeded on the server.
    // Instead, we inform the user to check the state by reloading.
    alert('通信に失敗しました。ページを再読み込みして、いいねが反映されているか確認してください。');
  }
};

// --- カスタムツールチップ関連関数 ---
const getOrCreateCustomTooltip = () => {
  if (!customTooltipEl) {
    customTooltipEl = document.createElement('div');
    customTooltipEl.className = 'custom-chart-tooltip'; 
    document.body.appendChild(customTooltipEl); 
  }
  return customTooltipEl;
};

const showCustomTooltip = (text, x, y) => {
  const tooltip = getOrCreateCustomTooltip();
  tooltip.innerHTML = text;
  
  // ツールチップの現在サイズを取得
  // `offset` プロパティは、要素がレンダリングされるまで正確な値を持たない場合があるため
  // `getBoundingClientRect` を使用するのがより確実です。
  // ただし、今回はシンプルに、ツールチップが表示される前に計算するため、DOMツリーに
  // 追加された直後であれば問題ありません。
  
  // まず表示してサイズを確定させる（opacity:0の状態で）
  tooltip.style.opacity = '0.01'; // 一時的に非常に薄く表示
  tooltip.style.left = '0px'; // 仮の位置
  tooltip.style.top = '0px';   // 仮の位置
  
  // DOMに反映されるのを待つ
  requestAnimationFrame(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    let finalX = x + window.scrollX + 10; // カーソルから少しずらす
    let finalY = y + window.scrollY + 10;

    // 画面右端からはみ出す場合の調整
    if (finalX + tooltipRect.width > window.innerWidth + window.scrollX) {
      finalX = window.innerWidth + window.scrollX - tooltipRect.width - 10; // 画面右端から10pxマージン
    }
    // 画面下端からはみ出す場合の調整
    if (finalY + tooltipRect.height > window.innerHeight + window.scrollY) {
      finalY = y + window.scrollY - tooltipRect.height - 10; // カーソル位置の上側
    }
    // 画面左端からはみ出す場合の調整
    if (finalX < window.scrollX) {
      finalX = window.scrollX + 10; // 画面左端から10pxマージン
    }
    // 画面上端からはみ出す場合の調整
    if (finalY < window.scrollY) {
      finalY = window.scrollY + 10; // 画面上端から10pxマージン
    }

    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;
    tooltip.style.opacity = '1';
  });
};

const hideCustomTooltip = () => {
  if (customTooltipEl) {
    customTooltipEl.style.opacity = '0';
  }
};

// --- Chart.js の描画とイベント設定 ---
const renderCharts = () => {
  // 既存のチャートがあれば破棄
  if (window.myCharts) {
    Object.values(window.myCharts).forEach(chart => {
      // イベントリスナーを削除してから破棄
      if (chart.canvas.__labelHoverListener) {
        chart.canvas.removeEventListener('mousemove', chart.canvas.__labelHoverListener);
        chart.canvas.removeEventListener('mouseout', hideCustomTooltip);
        delete chart.canvas.__labelHoverListener;
      }
      chart.destroy();
    });
  }
  window.myCharts = {};

  surveyData.value.questions.forEach((question, index) => {
    if (['5-point', 'radio', 'checkbox'].includes(question.type)) {
      const ctx = document.getElementById(`chart-${index}`);
      if (!ctx) return;

      let chartLabels = [];
      let originalLabels = []; // 元のラベルを保持
      let chartData = [];
      let tooltipTitleCallback;

      if (question.type === '5-point') {
        const answers = getAnswersForQuestion(index).map(a => parseInt(a.text, 10)).filter(n => !isNaN(n) && n >= 1 && n <= 5);
        const counts = [0, 0, 0, 0, 0];
        answers.forEach(ans => { if (ans >= 1 && ans <= 5) counts[ans - 1]++; });
        chartLabels = ['1', '2', '3', '4', '5'];
        originalLabels = chartLabels; // 5段階評価はラベルが短いのでそのまま
        chartData = counts;
        tooltipTitleCallback = (context) => `評価: ${context[0].label} (${context[0].formattedValue}票)`;
      } else if (question.type === 'radio' || question.type === 'checkbox') {
        originalLabels = question.options.map(o => o.value);
        chartLabels = originalLabels.map((_, i) => getCircleNumber(i));
        chartData = originalLabels.map(option => countOccurrences(index, option));
        
        tooltipTitleCallback = (context) => {
            if (context[0]) {
                const originalLabel = originalLabels[context[0].dataIndex];
                return `${originalLabel} (${context[0].formattedValue}票)`;
            }
            return '';
        };
      }

      window.myCharts[index] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: '回答数',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)'
            ],
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 0,
            barThickness: 15,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              display: false,
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              }
            },
            y: {
              ticks: {
                color: '#444',
                font: {
                  size: 14,
                  family: 'system-ui, sans-serif',
                  weight: 'bold',
                },
              },
              grid: {
                display: false,
                drawBorder: false,
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            },
            tooltip: {
              enabled: true, // 棒にホバーした時の標準ツールチップは有効
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              titleColor: '#fff',
              bodyColor: '#fff',
              callbacks: {
                title: tooltipTitleCallback,
                label: function(context) {
                  return '';
                },
                afterLabel: function(context) {
                  const selectedValue = originalLabels[context.dataIndex];
                  const voters = results.value.filter(row => {
                    const answer = getAnswerByIndex(row, index);
                    if (question.type === 'checkbox') {
                      return String(answer).split(', ').map(s => s.trim()).includes(selectedValue);
                    } else {
                      return String(answer) === String(selectedValue);
                    }
                  }).map(row => getUsername(row));

                  if (voters.length > 0) {
                    const maxVotersToShow = 5;
                    const displayedVoters = voters.slice(0, maxVotersToShow);
                    let tooltipText = `投票者: ${displayedVoters.join(', ')}`;
                    if (voters.length > maxVotersToShow) {
                      tooltipText += ` 他${voters.length - maxVotersToShow}名`;
                    }
                    return tooltipText;
                  } else {
                    return '投票者はいません。';
                  }
                }
              },
              external: null
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              offset: 4,
              color: '#444',
              font: {
                weight: 'bold',
                size: 14,
              },
              formatter: function(value, context) {
                return value + '票';
              }
            }
          },
          layout: {
            padding: {
              left: 10,
              right: 40,
              top: 10,
              bottom: 10
            }
          },
          animation: {
            onComplete: () => {
              setupChartEventListeners(window.myCharts[index], originalLabels);
            }
          }
        }
      });
    }
  });
};

// Y軸ラベル用のイベントリスナー設定
const setupChartEventListeners = (chart, labels) => {
  const canvas = chart.canvas;
  const ctx = chart.ctx;
  const yAxis = chart.scales.y;

  // 既存のリスナーがあれば削除
  if (canvas.__labelHoverListener) {
    canvas.removeEventListener('mousemove', canvas.__labelHoverListener);
    canvas.removeEventListener('mouseout', hideCustomTooltip);
  }

  // イベントリスナーの定義
  const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hoveredLabel = null;

    labels.forEach((label, i) => {
      const labelY = yAxis.getPixelForValue(yAxis.ticks[i].value);
      const labelX = yAxis.left; 

      const labelWidth = yAxis.width; 
      const labelHeight = 20; 

      if (x >= labelX - 10 && x <= labelX + labelWidth + 10 && 
          y >= labelY - labelHeight / 2 && y <= labelY + labelHeight / 2) {
        hoveredLabel = labels[i];
      }
    });

    if (hoveredLabel) {
      // マウスの位置をそのままツールチップの位置にする
      showCustomTooltip(hoveredLabel, event.clientX, event.clientY);
    } else {
      hideCustomTooltip();
    }
  };

  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.__labelHoverListener = handleMouseMove; 
  canvas.addEventListener('mouseout', hideCustomTooltip);
};


const calculateAverage = (questionIndex) => {
    const answers = getAnswersForQuestion(questionIndex).map(a => parseInt(a.text, 10)).filter(n => !isNaN(n) && n >= 1 && n <= 5);
    if (answers.length === 0) return 'N/A';
    const sum = answers.reduce((acc, val) => acc + val, 0);
    return (sum / answers.length).toFixed(2);
};

onMounted(async () => {
  await fetchSurveyAndResults(viewingKey);
});

onUpdated(() => {
  if (surveyData.value && hasAccess.value && surveyData.value.questions.some(q => ['5-point', 'radio', 'checkbox'].includes(q.type))) {
    nextTick(() => {
      renderCharts();
    });
  }
});

onBeforeUnmount(() => {
  if (customTooltipEl && customTooltipEl.parentNode) {
    customTooltipEl.parentNode.removeChild(customTooltipEl);
    customTooltipEl = null;
  }
  if (window.myCharts) {
    Object.values(window.myCharts).forEach(chart => {
      if (chart.canvas.__labelHoverListener) {
        chart.canvas.removeEventListener('mousemove', chart.canvas.__labelHoverListener);
        chart.canvas.removeEventListener('mouseout', hideCustomTooltip);
      }
      chart.destroy();
    });
    window.myCharts = {};
  }
});


const getRespondentIdShort = (resultRow) => {
  const uuidIndex = systemColumnIndices.value.respondent_id;
  return uuidIndex !== -1 && resultRow[uuidIndex] ? String(resultRow[uuidIndex]).substring(0, 6) : 'N/A';
};

const getUsername = (resultRow) => {
  const usernameIndex = systemColumnIndices.value.username;
  if (surveyData.value.anonymous || !resultRow[usernameIndex] || String(resultRow[usernameIndex]).trim() === '') {
    return `匿名ユーザー (${getRespondentIdShort(resultRow)})`;
  }
  return String(resultRow[usernameIndex]);
};

const formatTimestamp = (resultRow) => {
  const timestampIndex = systemColumnIndices.value.timestamp;
  if (timestampIndex !== -1 && resultRow[timestampIndex]) {
    const date = new Date(resultRow[timestampIndex]);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    }
  }
  return 'N/A';
};

const getAnswerByIndex = (resultRow, questionIndex) => {
  if (!surveyData.value || !surveyData.value.questions || !resultHeaders.value) {
    return undefined;
  }
  const question = surveyData.value.questions[questionIndex];
  if (!question) {
    return undefined;
  }
  const expectedHeaderPrefix = `Q${questionIndex + 1}.`;
  let colIndex = -1;
  for (let i = 0; i < resultHeaders.value.length; i++) {
    if (resultHeaders.value[i] && resultHeaders.value[i].startsWith(expectedHeaderPrefix)) {
      colIndex = i;
      break;
    }
  }
  if (colIndex === -1) {
    return undefined;
  }
  return resultRow[colIndex];
};

const getAnswersForQuestion = (questionIndex) => {
  const question = surveyData.value.questions[questionIndex];
  const answers = results.value.map(res => {
    const text = getAnswerByIndex(res, questionIndex);
    const respondentIdShort = getRespondentIdShort(res);
    const username = getUsername(res);
    return {
      text: question.type === 'date' ? formatDateOnly(text) : text,
      respondentIdShort: respondentIdShort,
      username: username
    };
  }).filter(ans => ans.text);
  return answers;
};

const countOccurrences = (questionIndex, optionValue) => {
  const answers = results.value.map(res => getAnswerByIndex(res, questionIndex)).filter(Boolean);
  return answers.reduce((count, answer) => {
    const individualAnswers = String(answer).split(', ').map(s => s.trim());
    return count + (individualAnswers.includes(optionValue) ? 1 : 0);
  }, 0);
};

const totalResponses = computed(() => results.value.length);

const getPercentage = (count) => {
  if (totalResponses.value === 0) return 0;
  return (count / totalResponses.value) * 100;
};

const truncateText = (text, maxLength = 50) => {
  if (typeof text !== 'string' || !text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatQuestionHeader = (question, index) => {
  return question.text;
};

const downloadCsv = () => {
  if (results.value.length === 0) {
    alert('ダウンロードするデータがありません。');
    return;
  }
  const headers = ['回答者', '回答日時'];
  const questionHeaders = resultHeaders.value.filter(header => header.startsWith('Q'));
  headers.push(...questionHeaders);
  const csvHeaders = headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',');
  const rows = results.value.map(row => {
    const rowData = [];
    rowData.push(`"${String(getUsername(row)).replace(/"/g, '""')}"`);
    rowData.push(`"${formatTimestamp(row).replace(/"/g, '""')}"`);
    surveyData.value.questions.forEach((question, qIndex) => {
      let cellData = getAnswerByIndex(row, qIndex);
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

<style>
/* カスタムツールチップの基本スタイル */
.custom-chart-tooltip {
  background: rgba(0, 0, 0, 0.85); /* 少し濃い背景色 */
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  /* ここから変更 */
  white-space: normal; /* 折り返しを有効にする */
  word-wrap: break-word; /* 長い単語も折り返す */
  overflow-wrap: break-word; /* 同上 (モダンブラウザ向け) */
  max-width: 300px; /* 最大幅を設定 */
  /* ここまで変更 */
  pointer-events: none; 
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  z-index: 1000;
  position: absolute;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3); /* シャドウを追加して視認性向上 */
}
</style>
