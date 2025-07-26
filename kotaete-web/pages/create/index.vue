<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">新規KOTAETE</h1>

    <form @submit.prevent="createSurvey">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">タイトル <span class="text-red-500">*</span></label>
                <textarea id="title" v-model="survey.title" ref="titleInput" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" required :maxlength="MAX_TITLE_LENGTH" rows="1" @input="adjustTextareaHeight" @keydown.enter.prevent="focusNextInput"></textarea>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.title.length }} / {{ MAX_TITLE_LENGTH }}</p>
      </div>

      <div class="mb-4">
        <label for="creatorName" class="block text-gray-700 font-bold mb-2">作成者名 <span class="text-red-500">*</span></label>
                <input type="text" id="creatorName" v-model="survey.creatorName" :class="[ 'appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm', formSubmitted && creatorNameError ? 'border-red-500' : '' ]" required :maxlength="MAX_CREATOR_NAME_LENGTH" @blur="validateCreatorName" @keydown.enter.prevent="focusNextInput">
        <p v-if="formSubmitted && creatorNameError" class="text-red-500 text-xs italic mt-1">作成者名は必須です。</p>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.creatorName.length }} / {{ MAX_CREATOR_NAME_LENGTH }}</p>
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 font-bold mb-2">説明文（任意）</label>
                <textarea id="description" v-model="survey.description" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" rows="3" @input="adjustTextareaHeight" :maxlength="MAX_DESCRIPTION_LENGTH"></textarea>
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.description.length }} / {{ MAX_DESCRIPTION_LENGTH }}</p>
      </div>

      <hr class="my-6">

      <h2 class="text-2xl font-bold mb-4">質問</h2>
      <div v-for="(question, index) in survey.questions" :key="index" class="mb-6 p-4 bg-white rounded-lg shadow-md border border-neutral-light">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xl">Q{{ index + 1 }}</span>
          <button type="button" @click="removeQuestion(index)" class="text-red-500 hover:text-red-700 font-bold no-enter-focus">削除</button>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-1">質問文 <span class="text-red-500">*</span></label>
                    <textarea v-model="question.text" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" required :maxlength="MAX_QUESTION_LENGTH" rows="3" @input="adjustTextareaHeight"></textarea>
          <p class="text-right text-sm text-gray-500 mt-1">{{ question.text.length }} / {{ MAX_QUESTION_LENGTH }}</p>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-1">質問タイプ</label>
                    <select v-model="question.type" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" @keydown.enter.prevent="focusNextInput">
            <option value="text">記述式</option>
            <option value="date">日付</option>
            <option value="radio">ラジオボタン</option>
            <option value="checkbox">チェックボックス</option>
          </select>
        </div>
        <div v-if="question.type === 'radio' || question.type === 'checkbox'">
          <label class="block text-gray-700 font-bold mb-1">選択肢</label>
                    <button type="button" @click="addOption(question)" class="text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400 mb-2 font-semibold" :disabled="question.options.length >= MAX_OPTIONS_PER_QUESTION" @keydown.enter.prevent="focusNextInput">+ 選択肢を追加</button>
          <span v-if="question.options.length >= MAX_OPTIONS_PER_QUESTION" class="ml-2 text-red-500 text-sm">（最大{{ MAX_OPTIONS_PER_QUESTION }}個まで）</span>
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="mb-1">
            <div class="flex items-center">
                            <textarea v-model="option.value" class="appearance-none border border-neutral-light rounded-lg w-full py-1 px-2 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" :maxlength="MAX_OPTION_VALUE_LENGTH" rows="1" @input="adjustTextareaHeight"></textarea>
              <button type="button" @click="removeOption(question, optionIndex)" class="ml-2 text-red-500 no-enter-focus">×</button>
            </div>
            <p class="text-right text-sm text-gray-500 mt-1">{{ option.value.length }} / {{ MAX_OPTION_VALUE_LENGTH }}</p>
          </div>
        </div>
      </div>

            <button type="button" @click="addQuestion" class="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg mb-6 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400 shadow-md transition-colors duration-300" :disabled="survey.questions.length >= MAX_QUESTIONS" @keydown.enter.prevent="focusNextInput">
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
                <select v-model="survey.resultRestricted" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" @keydown.enter.prevent="focusNextInput">
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
                <input type="text" id="viewingKey" v-model="survey.viewingKey" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" required :maxlength="MAX_VIEWING_KEY_LENGTH" @keydown.enter.prevent="focusNextInput">
        <p class="text-right text-sm text-gray-500 mt-1">{{ survey.viewingKey.length }} / {{ MAX_VIEWING_KEY_LENGTH }}</p>
      </div>

      <div class="mb-4">
        <label for="deadline" class="inline-block text-gray-700 font-bold mb-2">回答受付期限 <span class="text-red-500">*</span>
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">回答の受付を終了する日時です。この日時を過ぎると回答できなくなります。</span>
          </span>
        </label>
        <div class="relative cursor-pointer" @click="openDeadlinePicker">
                    <input type="datetime-local" id="deadline" ref="deadlineInput" v-model="survey.deadline" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" required @keydown.enter.prevent="focusNextInput">
          <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm10 5H4v8h12V7z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">回答者名
          <span class="relative group">
            <span class="ml-1 text-gray-500 cursor-pointer material-icons-outlined text-base align-middle">info</span>
            <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center">回答者が匿名で回答するか、ユーザー名を入力して回答するかを設定します。</span>
          </span>
        </label>
                <select v-model="survey.anonymous" class="appearance-none border border-neutral-light rounded-lg w-full py-2 px-3 text-neutral-darkest leading-tight focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200 shadow-sm" @keydown.enter.prevent="focusNextInput">
          <option :value="true">匿名</option>
          <option :value="false">非匿名（ユーザー名入力必須）</option>
        </select>
      </div>

      <div class="mt-8">
        <button type="submit" :class="[ (loading || !isFormValid) ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark', 'text-white font-bold py-3 px-6 rounded-lg w-full text-xl flex items-center justify-center shadow-md transition-colors duration-300' ]" :disabled="loading || !isFormValid" @keydown.enter.prevent="focusNextInput">
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router' // useRouterをインポート
import { useCreateStore } from '~/stores/create'

