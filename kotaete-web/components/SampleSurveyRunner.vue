
<template>
  <div class="border p-6 rounded-lg shadow-lg bg-white">
    <div v-if="!submitted">
      <h2 class="font-semibold text-2xl mb-2">{{ sampleSurvey.title }}</h2>
      <div v-for="(question, qIndex) in sampleSurvey.questions" :key="qIndex" class="mb-4">
        <p class="mb-2">{{ question.question_text }}</p>
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
      </div>
      <button
        @click="submitSurvey"
        :disabled="!isAllAnswered"
        class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
      >
        回答する
      </button>
    </div>
    <div v-else>
      <h3 class="text-xl font-bold mb-4 text-center">ご回答ありがとうございました！</h3>
      <p class="text-center mb-4">こちらがサンプルの集計結果です。</p>
      <div>
        <canvas id="sample-chart"></canvas>
      </div>
      <div class="text-center mt-6">
        <p class="mb-4">このように、簡単にアンケートの作成と結果の可視化ができます。</p>
        <button @click="navigateTo('/create')" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          自分でも作ってみよう
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const sampleSurvey = {
  title: 'サンプル：サービス満足度調査',
  questions: [
    {
      question_text: 'このサイトの使いやすさはいかがですか？',
      question_type: '5-point',
      options: ['とても悪い', '悪い', '普通', '良い', 'とても良い'],
    },
    {
      question_text: 'デザインは魅力的ですか？',
      question_type: '5-point',
      options: ['全くそう思わない', 'そう思わない', '普通', 'そう思う', '非常にそう思う'],
    },
  ],
};

const answers = ref(Array(sampleSurvey.questions.length).fill(null));
const submitted = ref(false);

const isAllAnswered = computed(() => answers.value.every(ans => ans !== null));

let chartInstance = null;

const submitSurvey = async () => {
  if (isAllAnswered.value) {
    submitted.value = true;
    await nextTick(); // DOM更新を待つ
    renderChart();
  }
};

const renderChart = () => {
  const ctx = document.getElementById('sample-chart');
  if (!ctx) return;

  const averageRatings = sampleSurvey.questions.map((_, qIndex) => {
    // サンプルなので、実際の回答とランダム値を混ぜて平均を算出
    const randomAnswers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5) + 1);
    const allAnswers = [...randomAnswers, answers.value[qIndex]];
    const sum = allAnswers.reduce((acc, val) => acc + val, 0);
    return (sum / allAnswers.length).toFixed(1);
  });

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sampleSurvey.questions.map(q => q.question_text),
      datasets: [
        {
          label: '平均評価',
          data: averageRatings,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
        },
      },
      plugins: {
        title: {
          display: true,
          text: '回答結果の平均値',
          font: {
            size: 18,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `平均: ${context.raw}`;
            },
          },
        },
      },
    },
  });
};

</script>
