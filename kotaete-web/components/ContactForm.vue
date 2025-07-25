<template>
  <div>
    <p class="mb-4">ご質問やご意見がございましたら、以下のフォームよりお気軽にお問い合わせください。</p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="name" class="block text-gray-700 font-bold mb-2">お名前</label>
        <input type="text" id="name" v-model="form.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :disabled="isLoading" :maxlength="MAX_NAME_LENGTH">
        <p class="text-right text-sm text-gray-500 mt-1">{{ form.name.length }} / {{ MAX_NAME_LENGTH }}</p>
      </div>

      <div>
        <label for="email" class="block text-gray-700 font-bold mb-2">メールアドレス</label>
        <input type="email" id="email" v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :disabled="isLoading" :maxlength="MAX_EMAIL_LENGTH">
        <p class="text-right text-sm text-gray-500 mt-1">{{ form.email.length }} / {{ MAX_EMAIL_LENGTH }}</p>
      </div>

      <div>
        <label for="message" class="block text-gray-700 font-bold mb-2">お問い合わせ内容</label>
        <textarea id="message" v-model="form.message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="6" required :disabled="isLoading" :maxlength="MAX_MESSAGE_LENGTH"></textarea>
        <p class="text-right text-sm text-gray-500 mt-1">{{ form.message.length }} / {{ MAX_MESSAGE_LENGTH }}</p>
      </div>

      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" :disabled="isLoading">
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          送信中...
        </span>
        <span v-else>送信</span>
      </button>
    </form>

    <div v-if="submitStatus === 'success'" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      お問い合わせありがとうございます。内容を確認後、ご連絡させていただきます。
    </div>
    <div v-else-if="submitStatus === 'error'" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      送信中にエラーが発生しました。もう一度お試しください。
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const MAX_NAME_LENGTH = 500;
const MAX_EMAIL_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;

const form = ref({
  name: '',
  email: '',
  message: '',
});

const submitStatus = ref(null);
const isLoading = ref(false); // ローディング状態を追加

const submitForm = async () => {
  submitStatus.value = null;
  isLoading.value = true; // 送信開始時にローディングをtrueに
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    if (response.result === 'success') {
      submitStatus.value = 'success';
      form.value = { name: '', email: '', message: '' }; // フォームをクリア
    } else {
      submitStatus.value = 'error';
      console.error('Form submission error:', response.message);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    submitStatus.value = 'error';
  } finally {
    isLoading.value = false; // 処理完了時にローディングをfalseに
  }
};
</script>