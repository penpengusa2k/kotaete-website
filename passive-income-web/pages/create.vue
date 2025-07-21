<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">新しいKOTAETEを作成</h1>

    <form @submit.prevent="createSurvey">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">KOTAETEタイトル <span class="text-red-500">*</span></label>
        <input type="text" id="title" v-model="survey.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required maxlength="50">
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.title.length }} / 50</p>
      </div>

      <div class="mb-4">
        <label for="creatorName" class="block text-gray-700 font-bold mb-2">作成者名 <span class="text-red-500">*</span></label>
        <input type="text" id="creatorName" v-model="survey.creatorName" :class="[ 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', formSubmitted && creatorNameError ? 'border-red-500' : '' ]" required maxlength="50" @blur="validateCreatorName">
        <p v-if="formSubmitted && creatorNameError" class="text-red-500 text-xs italic mt-1">作成者名は必須です。</p>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.creatorName.length }} / 50</p>
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 font-bold mb-2">説明文（任意）</label>
        <textarea id="description" v-model="survey.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3" maxlength="500"></textarea>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.description.length }} / 500</p>
      </div>

      <hr class="my-6">

      <h2 class="text-2xl font-bold mb-4">質問</h2>
      <div v-for="(question, index) in survey.questions" :key="index" class="mb-6 p-4 border rounded">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xl">Q{{ index + 1 }}</span>
          <button type="button" @click="removeQuestion(index)" class="text-red-500 hover:text-red-700 font-bold">削除</button>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-1">質問文 <span class="text-red-500">*</span></label>
          <input type="text" v-model="question.text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required maxlength="500">
          <p class="text-right text-sm text-gray-500 mt-1">{{ question.text.length }} / 500</p>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-1">質問タイプ</label>
          <select v-model="question.type" class="shadow border rounded w-full py-2 px-3 text-gray-700">
            <option value="text">記述式</option>
            <option value="radio">ラジオボタン</option>
            <option value="checkbox">チェックボックス</option>
          </select>
        </div>
        <div v-if="question.type === 'radio' || question.type === 'checkbox'">
          <label class="block text-gray-700 font-bold mb-1">選択肢</label>
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center mb-1">
            <input type="text" v-model="option.value" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700">
            <button type="button" @click="removeOption(question, optionIndex)" class="ml-2 text-red-500">×</button>
          </div>
          <button type="button" @click="addOption(question)" class="text-blue-500 hover:text-blue-700" :disabled="question.options.length >= 10">+ 選択肢を追加</button>
          <span v-if="question.options.length >= 10" class="ml-2 text-red-500 text-sm">（最大10個まで）</span>
        </div>
      </div>

      <button type="button" @click="addQuestion" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-6">+ 質問を追加</button>

      <hr class="my-6">

      <h2 class="text-2xl font-bold mb-4">設定</h2>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">結果の閲覧制限
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">KOTAETE結果の閲覧に制限をかけるかを設定します。制限する場合、閲覧キーの入力が必須となります。</span>
          </span>
        </label>
        <select v-model="survey.resultRestricted" class="shadow border rounded w-full py-2 px-3 text-gray-700">
          <option :value="false">制限しない（公開）</option>
          <option :value="true">制限する（閲覧キー必須）</option>
        </select>
      </div>

      <div v-if="survey.resultRestricted" class="mb-4">
        <label for="viewingKey" class="block text-gray-700 font-bold mb-2">結果閲覧キー <span class="text-red-500">*</span>
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">KOTAETE結果を閲覧するためのパスワードです。結果の閲覧を制限する場合に必須となります。</span>
          </span>
        </label>
        <input type="text" id="viewingKey" v-model="survey.viewingKey" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
      </div>

      <div class="mb-4">
        <label for="deadline" class="block text-gray-700 font-bold mb-2">回答受付期限 <span class="text-red-500">*</span>
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">回答の受付を終了する日時です。この日時を過ぎると回答できなくなります。</span>
          </span>
        </label>
        <input type="datetime-local" id="deadline" v-model="survey.deadline" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">回答者名
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">回答者が匿名で回答するか、ユーザー名を入力して回答するかを設定します。</span>
          </span>
        </label>
        <select v-model="survey.anonymous" class="shadow border rounded w-full py-2 px-3 text-gray-700">
          <option :value="true">匿名</option>
          <option :value="false">非匿名（ユーザー名入力必須）</option>
        </select>
      </div>

      <div class="mt-8">
        <button type="submit" :class="[ (loading || !isFormValid) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700', 'text-white font-bold py-3 px-6 rounded-full w-full text-xl flex items-center justify-center' ]" :disabled="loading || !isFormValid">
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            作成中...
          </span>
          <span v-else>KOTAETEを作成</span>
        </button>
      </div>
    </form>

    <div v-if="createdUrl" class="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      <h3 class="font-bold">作成完了！</h3>
      <p>回答用URL: <a :href="createdUrl" target="_blank" class="underline">{{ createdUrl }}</a></p>
      <p>結果確認用URL: <a :href="resultUrl" target="_blank" class="underline">{{ resultUrl }}</a></p>

      <div v-if="displayIsRestricted" class="mt-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p class="font-bold">重要: 結果閲覧キー</p>
        <p class="break-all">{{ displayViewingKey }}</p>
        <p class="text-sm mt-1">このKOTAETEは非公開設定です。上記の結果閲覧キーを大切に保存してください。このキーを知っている人のみが結果を閲覧できます。</p>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`" target="_blank" class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.597-8.717L5.25 22H1.942l7.356-8.406L2.25 2.25h3.308l5.979 7.679L18.244 2.25zM10.449 19.92L4.31 4.6H6.02L12.15 19.92h-1.701zm.464-1.797l-1.702-1.701L16.17 4.6h1.701l-7.058 13.523z"></path></svg>
          Xでシェア
        </a>
        <a :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(createdUrl)}&text=${encodeURIComponent(lineShareText)}`" target="_blank" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L10 12.586l4.293-4.293a1 1 0 011.414 1.414z"></path></svg>
          LINEでシェア
        </a>
