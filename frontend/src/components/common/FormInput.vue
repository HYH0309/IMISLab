<template>
  <FormField v-bind="fieldProps">
    <input
      :id="fieldId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :class="inputClasses"
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
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'input', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  width: 'full',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

const isFocused = ref(false)

// 生成唯一的字段ID
const fieldId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// 双向绑定
const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => {
    const processedValue = props.type === 'number' ? Number(value) : value
    emit('update:modelValue', processedValue)
  }
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

// 计算输入框样式类
const inputClasses = computed(() => [
  'form-input',
  `form-input--${props.size}`,
  `form-input--${props.width}`,
  {
    'form-input--error': props.error,
    'form-input--disabled': props.disabled,
    'form-input--focused': isFocused.value,
    'form-input--readonly': props.readonly
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
.form-input {
  @apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100;
  @apply rounded-lg shadow-sm;
  @apply transition-all duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500;
  @apply placeholder:text-gray-400 dark:placeholder:text-gray-500;
}

.form-input--sm {
  @apply px-3 py-2 text-sm;
}

.form-input--lg {
  @apply px-5 py-4 text-lg;
}

.form-input--auto {
  @apply w-auto;
}

.form-input--sm-width {
  @apply w-24;
}

.form-input--md-width {
  @apply w-48;
}

.form-input--lg-width {
  @apply w-64;
}

.form-input--xl-width {
  @apply w-80;
}

.form-input--error {
  @apply border-red-500 dark:border-red-400;
  @apply focus:ring-red-500/20 focus:border-red-500;
}

.form-input--disabled {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
  @apply cursor-not-allowed opacity-60;
}

.form-input--readonly {
  @apply bg-gray-50 dark:bg-gray-700/50;
  @apply cursor-default;
}

.form-input--focused {
  @apply border-blue-500 ring-2 ring-blue-500/20;
}

.form-input:hover:not(:disabled):not(:readonly) {
  @apply border-gray-400 dark:border-gray-500;
}
</style>
