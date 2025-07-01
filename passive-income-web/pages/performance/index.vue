<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-darkest mb-4">実績とデータ</h1>
    <p class="text-lg text-neutral-dark/80 mb-10">
      このサイトの成長記録を、具体的なデータで公開します。透明性を第一に、挑戦の成果をご覧ください。
    </p>

    <section class="py-6 mb-12">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest mb-8">サマリー</h2>
      <div class="grid md:grid-cols-3 gap-6 text-center">
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary">
          <p class="text-sm text-neutral-dark font-semibold">開発ツール数</p>
          <p class="text-primary text-5xl font-bold mt-2">0+</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-secondary">
          <p class="text-sm text-neutral-dark font-semibold">累計収益</p>
          <p class="text-secondary text-5xl font-bold mt-2">¥{{ totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-accent">
          <p class="text-sm text-neutral-dark font-semibold">公開記事数</p>
          <p class="text-accent text-5xl font-bold mt-2">{{ totalArticles }}+</p>
        </div>
      </div>
    </section>

    <section class="py-6 mb-12">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest mb-8">サイトPV推移</h2>
      <div class="bg-white rounded-lg shadow-md p-4 md:p-6 h-96">
        <LineChart
          v-if="!pvPending && !pvError && cumulativePvChartData && cumulativePvChartData.datasets && cumulativePvChartData.datasets.length > 0"
          :data="cumulativePvChartData"
          :options="chartOptions"
        />
        <div v-else class="flex items-center justify-center h-full text-neutral-dark">
          <p v-if="pvPending">PVデータを読み込み中...</p>
          <p v-else-if="pvError">PVデータの取得に失敗しました。<br>{{ pvError.message }}</p>
          <p v-else>データがありません。</p>
        </div>
      </div>
    </section>

    <section class="py-6 mb-12">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest mb-8">収益レポート</h2>
      <div class="bg-white rounded-lg shadow-md p-4 md:p-6 h-96">
        <BarChart v-if="cumulativeRevenueChartData && cumulativeRevenueChartData.datasets && cumulativeRevenueChartData.datasets.length > 0" :data="cumulativeRevenueChartData" :options="chartOptions" />
        <div v-else class="flex items-center justify-center h-full text-neutral-dark">
          <p>データを読み込み中...</p>
        </div>
      </div>
    </section>

    <section class="py-6">
      <h2 class="text-3xl font-bold text-center text-neutral-darkest mb-8">今後のマイルストーン</h2>
      <div class="prose max-w-none text-neutral-dark/90 leading-relaxed text-center mx-auto">
        <p>ITの力を活用した不労所得の実現は、まだ始まったばかりです。今後も新たなツールの開発、コンテンツの拡充、そして収益化手法の最適化に挑戦し続けます。このページのデータが、右肩上がりに成長していく様子にご期待ください。</p>
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
        backgroundColor: '#1a73e8',
        borderColor: '#1a73e8',
        data: rawPvData.value.data,
        tension: 0.3,
        fill: false,
      },
    ],
  };
});

// 累計収益推移のダミーデータ (手動更新)
const cumulativeRevenueChartData = {
  labels: ['2025年6月'],
  datasets: [
    {
      label: '累計収益 (円)',
      backgroundColor: '#34a853',
      data: [0]
    }
  ]
};

const totalRevenue = computed(() => {
  const data = cumulativeRevenueChartData.datasets[0].data;
  // データがある場合は最後の値を返し、ない場合は0を返す
  return data.length > 0 ? data[data.length - 1] : 0;
});

// 取得した記事数をリアクティブなcomputedプロパティで表示
const totalArticles = computed(() => {
  return config.public.articleCount ?? 0; // runtimeConfigから取得
});

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
  title: '実績とデータ',
  meta: [
    { name: 'description', content: 'ITを活用した不労所得構築に関する具体的な実績、データ、そして今後の展望を公開。累計収益とPV推移。' }
  ]
});
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
</style>