<a :href="`https://www.threads.net/intent/post?text=${encodeURIComponent(postText)}`" target="_blank" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center">
  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 3.09 1.407 5.862 3.636 7.758l.364.305c.393.33.884.517 1.4.517.547 0 1.077-.2 1.49-.56l1.42-1.243c.347-.304.78-.465 1.23-.465h.9c.665 0 1.304.263 1.77.73l1.16 1.16c.453.452 1.1.707 1.77.707.513 0 1.007-.17 1.41-.48l.347-.287C20.582 17.837 22 15.073 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
  Threadsでシェア
</a>

      </div>
      <div class="mt-4 p-2 bg-gray-50 rounded border">
        <p class="text-sm font-semibold mb-1">コピーして拡散しよう！:</p>
        <textarea readonly class="w-full p-1 text-sm border rounded bg-white" rows="3" @focus="$event.target.select()">{{ postText }}</textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const getThreeDaysLater = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  // フォーマットを 'YYYY-MM-DDTHH:mm' に合わせる
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const survey = ref({
  title: '',
  description: '',
  questions: [
    { text: '', type: 'text', options: [] } // 最初の質問を初期表示
  ],
  resultRestricted: false,
  anonymous: true,
  deadline: getThreeDaysLater(),
  viewingKey: '',
  creatorName: '名無し', // 新しいプロパティを追加
});

const loading = ref(false);
const createdUrl = ref('');
const resultUrl = ref('');
const createdSurveyTitle = ref(''); // 作成されたKOTAETEのタイトルを保持
const formSubmitted = ref(false);
const creatorNameError = ref(false); // 作成者名のエラー状態

// 作成完了後に表示する閲覧キーと制限設定
const displayViewingKey = ref('');
const displayIsRestricted = ref(false);

// SNS投稿文を管理する単一のcomputedプロパティ
const postText = computed(() => {
  if (!createdSurveyTitle.value || !createdUrl.value) {
    return ''; // URLやタイトルがまだない場合は空を返す
  }
  return `KOTAETE「${createdSurveyTitle.value}」が爆誕！ぜひKOTAETEください！
${createdUrl.value}
#KOTAETE #KOTAETEは簡単に作成できるアンケートサービスです`;
});

