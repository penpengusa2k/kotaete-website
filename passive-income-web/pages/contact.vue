<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center w-full">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSegeCt6N9Ym39S8OsY-aXaFNWLLeXUkzj0znWHP0npyzgpW4g/viewform?embedded=true"
        width="640"
        height="585"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        class="w-full max-w-2xl h-[585px]" >
        読み込んでいます…
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ',
  meta: [
    { name: 'description', content: '当サイトへのお問い合わせはこちらから。' }
  ]
});
</script>

<style scoped>
/* 必要であればスタイルを追加 */
</style>