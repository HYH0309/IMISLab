<template>
  <FormField v-bind="fieldProps">
    <select
      :id="fieldId"
      v-model="selectValue"
      :disabled="disabled"
      :class="selectClasses"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </FormField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FormField from './FormField.vue'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options: SelectOption[] | string[] | number[]
  placeholder?: string
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  multiple?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'change', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  required: false,
  multiple: false
})

const emit = defineEmits<Emits>()

const isFocused = ref(false)

// 生成唯一的字段ID
const fieldId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

// 双向绑定
const selectValue = computed({
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

// 计算选择框样式类
const selectClasses = computed(() => [
  'form-select',
  `form-select--${props.size}`,
  {
    'form-select--error': props.error,
    'form-select--disabled': props.disabled,
    'form-select--focused': isFocused.value
  }
])

// 获取选项值
const getOptionValue = (option: SelectOption | string | number): string | number => {
  if (typeof option === 'object' && option !== null) {
    return option.value
  }
  return option
}

// 获取选项标签
const getOptionLabel = (option: SelectOption | string | number): string => {
  if (typeof option === 'object' && option !== null) {
    return option.label
  }
  return String(option)
}

// 事件处理
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}
</script>

<style scoped>
.form-select {
  @apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100;
  @apply rounded-lg shadow-sm;
  @apply transition-all duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500;
  @apply cursor-pointer;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-select--sm {
  @apply px-3 py-2 text-sm;
  padding-right: 32px;
  background-size: 14px;
  background-position: right 8px center;
}

.form-select--lg {
  @apply px-5 py-4 text-lg;
  padding-right: 48px;
  background-size: 18px;
  background-position: right 16px center;
}

.form-select--error {
  @apply border-red-500 dark:border-red-400;
  @apply focus:ring-red-500/20 focus:border-red-500;
}

.form-select--disabled {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
  @apply cursor-not-allowed opacity-60;
}

.form-select--focused {
  @apply border-blue-500 ring-2 ring-blue-500/20;
}

.form-select:hover:not(:disabled) {
  @apply border-gray-400 dark:border-gray-500;
}

/* 暗黑模式下的箭头图标 */
.dark .form-select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}
</style>
