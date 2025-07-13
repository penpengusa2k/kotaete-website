
<template>
  <div class="app-detail p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-neutral-darkest dark:to-purple-900 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.005]">
    <h2 class="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-300 mb-6 drop-shadow-md">AI恋愛診断</h2>
    <p class="text-lg text-center text-neutral-dark dark:text-neutral-light mb-8 leading-relaxed">
      <span class="font-semibold text-purple-600 dark:text-purple-200">心理学とAI</span>が織りなす、あなただけの特別な診断。
      気になるあの人との<span class="font-semibold text-pink-500 dark:text-pink-300">隠れた相性</span>を徹底解析します！
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="relative">
        <label for="yourName" class="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">あなたの名前</label>
        <div class="flex items-center border border-purple-300 dark:border-purple-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 transition-all duration-200 bg-white dark:bg-neutral-darkest">
          <span class="material-icons-outlined text-purple-500 dark:text-purple-400 ml-3">person</span>
          <input type="text" id="yourName" v-model="yourName" class="flex-grow px-3 py-2 bg-transparent outline-none text-neutral-darkest dark:text-neutral-lightest placeholder-neutral-light dark:placeholder-neutral-dark" placeholder="例: 太郎">
        </div>
      </div>

      <div class="relative">
        <label for="partnerName" class="block text-sm font-bold text-pink-600 dark:text-pink-300 mb-2">相手の名前</label>
        <div class="flex items-center border border-pink-300 dark:border-pink-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition-all duration-200 bg-white dark:bg-neutral-darkest">
          <span class="material-icons-outlined text-pink-500 dark:text-pink-400 ml-3">favorite</span>
          <input type="text" id="partnerName" v-model="partnerName" class="flex-grow px-3 py-2 bg-transparent outline-none text-neutral-darkest dark:text-neutral-lightest placeholder-neutral-light dark:placeholder-neutral-dark" placeholder="例: 花子">
        </div>
      </div>
    </div>

    <p class="text-center text-neutral-dark dark:text-neutral-light mb-8 text-lg font-medium">さあ、心の準備はいいですか？</p>

    <div class="text-center">
      <button @click="startDiagnosis" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700 animate-pulse-once">
        診断スタート！
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const yourName = ref('');
const partnerName = ref('');

const startDiagnosis = () => {
  if (yourName.value.trim() === '' || partnerName.value.trim() === '') {
    alert('名前を入力してください。');
    return;
  }
  alert(`診断を開始します！\nあなた: ${yourName.value}\n相手: ${partnerName.value}`);
  // ここに診断ロジックを追加
};
</script>

<style scoped>
.app-detail {
  max-width: 800px;
  margin: 0 auto;
}

@keyframes pulse-once {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse-once {
  animation: pulse-once 1.5s ease-in-out 1;
}
</style>
