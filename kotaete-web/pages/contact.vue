<template>
  <div>
    <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-8">お問い合わせ</h1>

    <div class="space-y-8 text-gray-800">
      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-blue-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-300 flex items-center">
          <span class="material-icons-outlined text-blue-500 mr-3 text-3xl">help_outline</span>
          ご質問・ご意見はこちらから
        </h2>
        <p class="leading-relaxed text-lg mb-6">
          KOTAETEに関するご質問、ご意見、ご要望などがございましたら、以下のフォームよりお気軽にお問い合わせください。
          いただいた内容は、今後のサービス改善の参考にさせていただきます。
        </p>
        <ContactForm />
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300 flex items-center">
          <span class="material-icons-outlined text-gray-600 mr-3 text-3xl">info</span>
          よくある質問
        </h2>
        <div class="space-y-4 text-lg">
          <p class="leading-relaxed">
            お問い合わせいただく前に、<NuxtLink to="/faq" class="text-blue-500 hover:underline font-medium">よくある質問 (FAQ)</NuxtLink>、<NuxtLink to="/how-to-use" class="text-blue-500 hover:underline font-medium">使い方ページ</NuxtLink>や<NuxtLink to="/about" class="text-blue-500 hover:underline font-medium">このサイトについて</NuxtLink>のページもご参照ください。
            基本的な操作方法やKOTAETEの概要についてご確認いただけます。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import ContactForm from '~/components/ContactForm.vue';

useHead({
  title: 'お問い合わせ - KOTAETE',
  meta: [
    { name: 'description', content: 'KOTAETEに関するご質問、ご意見、ご要望などはこちらからお問い合わせください。' }
  ]
})
</script>