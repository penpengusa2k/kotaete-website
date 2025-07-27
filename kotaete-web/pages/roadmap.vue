<template>
  <div>
    <h1 class="text-4xl font-extrabold text-center mb-8 flex flex-col items-center">
      <img src="/site-title.png" alt="KOTAETE" class="inline-block h-16 align-middle mb-2">
      <span class="text-primary align-middle">ロードマップ</span>
    </h1>

    <p class="text-lg text-gray-700 text-center mb-12 leading-relaxed">
      KOTAETEは、皆様の声を元に日々進化していきます。ここでは、KOTAETEが目指す未来と、その実現に向けたロードマップをご紹介します。
      皆様からのフィードバックが、KOTAETEをより良いサービスにするための原動力となります。
    </p>

    <div class="space-y-12">
      <!-- Phase 1 -->
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-light flex flex-col md:flex-row items-center md:items-start">
        <div class="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <div class="w-24 h-24 bg-primary-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
            1
          </div>
        </div>
        <div class="flex-grow text-center md:text-left">
          <h2 class="text-3xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
            <span class="material-icons-outlined text-primary-dark mr-3 text-4xl">group_add</span>
            ユーザー基盤の拡大と初期フィードバックの収集
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            KOTAETEをより多くの方に知っていただき、気軽に利用していただけるよう、まずはユーザー数の拡大に注力します。
            シンプルで直感的な操作性を維持しつつ、初期段階でのユーザー体験を最優先に改善していきます。
            皆様からの率直なご意見を幅広く収集し、今後の開発の方向性を定めるための貴重なデータとさせていただきます。
          </p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>検索エンジン最適化（SEO）の強化と広告戦略の検討</li>
            <li>SNSでの情報発信とコミュニティ形成</li>
            <li>初期ユーザーからのアンケートやお問い合わせを通じたフィードバック収集</li>
            <li>パフォーマンスの最適化と安定性の向上</li>
          </ul>
        </div>
      </section>

      <!-- Phase 2 -->
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-light flex flex-col md:flex-row items-center md:items-start">
        <div class="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <div class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
            2
          </div>
        </div>
        <div class="flex-grow text-center md:text-left">
          <h2 class="text-3xl sm:text-2xl font-bold text-secondary mb-4 flex items-center">
            <span class="material-icons-outlined text-secondary mr-3 text-4xl">design_services</span>
            ユーザーの声に基づくUI/UXの深化
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            フェーズ1で収集した皆様からの貴重なフィードバックを徹底的に分析し、KOTAETEのUI（ユーザーインターフェース）とUX（ユーザー体験）を大幅に改善します。
            より直感的で快適な操作感を提供できるよう、デザインと機能の両面から洗練を重ね、利用満足度を一層高めていきます。
            皆様の「こんな機能が欲しい」「ここが使いにくい」といった声が、KOTAETEの進化を加速させます。
          </p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>既存機能の改善と操作フローの最適化</li>
            <li>デザインの刷新とアクセシビリティの向上</li>
            <li>新しい質問形式や回答オプションの追加検討</li>
            <li>多言語対応の検討</li>
          </ul>
        </div>
      </section>

      <!-- Phase 3 -->
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-light flex flex-col md:flex-row items-center md:items-start">
        <div class="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <div class="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
            3
          </div>
        </div>
        <div class="flex-grow text-center md:text-left">
          <h2 class="text-3xl sm:text-2xl font-bold text-accent mb-4 flex items-center">
            <span class="material-icons-outlined text-accent mr-3 text-4xl">verified_user</span>
            パーソナライズと高度な機能の提供
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            KOTAETEをよりパーソナルで強力なツールとしてご利用いただくため、ユーザー登録機能を実装します。
            これにより、現在設けられている各種制約（質問数、文字数、保存期間など）を撤廃し、より大規模で複雑なアンケートの作成・管理が可能になります。
            過去に作成したアンケートやその回答データを永続的に閲覧・管理できるようになり、KOTAETEが皆様の活動を長期的にサポートする基盤となります。
          </p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>ユーザー登録・ログイン機能の実装</li>
            <li>過去のアンケートの永続的な保存と管理機能</li>
            <li>質問数・文字数などの制約撤廃（有料プランでの提供も検討）</li>
            <li>データ分析機能の強化とレポート機能の追加</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'ロードマップ - KOTAETE',
  meta: [
    { name: 'description', content: 'KOTAETEの今後の開発計画と展望をご紹介します。ユーザー数の拡大、UI/UX改善、ユーザー登録機能の実装など、KOTAETEの未来をご覧ください。' }
  ]
})
</script>
