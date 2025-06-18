<template>
  <div class="form-field" :class="fieldClasses">
    <!-- 标签区域 -->
    <label v-if="label" :for="fieldId" class="field-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <!-- 输入内容区域 -->
    <div class="field-content">
      <slot />
    </div>

    <!-- 帮助文本 -->
    <div v-if="helpText" class="help-text">
      {{ helpText }}
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-text">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  required: false
})

// 生成唯一的字段ID
const fieldId = computed(() => `field-${Math.random().toString(36).substr(2, 9)}`)

// 计算字段样式类
const fieldClasses = computed(() => [
  `form-field--${props.size}`,
  {
    'form-field--error': props.error,
    'form-field--disabled': props.disabled,
    'form-field--required': props.required
  }
])
</script>

<style scoped>
.form-field {
  @apply mb-4;
}

.form-field--sm {
  @apply mb-3;
}

.form-field--lg {
  @apply mb-6;
}

.field-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
  @apply transition-colors duration-200;
}

.required-mark {
  @apply text-red-500 ml-1;
}

.field-content {
  @apply relative;
}

.help-text {
  @apply mt-2 text-sm text-gray-500 dark:text-gray-400;
}

.error-text {
  @apply mt-2 text-sm text-red-600 dark:text-red-400;
  @apply flex items-center gap-1;
}

.error-text::before {
  content: "⚠";
  @apply text-red-500;
}

.form-field--error .field-label {
  @apply text-red-600 dark:text-red-400;
}

.form-field--disabled .field-label {
  @apply text-gray-400 dark:text-gray-600;
}
</style>
