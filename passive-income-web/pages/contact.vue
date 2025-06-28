<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">お問い合わせ</h1>
    <p class="text-lg">ご質問やご要望など、お気軽にお問い合わせください。</p>
    <form class="mt-8 space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">お名前</label>
        <input type="text" id="name" name="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">メールアドレス</label>
        <input type="email" id="email" name="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700">お問い合わせ内容</label>
        <textarea id="message" name="message" rows="5" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">送信</button>
      </div>
    </form>
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
