<template>
  <NuxtLink :to="`/create?template=${template.id}`" class="block h-full">
    <div class="border p-4 rounded-lg shadow-md flex flex-col min-h-[270px] h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
      <h3 class="font-bold text-lg mb-2">{{ template.title }}</h3>
      <ul class="list-disc mb-4 flex-grow overflow-hidden">
        <li v-for="(question, index) in template.questions.slice(0, 3)" :key="index">
          ・{{ question.text }}
        </li>
        <li v-if="template.questions.length > 3" class="text-gray-500">...</li>
      </ul>
      <!-- ボタンを削除 -->
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
});

// emit は不要になるため削除
// const emit = defineEmits(['create']);

// handleCreateFromTemplate も不要になるため削除
// const handleCreateFromTemplate = () => {
//   emit('create', props.template.id);
// };
</script>
