<template>
  <FormField v-bind="fieldProps">
    <textarea
      :id="fieldId"
      v-model="textareaValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :class="textareaClasses"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
  </FormField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FormField from './FormField.vue'

interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rows?: number
  size?: 'sm' | 'md' | 'lg'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'input', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rows: 4,
  resize: 'vertical',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

const isFocused = ref(false)

// 生成唯一的字段ID
const fieldId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

// 双向绑定
const textareaValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value)
})

// 传递给FormField的属性
const fieldProps = computed(() => ({
  label: props.label,
  error: props.error,
  helpText: props.helpText,
  required: props.required,
  disabled: props.disabled,
  size: props.size
}))

// 计算文本域样式类
const textareaClasses = computed(() => [
  'form-textarea',
  `form-textarea--${props.size}`,
  `form-textarea--${props.resize}`,
  {
    'form-textarea--error': props.error,
    'form-textarea--disabled': props.disabled,
    'form-textarea--focused': isFocused.value,
    'form-textarea--readonly': props.readonly
  }
])

// 事件处理
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event: Event) => {
  emit('input', event)
}
</script>

<style scoped>
.form-textarea {
  @apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100;
  @apply rounded-lg shadow-sm;
  @apply transition-all duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500;
  @apply placeholder:text-gray-400 dark:placeholder:text-gray-500;
  @apply font-mono text-sm leading-relaxed;
}

.form-textarea--sm {
  @apply px-3 py-2 text-sm;
}

.form-textarea--lg {
  @apply px-5 py-4 text-base;
}

.form-textarea--none {
  @apply resize-none;
}

.form-textarea--vertical {
  @apply resize-y;
}

.form-textarea--horizontal {
  @apply resize-x;
}

.form-textarea--both {
  @apply resize;
}

.form-textarea--error {
  @apply border-red-500 dark:border-red-400;
  @apply focus:ring-red-500/20 focus:border-red-500;
}

.form-textarea--disabled {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
  @apply cursor-not-allowed opacity-60;
}

.form-textarea--readonly {
  @apply bg-gray-50 dark:bg-gray-700/50;
  @apply cursor-default;
}

.form-textarea--focused {
  @apply border-blue-500 ring-2 ring-blue-500/20;
}

.form-textarea:hover:not(:disabled):not(:readonly) {
  @apply border-gray-400 dark:border-gray-500;
}
</style>
