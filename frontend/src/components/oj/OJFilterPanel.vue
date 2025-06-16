<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useZIndex } from '@/composables/useZIndex'

useZIndex()

const props = defineProps<{
  modelValue: string
  placeholder?: string
  suggestions?: string[]
}>()

const emit = defineEmits(['update:modelValue', 'clear'])

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const showSuggestions = ref(false)

// 防抖搜索
const debouncedEmit = useDebounceFn((value: string) => {
  emit('update:modelValue', value)
}, 300)

function updateValue(e: Event) {
  const value = (e.target as HTMLInputElement).value
  debouncedEmit(value)
}

function clearSearch() {
  if (inputRef.value) {
    inputRef.value.value = ''
  }
  emit('update:modelValue', '')
  emit('clear')
}

function selectSuggestion(suggestion: string) {
  if (inputRef.value) {
    inputRef.value.value = suggestion
  }
  emit('update:modelValue', suggestion)
  showSuggestions.value = false
}

function onFocus() {
  isFocused.value = true
  if (props.suggestions && props.suggestions.length > 0) {
    showSuggestions.value = true
  }
}

function onBlur() {
  isFocused.value = false
  // 延迟隐藏建议，以便点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 键盘导航
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    showSuggestions.value = false
    inputRef.value?.blur()
  }
}
</script>

<template>
  <div class="search-container">
    <!-- 搜索框区域 -->
    <div class="search-wrapper">
      <div class="search-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <input
        ref="inputRef"
        :value="modelValue"
        @input="updateValue"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        type="text"
        :placeholder="placeholder || '搜索题目名称、ID...'"
        class="search-input"
        autocomplete="off"
        spellcheck="false">

      <div v-if="modelValue" class="clear-button" @click="clearSearch">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
    </div>

    <!-- 搜索状态指示 -->
    <div v-if="modelValue" class="search-status">
      <span class="status-text">正在搜索 "{{ modelValue }}"</span>
      <div class="search-indicator"></div>
    </div>

    <!-- 搜索建议下拉 -->
    <div v-if="showSuggestions && suggestions && suggestions.length > 0"
         class="suggestions-dropdown">
      <div class="suggestions-header">
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">搜索建议</span>
      </div>
      <div class="suggestions-list">
        <button
          v-for="suggestion in suggestions.slice(0, 5)"
          :key="suggestion"
          @click="selectSuggestion(suggestion)"
          class="suggestion-item">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span>{{ suggestion }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 搜索容器 */
.search-container {
  @apply relative w-full max-w-2xl mx-auto;
}

/* 搜索框包装器 */
.search-wrapper {
  @apply relative;
}

/* 搜索图标 */
.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2;
  @apply text-gray-400 dark:text-gray-500 pointer-events-none;
}

/* 搜索输入框 */
.search-input {
  @apply w-full pl-12 pr-12 py-4 rounded-2xl text-base;
  @apply bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm;
  @apply border-2 border-gray-200/60 dark:border-gray-600/60;
  @apply text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
  @apply transition-all duration-300 ease-out;
  @apply focus:outline-none focus:ring-4 focus:ring-emerald-200/50 dark:focus:ring-emerald-800/50;
  @apply focus:border-emerald-400 dark:focus:border-emerald-500;
  @apply hover:border-gray-300 dark:hover:border-gray-500;
  @apply shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50;
}

.search-input:focus {
  @apply scale-[1.02] shadow-xl shadow-emerald-200/30 dark:shadow-emerald-900/30;
}

/* 清除按钮 */
.clear-button {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2;
  @apply p-1 rounded-full text-gray-400 hover:text-gray-600;
  @apply dark:text-gray-500 dark:hover:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-all duration-200 cursor-pointer;
}

/* 搜索状态 */
.search-status {
  @apply flex items-center justify-center space-x-2 mt-3;
  @apply text-sm text-emerald-600 dark:text-emerald-400;
}

.status-text {
  @apply font-medium;
}

.search-indicator {
  @apply w-2 h-2 bg-emerald-500 rounded-full animate-pulse;
}

/* 建议下拉框 */
.suggestions-dropdown {
  @apply absolute top-full left-0 right-0 mt-2;
  @apply backdrop-blur-sm bg-white/95 dark:bg-gray-800/95;
  @apply border border-gray-200/80 dark:border-gray-600/80;
  @apply rounded-xl shadow-xl;
  @apply max-h-64 overflow-y-auto;
  z-index: var(--z-dropdown, 15);
}

.suggestions-header {
  @apply px-4 py-2 border-b border-gray-200/50 dark:border-gray-600/50;
}

.suggestions-list {
  @apply py-2;
}

.suggestion-item {
  @apply w-full px-4 py-2 flex items-center space-x-3;
  @apply text-left text-gray-700 dark:text-gray-300;
  @apply hover:bg-emerald-50 dark:hover:bg-emerald-900/20;
  @apply transition-colors duration-150;
}

.suggestion-item:hover {
  @apply text-emerald-600 dark:text-emerald-400;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .search-input {
    @apply pl-10 pr-10 py-3 text-sm;
  }

  .search-icon {
    @apply left-3;
  }

  .clear-button {
    @apply right-3;
  }
}
</style>
