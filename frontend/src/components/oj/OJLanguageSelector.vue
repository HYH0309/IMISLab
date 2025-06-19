<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from "@headlessui/vue"

defineProps<{
  modelValue: string
  languages: Array<{ value: string; label: string; icon: string; template?: string }>
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <RadioGroup :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
    class="language-selector">
    <div class="options-container">
      <RadioGroupOption v-for="lang in languages" :key="lang.value" :value="lang.value" v-slot="{ checked }"
        class="language-option">
        <div class="option-content" :class="{ 'option-selected': checked }">
          <div class="language-icon">
            <span class="text-sm">{{ lang.icon }}</span>
          </div>
          <span class="language-label">{{ lang.label }}</span>
          <div v-if="checked" class="selected-indicator">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>

<style scoped>
.language-selector {
  @apply w-full;
}

.options-container {
  @apply flex flex-row items-center gap-2 flex-wrap;
}

.language-option {
  @apply cursor-pointer focus:outline-none;
}

.option-content {
  @apply flex flex-row items-center justify-center gap-1.5 px-3 py-1.5 rounded-md;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply border border-gray-200 dark:border-gray-600;
  @apply transition-all duration-200 hover:scale-105;
  @apply hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm;
  @apply text-sm whitespace-nowrap min-w-fit;
}

.option-selected {
  @apply bg-gradient-to-r from-emerald-500 to-cyan-500 text-white;
  @apply border-emerald-400 shadow-md;
  @apply hover:from-emerald-600 hover:to-cyan-600;
}

.language-icon {
  @apply flex items-center justify-center;
}

.language-label {
  @apply font-medium text-xs;
}

.selected-indicator {
  @apply flex items-center justify-center;
}

/* 确保在所有屏幕尺寸下都是横向布局 */
@media (max-width: 768px) {
  .options-container {
    @apply gap-1.5;
  }

  .option-content {
    @apply px-2 py-1 gap-1;
  }

  .language-label {
    @apply text-xs;
  }

  .language-icon span {
    @apply w-3 h-3;
  }

  .selected-indicator svg {
    @apply w-2.5 h-2.5;
  }
}

@media (max-width: 480px) {
  .options-container {
    @apply gap-1;
  }

  .option-content {
    @apply px-1.5 py-0.5 gap-0.5;
  }

  .language-label {
    @apply text-xs;
  }
}
</style>
