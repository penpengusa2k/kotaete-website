<template>
  <div>
    <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-8">よくある質問 (FAQ)</h1>

    <div class="space-y-8 text-gray-800">
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300 flex items-center">
          <span class="material-icons-outlined text-gray-600 mr-3 text-3xl">info</span>
          KOTAETEに関するQ&A
        </h2>
        <div class="space-y-4 text-lg">
          <p class="leading-relaxed mb-6">
            KOTAETEに関するよくある質問とその回答をまとめました。お問い合わせいただく前に、こちらをご確認ください。
            より詳細な情報は、<NuxtLink to="/how-to-use" class="text-blue-500 hover:underline font-medium">使い方ページ</NuxtLink>や<NuxtLink to="/about" class="text-blue-500 hover:underline font-medium">このサイトについて</NuxtLink>のページもご参照ください。
          </p>

          <div class="space-y-6">
            <!-- Q&A Item 1 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. KOTAETEは無料で利用できますか？
              </h3>
              <p class="ml-8">A. はい、質問数や文字数などの一部制約はありますが、すべて無料でご利用いただけます。将来的には有料プランにて広告撤廃や各種制約の撤廃を検討しています。</p>
            </div>

            <!-- Q&A Item 2 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. ユーザー登録は必要ですか？
              </h3>
              <p class="ml-8">A. いいえ、KOTAETEはユーザー登録なしでアンケートの作成・回答が可能です。思い立ったらすぐにアンケートを作成できます。</p>
            </div>

            <!-- Q&A Item 3 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. 作成したアンケートはどこに保存されますか？
              </h3>
              <p class="ml-8">A. 作成されたアンケートデータは、サイト運営者のみがアクセス可能な場所に安全に管理されます。アンケート作成時に発行される「結果確認用URL」を控えておくことで、いつでも結果にアクセスできます。</p>
            </div>

            <!-- Q&A Item 4 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. アンケート結果はリアルタイムで確認できますか？
              </h3>
              <p class="ml-8">A. はい、回答が送信されるとリアルタイムで結果が更新され、グラフで視覚的に確認できます。</p>
            </div>

            <!-- Q&A Item 5 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. アンケートの回答期限は設定できますか？
              </h3>
              <p class="ml-8">A. はい、アンケート作成時に回答の受付期限を設定することが可能です。期限を過ぎると回答はできなくなります。</p>
            </div>

            <!-- Q&A Item 6 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. アンケート結果を特定の人にだけ見せることはできますか？
              </h3>
              <p class="ml-8">A. はい、「結果の閲覧制限」を設定することで、閲覧キーを知っている人のみが結果を確認できるように設定できます。</p>
            </div>

            <!-- Q&A Item 7 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. 作成したアンケートはいつまで保存されますか？
              </h3>
              <p class="ml-8">A. 回答期限を過ぎてから10日経過したアンケートは、その結果を含め自動的にシステムから削除されます。削除されたアンケートは復元できませんのでご注意ください。</p>
            </div>

            <!-- Q&A Item 8 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. アンケートの質問数や文字数に制限はありますか？
              </h3>
              <p class="ml-8">A. はい、現在の無料版では、アンケートタイトル、質問数、文字数などに一部制限があります。詳細は<NuxtLink to="/how-to-use" class="text-blue-500 hover:underline font-medium">使い方ページ</NuxtLink>の「制約事項」をご確認ください。</p>
            </div>

            <!-- Q&A Item 8 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. 不具合を見つけました。どこに報告すればよいですか？
              </h3>
              <p class="ml-8">A. 本ページ上部のお問い合わせフォームより、詳細を添えてご連絡いただけますと幸いです。迅速に対応させていただきます。</p>
            </div>

            <!-- Q&A Item 9 -->
            <div>
              <h3 class="font-bold text-xl flex items-center mb-2">
                <span class="material-icons-outlined text-blue-500 mr-2">question_answer</span>
                Q. KOTAETEの改善提案はどこに送ればよいですか？
              </h3>
              <p class="ml-8">A. 本ページ上部のお問い合わせフォームより、お気軽にご提案ください。皆様からのご意見を参考に、より良いサービスを目指してまいります。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'よくある質問 - KOTAETE',
  meta: [
    { name: 'description', content: 'KOTAETEに関するよくある質問とその回答をまとめました。' }
  ]
})
</script>
