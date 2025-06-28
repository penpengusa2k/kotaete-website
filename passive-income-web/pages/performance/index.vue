<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">実績</h1>
    <p class="text-lg text-gray-600 mb-8">
      これまでの不労所得構築に関する具体的な実績やデータを公開します。
      透明性を持って、私たちの取り組みと成果をご紹介します。
    </p>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">主な達成実績</h2>
      <div class="grid md:grid-cols-3 gap-6 text-center">
        <div class="bg-white rounded-lg shadow-md p-5">
          <p class="text-blue-600 text-4xl font-bold mb-1">30+</p>
          <p class="text-gray-700 text-base">自動化スクリプト数</p>
        </div>
        <div class="bg-green-600 text-white rounded-lg shadow-md p-5">
          <p class="text-4xl font-bold mb-1">¥50万+</p>
          <p class="text-base">月間不労所得（最高）</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5">
          <p class="text-purple-600 text-4xl font-bold mb-1">1,000+</p>
          <p class="text-base">学習コンテンツ公開数</p>
        </div>
      </div>
    </section>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">累計PV推移</h2>
      <div class="bg-white rounded-lg shadow-md p-4 h-96">
        <LineChart v-if="cumulativePvChartData && cumulativePvChartData.datasets && cumulativePvChartData.datasets.length > 0" :data="cumulativePvChartData" :options="chartOptions" />
        <p v-else class="text-center text-gray-600 text-sm mt-4">データを読み込み中...</p>
        <p class="text-center text-gray-600 text-sm mt-2">累計ページビュー（ダミーデータ）</p>
      </div>
    </section>

    <section class="py-6 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">収益推移</h2>
      <div class="bg-white rounded-lg shadow-md p-4 h-96">
        <BarChart v-if="revenueChartData && revenueChartData.datasets && revenueChartData.datasets.length > 0" :data="revenueChartData" :options="chartOptions" />
        <p v-else class="text-center text-gray-600 text-sm mt-4">データを読み込み中...</p>
        <p class="text-center text-gray-600 text-sm mt-2">月間収益（ダミーデータ）</p>
      </div>
    </section>

    <section class="py-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">今後の展望</h2>
      <div class="prose max-w-none text-gray-800 leading-relaxed text-center mx-auto">
        <p>私たちは、ITを活用した不労所得の可能性を追求し続けます。より多くの人々が経済的自由を達成できるよう、実践的で質の高い情報提供とツールの開発に尽力してまいります。</p>
        <p>今後の活動にもご期待ください。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
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
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement
)

// ★累計PV推移のダミーデータをここに追加★
const cumulativePvChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '累計PV',
      backgroundColor: '#EF4444', // Tailwind red-500
      borderColor: '#EF4444',
      data: [65, 124, 204, 285, 341, 416], // 月間PVの累計 (65, 65+59, 124+80, ...)
      tension: 0.3,
      fill: false
    }
  ]
}

// 収益推移のダミーデータ (変更なし)
const revenueChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '月間収益 (万円)',
      backgroundColor: '#10B981', // Tailwind green-500
      data: [10, 15, 22, 18, 25, 30]
    }
  ]
}

// グラフの共通オプション (変更なし)
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
}

useHead({
  title: '実績 - 不労所得への道',
  meta: [
    { name: 'description', content: 'ITを活用した不労所得構築に関する具体的な実績、データ、そして今後の展望を公開。' }
  ]
})
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
</style>
