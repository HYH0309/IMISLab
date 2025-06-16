<template>
  <div class="container">
    <div class="flex justify-between p-1 bg-gray-100/50 rounded-lg">
      <RadioGroup v-model="currentLanguage" class="flex gap-2">
        <RadioGroupOption v-for="lang in languages" :key="lang.value" :value="lang.value" class="language-option"
          :title="lang.label">
          <span :class="lang.icon" class="w-10 h-10"></span>
        </RadioGroupOption>
      </RadioGroup>
      <button @click="submitCode"
        class="px-4 py-1 bg-success-500 text-white rounded hover:bg-success-600 transition-colors">
        提交代码
      </button>
    </div>
    <hr />
    <Codemirror v-model:value="code" :options="{
      mode: currentLanguage,
      theme: 'default',
      lineNumbers: true,
      fontFamily: 'monospace',
      lineWrapping: true,
      indentUnit: 2
    }" border ref="cmRef" height="400" width="700" class="rounded-lg justify-center" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import Codemirror from "codemirror-editor-vue3";

const languages = [
  { value: 'text/x-java', label: 'Java', icon: 'i-logos:java' },
  { value: 'text/x-c++src', label: 'C++', icon: 'i-logos:c-plusplus' },
  { value: 'text/x-python', label: 'Python', icon: 'i-logos:python' }
];
const currentLanguage = ref(languages[0].value);
const code = ref(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`);
const cmRef = ref();

const submitStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const emit = defineEmits(['submit'])

const submitCode = async () => {
  submitStatus.value = 'loading'
  try {
    emit('submit', {
      code: code.value,
      language: currentLanguage.value
    })
    submitStatus.value = 'success'
  } catch (error) {
    submitStatus.value = 'error'
    console.error('代码提交失败:', error)
  }
}

defineExpose({
  submitCode
})
</script>

<style scoped>
.language-option {
  @apply p-2 rounded cursor-pointer hover:bg-gray-200/50 transition-colors flex items-center gap-2;
}

.language-option[aria-checked='true'] {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}
</style>
