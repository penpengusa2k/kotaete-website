<template>
  <div>
    <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-8">KOTAETEについて</h1>
    
    <!-- サイトの紹介画像やイラストを配置する場所を提案 -->
    <div class="mb-10 text-center">
      <!-- ここにサイトのコンセプトを表す画像やイラストを配置 -->
      <!-- 例: <img src="/path/to/about-hero.png" alt="KOTAETE Concept" class="mx-auto max-w-full h-auto rounded-lg shadow-lg"> -->
      <p class="text-gray-600 mt-4">（ここにサイトのコンセプトを表す画像やイラストを配置できます）</p>
    </div>

    <div class="space-y-8 text-gray-800">
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-blue-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-300 flex items-center">
          <span class="material-icons-outlined text-blue-500 mr-3 text-3xl">info</span>
          KOTAETEとは？
        </h2>
        <p class="leading-relaxed text-lg">
          KOTAETEは、誰もが無料で、そして直感的にオンラインアンケートを作成・共有できるウェブサービスです。「ちょっとした意見を聞きたい」「イベントの出欠を取りたい」「簡単なクイズを作りたい」といった、日常の様々なシーンでご活用いただけます。
        </p>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-purple-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-300 flex items-center">
          <span class="material-icons-outlined text-purple-500 mr-3 text-3xl">lightbulb</span>
          開発の背景
        </h2>
        <p class="leading-relaxed text-lg">
          従来のアンケートツールは、多機能である反面、設定が複雑だったり、登録が必要だったりと、手軽に使うには少しハードルが高いと感じることがありました。KOTAETEは、「もっとシンプルに、もっと速く」をコンセプトに、思い立ったらすぐに使えるアンケートツールを目指して開発されました。
        </p>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-green-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-300 flex items-center">
          <span class="material-icons-outlined text-green-500 mr-3 text-3xl">star</span>
          主な特徴
        </h2>
        <ul class="list-disc list-inside space-y-3 pl-4 text-lg">
          <li><span class="font-bold text-gray-900">完全無料:</span> 基本機能はすべて無料でご利用いただけます。</li>
          <li><span class="font-bold text-gray-900">登録不要:</span> 面倒なユーザー登録は一切必要ありません。</li>
          <li><span class="font-bold text-gray-900">リアルタイム集計:</span> 回答結果は即座にグラフ化され、一目で状況を把握できます。</li>
          <li><span class="font-bold text-gray-900">豊富な質問形式:</span> 記述式、ラジオボタン、チェックボックスなど、用途に合わせて質問タイプを選べます。</li>
          <li><span class="font-bold text-gray-900">OGP対応:</span> SNSで共有した際に、アンケートのタイトルが魅力的に表示されます。</li>
        </ul>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300 flex items-center">
          <span class="material-icons-outlined text-gray-600 mr-3 text-3xl">person</span>
          運営者情報
        </h2>
        <p class="leading-relaxed text-lg">
          このサイトは、個人のウェブ開発者によって運営されています。ユーザーの皆様からのフィードバックを大切にし、より良いサービスとなるよう日々改善を続けています。ご意見・ご感想は<NuxtLink to="/contact" class="text-blue-500 hover:underline font-medium">お問い合わせフォーム</NuxtLink>よりお寄せください。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'このサイトについて - KOTAETE',
  meta: [
    { name: 'description', content: 'KOTAETEは、無料で簡単に使えるオンラインアンケート作成サービスです。開発の背景や特徴についてご紹介します。' }
  ]
})
</script>
