<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">実績</h1>
    <p class="text-lg text-gray-600 mb-8">
      ITを活用した不労所得構築の過程で得られた具体的な成果とデータを公開します。
      透明性を持って、取り組みと達成状況をご紹介します。
    </p>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">主な達成実績</h2>
      <div class="grid md:grid-cols-3 gap-6 text-center">
        <div class="bg-white rounded-lg shadow-md p-5">
          <p class="text-blue-600 text-4xl font-bold mb-1">30+</p>
          <p class="text-gray-700 text-base">開発ツール数</p>
        </div>
        <div class="bg-orange-500 text-white rounded-lg shadow-md p-5">
          <p class="text-4xl font-bold mb-1">¥XXX万+</p>
          <p class="text-base">累計収益</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5">
          <p class="text-purple-600 text-4xl font-bold mb-1">1,000+</p>
          <p class="text-gray-700 text-base">公開記事数</p>
        </div>
      </div>
    </section>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">累計PV推移</h2>
      <div class="bg-white rounded-lg shadow-md p-4 h-96">
        <LineChart
          v-if="!pvPending && !pvError && cumulativePvChartData && cumulativePvChartData.datasets && cumulativePvChartData.datasets.length > 0"
          :data="cumulativePvChartData"
          :options="chartOptions"
        />
        <p v-else-if="pvPending" class="text-center text-gray-600 text-sm mt-4">累計PVデータを読み込み中...</p>
        <p v-else-if="pvError" class="text-center text-red-600 text-sm mt-4">累計PVデータの取得に失敗しました。<br>{{ pvError.message }}</p>
        <p v-else class="text-center text-gray-600 text-sm mt-4">データがありません。</p>
        <p class="text-center text-gray-600 text-sm mt-2">ウェブサイトの累計ページビュー</p>
      </div>
    </section>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">累計収益推移</h2>
      <div class="bg-white rounded-lg shadow-md p-4 h-96">
        <BarChart v-if="cumulativeRevenueChartData && cumulativeRevenueChartData.datasets && cumulativeRevenueChartData.datasets.length > 0" :data="cumulativeRevenueChartData" :options="chartOptions" />
        <p v-else class="text-center text-gray-600 text-sm mt-4">データを読み込み中...</p>
        <p class="text-center text-gray-600 text-sm mt-2">広告収入などを含む累計収益</p>
      </div>
    </section>

    <section class="py-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">今後の展望</h2>
      <div class="prose max-w-none text-gray-800 leading-relaxed text-center mx-auto">
        <p>ITを活用した不労所得の可能性を追求し、より多くの人々が経済的自由を達成できるよう（そして私自身のITエンジニアとしての成長を願って）、実践的で質の高い情報提供とツールの開発を継続します。</p>
        <p>今後の活動にもご期待ください。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement
);

const config = useRuntimeConfig();
const NUXT_PUBLIC_GA4_PROPERTY_ID = config.public.ga4PropertyId;

// 累計PVデータの取得 (ビルド時にサーバーサイドで取得される)
const { data: rawPvData, pending: pvPending, error: pvError } = await useAsyncData(
  'cumulative-pv-data',
  async () => {
    // NUXT_PUBLIC_GA4_PROPERTY_ID が undefined の場合を考慮
    if (!NUXT_PUBLIC_GA4_PROPERTY_ID) {
      console.warn('NUXT_PUBLIC_GA4_PROPERTY_ID is not defined. PV data will not be fetched.');
      return { labels: [], data: [] }; // デフォルトデータを返す
    }
    return await $fetch(`/api/analytics/pv?propertyId=${NUXT_PUBLIC_GA4_PROPERTY_ID}`);
  },
  {
    server: true,
    lazy: false,
  }
);

// 累計PVグラフデータ整形
const cumulativePvChartData = computed(() => {
  if (!rawPvData.value || rawPvData.value.labels.length === 0) {
    return null;
  }
  return {
    labels: rawPvData.value.labels,
    datasets: [
      {
        label: '累計PV',
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        data: rawPvData.value.data,
        tension: 0.3,
        fill: false,
      },
    ],
  };
});

// 累計収益推移のダミーデータ (手動更新)
const cumulativeRevenueChartData = {
  labels: ['2025年1月', '2025年2月', '2025年3月', '2025年4月', '2025年5月', '2025年6月'],
  datasets: [
    {
      label: '累計収益 (万円)',
      backgroundColor: '#3B82F6',
      data: [10, 25, 47, 65, 90, 120]
    }
  ]
};

// グラフの共通オプション
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
    }
  }
};

useHead({
  title: '実績 - 不労所得への道',
  meta: [
    { name: 'description', content: 'ITを活用した不労所得構築に関する具体的な実績、データ、そして今後の展望を公開。累計収益とPV推移。' }
  ]
});
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
</style>
