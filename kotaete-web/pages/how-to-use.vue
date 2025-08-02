<template>
  <div>
    <h1 class="text-4xl font-extrabold text-center mb-8"><img src="/site-title.png" alt="KOTAETE" class="inline-block h-16 align-middle"><span class="text-blue-500 align-middle">の使い方</span></h1>
    <div class="mb-10 text-center">
      <img src="/how-to-use.png" alt="KOTAETEの使い方" class="mx-auto max-w-full h-auto rounded-lg shadow-lg">
    </div>

    <div class="space-y-10 text-gray-800">

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-blue-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-300 flex items-center">
          <span class="material-icons-outlined text-blue-500 mr-3 text-3xl">create</span>
          1. アンケートを作成する
        </h2>
        <div class="space-y-4 text-lg">
          <p class="leading-relaxed">トップページの「さっそくKOTAETEを試してみる」ボタンやヘッダーの「NEW」ボタン、もしくは<NuxtLink to="/create" class="text-blue-500 hover:underline font-medium">こちら</NuxtLink>のボタンからアンケートの作成を開始します。</p>
          
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 class="text-xl font-medium mb-2 flex items-center"><span class="material-icons-outlined text-blue-600 mr-2">edit_note</span>基本情報</h3>
            <ul class="list-disc list-inside space-y-2 pl-4">
              <li><span class="font-bold text-gray-900">KOTAETEタイトル:</span> アンケートの目的がわかるような、簡潔で魅力的なタイトルをつけましょう。</li>
              <li><span class="font-bold text-gray-900">作成者名:</span> あなたの名前やニックネームを入力します。</li>
              <li><span class="font-bold text-gray-900">説明文（任意）:</span> アンケートの意図や補足事項などを記入できます。</li>
            </ul>
          </div>

          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 class="text-xl font-medium mb-2 flex items-center"><span class="material-icons-outlined text-green-600 mr-2">quiz</span>質問の追加</h3>
            <ul class="list-disc list-inside space-y-2 pl-4">
              <li>「+ 質問を追加」ボタンで、質問をどんどん追加できます。</li>
              <li>質問タイプ（記述式、ラジオボタン、チェックボックス、日付）を選択し、質問文と選択肢（必要な場合）を入力します。</li>
            </ul>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 class="text-xl font-medium mb-2 flex items-center"><span class="material-icons-outlined text-purple-600 mr-2">settings</span>詳細設定</h3>
            <ul class="list-disc list-inside space-y-2 pl-4">
              <li><span class="font-bold text-gray-900">結果の閲覧制限:</span> アンケート結果を特定の人のみに公開したい場合は、「制限する」を選び、閲覧キー（パスワード）を設定してください。このキーを共有することで、見せたい相手にだけ結果を公開できます。</li>
              <li><span class="font-bold text-gray-900">回答受付期限:</span> いつまで回答を受け付けるかを設定します。</li>
              <li><span class="font-bold text-gray-900">回答者名:</span> 回答者に名前を入力してもらうか、匿名で回答してもらうかを選べます。</li>
            </ul>
          </div>
          <p class="leading-relaxed font-bold text-center text-xl text-blue-700 mt-6">全ての入力が終わったら、「KOTAETEを作成」ボタンを押して完了です！</p>
        </div>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-purple-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-300 flex items-center">
          <span class="material-icons-outlined text-purple-500 mr-3 text-3xl">share</span>
          2. アンケートを共有する
        </h2>
        <p class="leading-relaxed text-lg">作成が完了すると、2つのURLが発行されます。</p>
        <ul class="list-disc list-inside space-y-2 mt-4 pl-4 text-lg">
          <li><span class="font-bold text-gray-900">回答用URL:</span> このURLを回答してほしい人に共有します。X（旧Twitter）やLINEなどのシェアボタンもご活用ください。</li>
          <li><span class="font-bold text-gray-900">結果確認用URL:</span> あなたが結果を確認するためのURLです。大切に保管してください。（閲覧制限をかけた場合は、設定した閲覧キーも必要になります）</li>
        </ul>
        <!-- ここに共有方法のイメージ画像やアイコンを配置 -->
        <p class="text-gray-600 mt-4 text-center">（ここに共有方法のイメージ画像やアイコンを配置できます）</p>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-green-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-300 flex items-center">
          <span class="material-icons-outlined text-green-500 mr-3 text-3xl">bar_chart</span>
          3. 回答と結果の確認
        </h2>
        <div class="space-y-4 text-lg">
          <p class="leading-relaxed">回答者は、共有された「回答用URL」にアクセスし、質問に答えて送信します。</p>
          <p class="leading-relaxed">作成者は、「結果確認用URL」にアクセスすることで、リアルタイムで更新される回答状況をグラフで確認できます。誰が何に回答したか、一目でわかります。</p>
        </div>
        <!-- ここに結果表示のイメージ画像やグラフのアイコンを配置 -->
        <p class="text-gray-600 mt-4 text-center">（ここに結果表示のイメージ画像やグラフのアイコンを配置できます）</p>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-red-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-red-300 flex items-center">
          <span class="material-icons-outlined text-red-500 mr-3 text-3xl">warning</span>
          制約事項
        </h2>
        <p class="leading-relaxed text-lg mb-4">現在のKOTAETEは無料でご利用いただけますが、以下の制約があります。</p>
        <h3 class="text-xl font-medium mb-2 flex items-center"><span class="material-icons-outlined text-red-600 mr-2">format_size</span>アンケート作成時の制約</h3>
        <ul class="list-disc list-inside space-y-2 pl-4 text-lg">
          <li><span class="font-bold text-gray-900">アンケートタイトル:</span> 50文字まで</li>
          <li><span class="font-bold text-gray-900">作成者名:</span> 50文字まで</li>
          <li><span class="font-bold text-gray-900">説明文:</span> 500文字まで</li>
          <li><span class="font-bold text-gray-900">質問文:</span> 500文字まで</li>
          <li><span class="font-bold text-gray-900">質問数:</span> 最大50個</li>
          <li><span class="font-bold text-gray-900">選択肢の数:</span> 1質問につき最大10個</li>
          <li><span class="font-bold text-gray-900">選択肢の値:</span> 500文字まで</li>
          <li><span class="font-bold text-gray-900">内容の適正:</span> 公序良俗に反する内容、他者を誹謗中傷する内容、個人情報を含む内容など、不適当と判断されたアンケートは、予告なく削除される場合があります。</li>
          <li><span class="font-bold text-gray-900">アンケートの保存期間:</span> 回答期限から60日経過したアンケートは、その結果を含め自動的にシステムから削除されます。削除されたアンケートは復元できません。</li>
        </ul>
        <h3 class="text-xl font-medium mt-6 mb-2 flex items-center"><span class="material-icons-outlined text-red-600 mr-2">mail</span>お問い合わせフォームの制約</h3>
        <ul class="list-disc list-inside space-y-2 pl-4 text-lg">
          <li><span class="font-bold text-gray-900">お名前:</span> 500文字まで</li>
          <li><span class="font-bold text-gray-900">メールアドレス:</span> 100文字まで</li>
          <li><span class="font-bold text-gray-900">お問い合わせ内容:</span> 500文字まで</li>
        </ul>
        <p class="leading-relaxed text-lg mt-6">
          KOTAETEは現在、すべての基本機能を無料で提供しています。将来的に、より高度なニーズに応えるための機能拡張や、広告の非表示化などを目的とした有料プランの導入を検討しています。皆様の「知りたい」をさらに深く掘り下げるための機能を提供していく予定です。
        </p>
      </section>

    </div>
  </div>
</template>

<script setup>
useHead({
  title: '使い方 - KOTAETE',
  meta: [
    { name: 'description', content: 'KOTAETEの基本的な使い方を解説します。アンケートの作成から共有、結果の確認まで、簡単なステップでご紹介。' }
  ]
})
</script>