const createStore = useCreateStore()
const router = useRouter() // useRouterを初期化

// --- 定数定義 ---
const MAX_TITLE_LENGTH = 50;
const MAX_CREATOR_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_QUESTION_LENGTH = 500;
const MAX_QUESTIONS = 50;
const MAX_OPTIONS_PER_QUESTION = 10;
const MAX_OPTION_VALUE_LENGTH = 500;
const MAX_VIEWING_KEY_LENGTH = 50;
const DEFAULT_DEADLINE_DAYS = 3;

const getThreeDaysLater = () => {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DEADLINE_DAYS);
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
    { text: '', type: 'text', options: [] }
  ],
  resultRestricted: false,
  anonymous: true,
  deadline: getThreeDaysLater(),
  viewingKey: '',
  creatorName: '名無し',
});

const loading = ref(false);
const formSubmitted = ref(false);
const creatorNameError = ref(false);

const titleInput = ref(null);
const deadlineInput = ref(null);

const openDeadlinePicker = () => {
  if (deadlineInput.value) {
    try {
      deadlineInput.value.showPicker();
    } catch (error) {
      // showPicker() might not be supported in all browsers.
      // In such cases, the default behavior will be used.
      console.error("showPicker() is not supported by this browser.", error);
    }
  }
};

const validateCreatorName = () => {
  creatorNameError.value = !survey.value.creatorName.trim();
  return !creatorNameError.value;
};

watch(() => survey.value.resultRestricted, (newVal) => {
  if (newVal === false) {
    survey.value.viewingKey = '';
  }
});

watch(
  () => survey.value.questions,
  (newQuestions) => {
    newQuestions.forEach(question => {
      if ((question.type === 'radio' || question.type === 'checkbox') && question.options.length === 0) {
        addOption(question);
      }
      if (question.type === 'text' && question.options.length > 0) {
        question.options = [];
      }
    });
  },
  { deep: true }
);

const isFormValid = computed(() => {
  if (!survey.value.title.trim()) return false;
  if (creatorNameError.value) return false;
  if (!survey.value.deadline) return false;
  if (survey.value.questions.length === 0) return false;

  if (survey.value.resultRestricted && !survey.value.viewingKey.trim()) return false;

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
      // 成功画面へ遷移し、IDと必要情報をPiniaで渡す
      createStore.title = survey.value.title;
      createStore.isRestricted = survey.value.resultRestricted;
      createStore.viewingKey = survey.value.viewingKey;
      createStore.deadline = survey.value.deadline;
      createStore.creatorName = survey.value.creatorName;
      router.push({
        path: `/create/success/${response.id}`,
      });

      // フォームをリセット（遷移後に新しいページで表示されるので、ここでは不要かもしれませんが念のため）
      survey.value = {
        title: '',
        description: '',
        questions: [
          { text: '', type: 'text', options: [] }
        ],
        resultRestricted: false,
        anonymous: true,
        deadline: getThreeDaysLater(),
        viewingKey: '',
        creatorName: '名無し',
      };
      nextTick(() => {
        if (titleInput.value) {
          titleInput.value.focus();
        }
      });
    } else {
      alert(`エラーが発生しました: ${response.message}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error creating survey:', error);
    alert('KOTAETEの作成に失敗しました。');
  } finally {
    loading.value = false;
  }
};

const focusNextInput = (event) => {
  if (event.isComposing) {
    return;
  }

  const formElements = Array.from(event.target.form.elements);
  const index = formElements.indexOf(event.target);

  let nextElement = null;
  for (let i = index + 1; i < formElements.length; i++) {
    const element = formElements[i];
    if (element.classList.contains('no-enter-focus')) {
      continue;
    }
    if (
      (element.tagName === 'INPUT' && element.type !== 'hidden' && !element.disabled) ||
      element.tagName === 'SELECT' && !element.disabled ||
      (element.tagName === 'TEXTAREA' && !element.disabled) ||
      (element.tagName === 'BUTTON' && !element.disabled)
    ) {
      nextElement = element;
      break;
    }
  }

  if (nextElement) {
    nextElement.focus();
  }
};

const adjustTextareaHeight = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

onMounted(() => {
  if (titleInput.value) {
    titleInput.value.focus();
    adjustTextareaHeight({ target: titleInput.value });
  }
});

</script>

<style scoped>
/* Hide the default calendar icon for Webkit browsers */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