// LINE用の投稿文 (XやThreadsとはメッセージが異なるため別途定義)
const lineShareText = computed(() => {
  if (!createdSurveyTitle.value || !createdUrl.value) {
    return '';
  }
  return `KOTAETE「${createdSurveyTitle.value}」にご協力ください！KOTAETEであなたの意見をサクッと送信！`;
});

const validateCreatorName = () => {
  creatorNameError.value = !survey.value.creatorName.trim();
  return !creatorNameError.value;
};

watch(() => survey.value.resultRestricted, (newVal) => {
  if (newVal === false) { // 制限なしに切り替わったら閲覧キーをクリア
    survey.value.viewingKey = '';
  }
});

const isFormValid = computed(() => {
  if (!survey.value.title.trim()) return false;
  if (creatorNameError.value) return false; // creatorNameErrorがtrueなら無効
  if (!survey.value.deadline) return false;
  if (survey.value.questions.length === 0) return false;

  if (survey.value.resultRestricted && !survey.value.viewingKey.trim()) return false; // 結果閲覧制限ありの場合、閲覧キー必須

  for (const question of survey.value.questions) {
    if (!question.text.trim()) return false;
    if (question.type === 'radio' || question.type === 'checkbox') {
      if (question.options.length === 0) return false;
      for (const option of question.options) {
        if (!option.value.trim()) return false;
      }
    }
  }
  return true;
});

const addQuestion = () => {
  survey.value.questions.push({
    text: '',
    type: 'text',
    options: [],
  });
};

const removeQuestion = (index) => {
  survey.value.questions.splice(index, 1);
};

const addOption = (question) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.push({ value: '' });
};

const removeOption = (question, optionIndex) => {
  question.options.splice(optionIndex, 1);
};

const createSurvey = async () => {
  formSubmitted.value = true; // フォームが送信されたことをマーク

  // 作成者名のバリデーションを先に実行
  if (!validateCreatorName()) {
    return; // バリデーションエラーがあれば処理を中断
  }

  if (!isFormValid.value) {
    alert('入力項目に不備があります。必須項目を確認してください。');
    return;
  }

  const { v4: uuidv4 } = await import('uuid');
  loading.value = true;
  createdUrl.value = '';
  resultUrl.value = '';

  const config = useRuntimeConfig();
  // const gasApiUrl = config.public.gasApiUrl; // コメントアウトされていますが、必要な場合は有効にしてください

  const body = {
    id: uuidv4(),
    title: survey.value.title,
    description: survey.value.description,
    result_restricted: survey.value.resultRestricted,
    anonymous: survey.value.anonymous,
    deadline: survey.value.deadline,
    viewing_key: survey.value.viewingKey,
    creator_name: survey.value.creatorName,
    questions: JSON.stringify(survey.value.questions),
  };

  try {
    const response = await $fetch('/api/gas-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'create', data: body }),
    });

    if (response.result === 'success') {
      const baseUrl = window.location.origin;
      createdUrl.value = `${baseUrl}/answer/${response.id}`;
      resultUrl.value = `${baseUrl}/result/${response.id}`;
      createdSurveyTitle.value = survey.value.title; // タイトルを保持

      // フォームリセット前に表示用変数に値を保持
      displayViewingKey.value = survey.value.viewingKey;
      displayIsRestricted.value = survey.value.resultRestricted;

      // Reset form
      // Reset form
      survey.value = {
        title: '',
        description: '',
        questions: [
          { text: '', type: 'text', options: [] } // 最初の質問を初期表示
        ],
        resultRestricted: false,
        anonymous: true,
        deadline: getThreeDaysLater(),
        viewingKey: '',
        creatorName: '名無し',
      };
    } else {
      alert(`エラーが発生しました: ${response.message}`);
    }
  } catch (error) {
    console.error('Error creating survey:', error);
    alert('KOTAETEの作成に失敗しました。');
  } finally {
    loading.value = false;
  }
};
</script>
