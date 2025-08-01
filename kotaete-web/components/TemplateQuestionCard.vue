<template>
  <div class="border p-4 rounded-lg shadow-md">
    <h3 class="font-bold text-lg mb-2">{{ template.title }}</h3>
    <ul class="list-disc list-inside mb-4">
      <li v-for="(question, index) in template.questions" :key="index">
        {{ question.question_text }}
      </li>
    </ul>
    <button
      @click="handleCreateFromTemplate"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      このテンプレートで作成
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['create']);

const handleCreateFromTemplate = () => {
  emit('create', props.template.id);
};
</script>
