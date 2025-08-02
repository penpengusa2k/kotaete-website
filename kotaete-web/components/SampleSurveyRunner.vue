
<template>
  <div class="border p-6 rounded-lg shadow-lg bg-white">
    <div v-if="!submitted">
      <h2 class="font-semibold text-2xl mb-2">{{ sampleSurvey.title }}</h2>
      <div v-for="(question, qIndex) in sampleSurvey.questions" :key="qIndex" class="mb-4">
        <p class="mb-2 text-left text-lg sm:text-xl font-semibold text-gray-700"><span class="text-primary">Q{{ qIndex + 1 }}.</span> {{ question.question_text }}</p>
        <div v-if="question.question_type === '5-point'" class="flex justify-around">
          <button
            v-for="(option, oIndex) in question.options"
            :key="oIndex"
            @click="answers[qIndex] = oIndex + 1"
            :class="{
              'bg-blue-500 text-white': answers[qIndex] === oIndex + 1,
              'bg-gray-200': answers[qIndex] !== oIndex + 1,
            }"
            class="p-2 rounded-full w-12 h-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ oIndex + 1 }}
          </button>
        </div>
        <div v-else-if="question.question_type === 'radio'" class="flex flex-col space-y-2">
          <label
            v-for="(option, oIndex) in question.options"
            :key="oIndex"
            class="inline-flex items-center cursor-pointer"
          >
            <input
              type="radio"
              :name="`question-${qIndex}`"
              :value="oIndex + 1"
              v-model="answers[qIndex]"
              class="form-radio h-5 w-5 text-blue-600"
            >
            <span class="ml-2 text-gray-700">{{ option }}</span>
          </label>
        </div>
      </div>
      <button
        @click="submitSurvey"
        :disabled="!isAllAnswered"
        class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
      >
        回答する
      </button>
    </div>
    <div v-else>
      <h3 class="text-xl font-bold mb-4 text-center">ご回答ありがとうございました！</h3>
      <p class="text-center mb-8">こちらがサンプルの集計結果です。</p>

      <div v-for="(question, index) in sampleSurvey.questions" :key="index" class="mb-12">
        <h4 class="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <span class="text-primary mr-3">Q{{ index + 1 }}</span>
          {{ question.question_text }}
        </h4>
        <div class="p-4 border border-gray-300 rounded-lg bg-white">
            <div v-if="question.question_type === '5-point'" class="flex items-center mb-2">
              <p class="text-lg font-semibold text-gray-700">平均評価:</p>
              <p class="text-2xl font-bold text-primary ml-2">{{ calculateAverage(index) }}</p>
            </div>
            <div class="relative h-56">
              <canvas :id="`sample-chart-${index}`" class="absolute inset-0 w-full h-full bg-white rounded-md z-0"></canvas>
            </div>
          </div>
      </div>

      <div class="text-center mt-6">
        <p class="mb-4">このように、簡単にアンケートの作成と結果の可視化ができます。</p>
        <button @click="navigateTo('/create')" class="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 custom-button-width">
          <span class="material-icons-outlined mr-2">add_circle_outline</span>
          自分でも作ってみよう
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const sampleSurvey = {
  title: 'サンプル：気軽に答えてみよう！',
  questions: [
    {
      question_text: '今日の自分の評価は？',
      question_type: '5-point',
      options: ['1', '2', '3', '4', '5'],
    },
    {
      question_text: '休日の過ごし方、どちらが好きですか？',
      question_type: 'radio',
      options: ['家でゆっくり', '外でアクティブに'],
    },
  ],
};

const answers = ref(Array(sampleSurvey.questions.length).fill(null));
const submitted = ref(false);
const resultsData = ref([]);
let chartInstances = [];

const isAllAnswered = computed(() => answers.value.every(ans => ans !== null));

const calculateAverage = (qIndex) => {
    const result = resultsData.value[qIndex];
    if (!result || result.answers.length === 0) return 'N/A';
    const sum = result.answers.reduce((acc, val) => acc + val, 0);
    return (sum / result.answers.length).toFixed(2);
};

const submitSurvey = async () => {
  if (!isAllAnswered.value) return;

  const generatedResults = sampleSurvey.questions.map((question, qIndex) => {
    let allAnswers;
    if (question.question_type === '5-point') {
      const randomAnswers = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () => Math.floor(Math.random() * 5) + 1);
      allAnswers = [...randomAnswers, answers.value[qIndex]];
    } else if (question.question_type === 'radio') {
      // ラジオボタンの場合、選択肢のインデックスを回答として扱う
      const randomAnswers = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () => Math.floor(Math.random() * question.options.length) + 1);
      allAnswers = [...randomAnswers, answers.value[qIndex]];
    }
    return { answers: allAnswers };
  });
  
  resultsData.value = generatedResults;
  submitted.value = true;

  await nextTick();
  renderCharts();
};

const renderCharts = () => {
  destroyCharts();

  sampleSurvey.questions.forEach((question, index) => {
    const ctx = document.getElementById(`sample-chart-${index}`);
    if (!ctx) return;

    let chartLabels = [];
    let chartData = [];
    let tooltipTitleCallback;

    if (question.question_type === '5-point') {
      const result = resultsData.value[index];
      const counts = [0, 0, 0, 0, 0];
      result.answers.forEach(ans => { if (ans >= 1 && ans <= 5) counts[ans - 1]++; });
      chartLabels = ['1', '2', '3', '4', '5'];
      chartData = counts;
      tooltipTitleCallback = (context) => `評価: ${context[0].label} (${context[0].formattedValue}票)`;
    } else if (question.question_type === 'radio') {
      const result = resultsData.value[index];
      const counts = {};
      question.options.forEach(option => counts[option] = 0);
      result.answers.forEach(ans => {
        // answers[qIndex] は 1-indexed なので、options のインデックスに戻す
        const optionText = question.options[ans - 1];
        if (optionText) {
          counts[optionText]++;
        }
      });
      chartLabels = question.options;
      chartData = question.options.map(option => counts[option]);
      tooltipTitleCallback = (context) => {
        if (context[0]) {
          const originalLabel = chartLabels[context[0].dataIndex];
          return `${originalLabel} (${context[0].formattedValue}票)`;
        }
        return '';
      };
    }

    const chart = new Chart(ctx, {
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
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(201, 203, 207, 0.6)'
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
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              titleColor: '#fff',
              bodyColor: '#fff',
              callbacks: {
                title: tooltipTitleCallback,
                label: () => ''
              },
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
              formatter: (value) => value + '票'
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
        }
      });
      chartInstances.push(chart);
  });
};

const destroyCharts = () => {
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];
}

onUnmounted(() => {
    destroyCharts();
});

</script>
