<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">新しいKOTAETEを作成</h1>

    <form @submit.prevent="createSurvey">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">KOTAETEタイトル <span class="text-red-500">*</span></label>
        <input type="text" id="title" v-model="survey.title" ref="titleInput" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :maxlength="MAX_TITLE_LENGTH">
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.title.length }} / {{ MAX_TITLE_LENGTH }}</p>
      </div>

      <div class="mb-4">
        <label for="creatorName" class="block text-gray-700 font-bold mb-2">作成者名 <span class="text-red-500">*</span></label>
        <input type="text" id="creatorName" v-model="survey.creatorName" :class="[ 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', formSubmitted && creatorNameError ? 'border-red-500' : '' ]" required :maxlength="MAX_CREATOR_NAME_LENGTH" @blur="validateCreatorName">
        <p v-if="formSubmitted && creatorNameError" class="text-red-500 text-xs italic mt-1">作成者名は必須です。</p>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.creatorName.length }} / {{ MAX_CREATOR_NAME_LENGTH }}</p>
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 font-bold mb-2">説明文（任意）</label>
        <textarea id="description" v-model="survey.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3" :maxlength="MAX_DESCRIPTION_LENGTH"></textarea>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.description.length }} / {{ MAX_DESCRIPTION_LENGTH }}</p>
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
          <input type="text" v-model="question.text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required :maxlength="MAX_QUESTION_LENGTH">
          <p class="text-right text-sm text-gray-500 mt-1">{{ question.text.length }} / {{ MAX_QUESTION_LENGTH }}</p>
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
          <button type="button" @click="addOption(question)" class="text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400 mb-2" :disabled="question.options.length >= MAX_OPTIONS_PER_QUESTION">+ 選択肢を追加</button>
          <span v-if="question.options.length >= MAX_OPTIONS_PER_QUESTION" class="ml-2 text-red-500 text-sm">（最大{{ MAX_OPTIONS_PER_QUESTION }}個まで）</span>
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="mb-1">
            <div class="flex items-center">
              <input type="text" v-model="option.value" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700" :maxlength="MAX_OPTION_VALUE_LENGTH">
              <button type="button" @click="removeOption(question, optionIndex)" class="ml-2 text-red-500">×</button>
            </div>
            <p class="text-right text-sm text-gray-500 mt-1">{{ option.value.length }} / {{ MAX_OPTION_VALUE_LENGTH }}</p>
          </div>
        </div>
      </div>

      <button type="button" @click="addQuestion" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-6 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400" :disabled="survey.questions.length >= MAX_QUESTIONS">
        + 質問を追加
      </button>
      <span v-if="survey.questions.length >= MAX_QUESTIONS" class="ml-2 text-red-500 text-sm">（最大{{ MAX_QUESTIONS }}個まで）</span>

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
      <p class="break-all">回答用URL: <a :href="createdUrl" target="_blank" class="underline">{{ createdUrl }}</a></p>
      <p class="break-all">結果確認用URL: <a :href="resultUrl" target="_blank" class="underline">{{ resultUrl }}</a></p>

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
import { ref, computed, watch, onMounted } from 'vue' // onMounted をインポート

// --- 定数定義 ---
const MAX_TITLE_LENGTH = 50;
const MAX_CREATOR_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_QUESTION_LENGTH = 500;
const MAX_QUESTIONS = 50;
const MAX_OPTIONS_PER_QUESTION = 10;
const MAX_OPTION_VALUE_LENGTH = 500; // 選択肢の文字数制限を500に更新
const DEFAULT_DEADLINE_DAYS = 3; // デフォルトの回答期限を3日後に設定

// 回答期限のデフォルト値を設定するヘルパー関数
const getThreeDaysLater = () => {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DEADLINE_DAYS);
  // フォーマットを 'YYYY-MM-DDTHH:mm' に合わせる
  const year = String(date.getFullYear());
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
  creatorName: '名無し',
});

