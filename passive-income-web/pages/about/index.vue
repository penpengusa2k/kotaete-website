<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-darkest dark:text-neutral-lightest mb-6 text-center">このサイトについて</h1>
      
      <div class="prose max-w-none text-neutral-dark/90 dark:text-neutral-light/90 leading-relaxed mb-10">
        <p class="text-lg text-center mb-8">「不労所得への道」へようこそ。このサイトは、一個人のエンジニアがITの力を駆使して、<strong class="font-semibold text-primary">ゼロから不労所得を構築するまでの全過程を記録する、リアルタイムドキュメンタリー</strong>です。</p>
        
        <div class="bg-white dark:bg-neutral-dark p-6 rounded-lg shadow-md border border-neutral-light dark:border-neutral-darkest mb-8">
          <h2 class="text-2xl font-bold text-neutral-darkest dark:text-neutral-lightest mb-3">私たちのミッション</h2>
          <p>私たちのミッションは、<strong class="font-semibold text-secondary">「ITスキルは、最強の資産である」</strong>という信念を証明することです。プログラミング、データ分析、自動化といった技術が、時間や場所に縛られない新しい働き方と、経済的な自由をもたらす力を持っていると信じています。このサイトでは、その可能性を具体的な形で示し、誰もが再現可能な知識として共有することを目指します。</p>
        </div>

        <h2 class="text-2xl font-bold text-neutral-darkest dark:text-neutral-lightest mb-3">3つの約束</h2>
        <ul class="space-y-4">
          <li class="flex items-start">
            <span class="material-icons-outlined text-primary mr-3 mt-1">check_circle</span>
            <div>
              <h3 class="font-semibold text-lg text-neutral-darkest dark:text-neutral-lightest">徹底した透明性</h3>
              <p class="text-sm text-neutral-dark/80 dark:text-neutral-light/80">収益、PV数、成功した施策から失敗した実験まで、全てのデータを公開します。良い結果も悪い結果も、あなたの学びの糧となるはずです。</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="material-icons-outlined text-primary mr-3 mt-1">code</span>
            <div>
              <h3 class="font-semibold text-lg text-neutral-darkest dark:text-neutral-lightest">実践的なコードとノウハウ</h3>
              <p class="text-sm text-neutral-dark/80 dark:text-neutral-light/80">机上の空論は語りません。実際にウェブサイト構築やツール開発で使用したコード、具体的な設定手順、問題解決のプロセスを詳細に解説します。</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="material-icons-outlined text-primary mr-3 mt-1">school</span>
            <div>
              <h3 class="font-semibold text-lg text-neutral-darkest dark:text-neutral-lightest">共に学ぶコミュニティ</h3>
              <p class="text-sm text-neutral-dark/80 dark:text-neutral-light/80">このサイトは、私自身の成長の記録でもあります。読者の皆さんと情報を交換し、共に学び、成長できる場でありたいと考えています。</p>
            </div>
          </li>
        </ul>

        <div class="text-center mt-12">
          <p class="mb-4 text-neutral-dark/90 dark:text-neutral-light/90">私たちの挑戦に、あなたも参加しませんか？</p>
          <NuxtLink to="/contact" class="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
            ご意見・ご感想はこちら
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'このサイトについて | 不労所得への道',
  meta: [
    { name: 'description', content: '「不労所得への道」のミッションと3つの約束。ITスキルを資産に変える挑戦の記録。透明性、実践的ノウハウ、共に学ぶコミュニティを大切にしています。' }
  ]
})
</script>

<style scoped>
/* 必要であれば、このページ固有のスタイルをここに記述 */
</style>
