<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-darkest dark:text-neutral-lightest mb-4">お問い合わせ</h1>
      <p class="text-lg text-neutral-dark/80 dark:text-neutral-light/80 mb-8">
        サイトに関するご質問、ご意見、または協力のご提案など、お気軽にご連絡ください。
      </p>
    </div>
    <div class="flex justify-center w-full">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSegeCt6N9Ym39S8OsY-aXaFNWLLeXUkzj0znWHP0npyzgpW4g/viewform?embedded=true"
        width="100%"
        height="600"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        class="w-full max-w-2xl h-[600px] border-none rounded-lg shadow-lg bg-white dark:bg-neutral-dark"
      >
        読み込んでいます…
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ',
  meta: [
    { name: 'description', content: 'サイトに関するご質問、ご意見、協力のご提案など、お気軽にご連絡ください。' }
  ]
});
</script>

<style scoped>
/* 必要であればスタイルを追加 */
</style>