const loading = ref(false);
const createdUrl = ref('');
const resultUrl = ref('');
const createdSurveyTitle = ref('');
const formSubmitted = ref(false);
const creatorNameError = ref(false);

const displayViewingKey = ref('');
const displayIsRestricted = ref(false);

// タイトル入力フィールドへの参照を保持するref
const titleInput = ref(null);

const postText = computed(() => {
  if (!createdSurveyTitle.value || !createdUrl.value) {
    return '';
  }
  return `KOTAETE「${createdSurveyTitle.value}」が爆誕！ぜひKOTAETEください！
${createdUrl.value}
#KOTAETE #KOTAETEは簡単に作成できるアンケートサービスです`;
});

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

// 結果閲覧制限のwatchは既存のまま
watch(() => survey.value.resultRestricted, (newVal) => {
  if (newVal === false) {
    survey.value.viewingKey = '';
  }
});

// 各質問のタイプ変更を監視し、選択肢を自動追加
watch(
  () => survey.value.questions,
  (newQuestions) => {
    newQuestions.forEach(question => {
      // 質問タイプがラジオボタンまたはチェックボックスで、かつ選択肢が0個の場合
      if ((question.type === 'radio' || question.type === 'checkbox') && question.options.length === 0) {
        addOption(question); // 最初の選択肢を自動追加
      }
      // 質問タイプが記述式に変わり、かつ選択肢がある場合はクリア
      if (question.type === 'text' && question.options.length > 0) {
        question.options = [];
      }
    });
  },
  { deep: true } // questions配列内のオブジェクトの変更も監視するためにdeepオプションをtrueにする
);


const isFormValid = computed(() => {
  if (!survey.value.title.trim()) return false;
  if (creatorNameError.value) return false;
  if (!survey.value.deadline) return false;
  if (survey.value.questions.length === 0) return false;

  if (survey.value.resultRestricted && !survey.value.viewingKey.trim()) return false;

  for (const question of survey.value.questions) {
    if (!question.text.trim()) return false;
    // 選択肢タイプの質問の場合、選択肢が1つ以上あり、かつその値が空でないことを確認
    if (question.type === 'radio' || question.type === 'checkbox') {
      if (question.options.length === 0) return false; // 選択肢がない場合は無効
      for (const option of question.options) {
        if (!option.value.trim()) return false; // 選択肢の値が空の場合は無効
      }
    }
  }
  return true;
});

const addQuestion = () => {
  survey.value.questions.push({
    text: '',
    type: 'text',
    options: [], // 初期はテキストタイプなのでオプションは空
  });
};

const removeQuestion = (index) => {
  survey.value.questions.splice(index, 1);
};

const addOption = (question) => {
  if (!question.options) {
    question.options = [];
  }
  // 最大選択肢数を超えていない場合のみ追加
  if (question.options.length < MAX_OPTIONS_PER_QUESTION) {
    question.options.push({ value: '' });
  }
};

const removeOption = (question, optionIndex) => {
  question.options.splice(optionIndex, 1);
};

const createSurvey = async () => {
  formSubmitted.value = true;

  if (!validateCreatorName()) {
    return;
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
      createdSurveyTitle.value = survey.value.title;

      displayViewingKey.value = survey.value.viewingKey;
      displayIsRestricted.value = survey.value.resultRestricted;

      // Reset form
      survey.value = {
        title: '',
        description: '',
        questions: [
          { text: '', type: 'text', options: [] }
        ],
        resultRestricted: false,
        anonymous: true,
        deadline: getThreeDaysLater(), // 定数を使用
        viewingKey: '',
        creatorName: '名無し',
      };
      // フォームリセット後もタイトルフィールドにフォーカスを当てる
      // DOMの更新を待ってからフォーカスを当てる
      nextTick(() => {
        if (titleInput.value) {
          titleInput.value.focus();
        }
      });
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

// コンポーネントがマウントされたらタイトル入力フィールドにフォーカス
onMounted(() => {
  if (titleInput.value) {
    titleInput.value.focus();
  }
});
</script>
