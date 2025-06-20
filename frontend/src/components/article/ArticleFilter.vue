<script setup lang="ts">
import { ref, watch } from 'vue'
import { PercentBadgeIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  availableTags: string[]
  initialSearchTitle?: string
  initialSelectedTags?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:searchTitle', value: string): void
  (e: 'update:selectedTags', value: string[]): void
}>()

const searchTitle = ref(props.initialSearchTitle || '')
const selectedTags = ref<string[]>(props.initialSelectedTags || [])

const toggleTag = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(t => t !== tag)
    : [...selectedTags.value, tag]
  emit('update:selectedTags', selectedTags.value)
}

const clearAllTags = () => {
  selectedTags.value = []
  emit('update:selectedTags', selectedTags.value)
}

watch(searchTitle, (val) => {
  emit('update:searchTitle', val)
})
</script>

<template>
  <div class="filter-container">
    <!-- 搜索框区域 -->
    <div class="search-section">
      <div class="search-wrapper">
        <div class="search-icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input v-model="searchTitle" class="search-input" placeholder="搜索文章标题...输入关键词快速查找" autocomplete="off"
          autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="search">
        <div v-if="searchTitle" class="clear-button" @click="searchTitle = ''">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>

      <!-- 搜索建议/状态 -->
      <div v-if="searchTitle" class="search-status">
        <span class="status-text">正在搜索 "{{ searchTitle }}"</span>
        <div class="search-indicator"></div>
      </div>
    </div>

    <!-- 标签筛选区域 -->
    <div class="tags-section">
      <div class="tags-header">
        <div class="tags-title">
          <PercentBadgeIcon class="title-icon" />
          <span class="title-text">筛选标签</span>
          <span v-if="selectedTags.length > 0" class="selected-count">
            ({{ selectedTags.length }} 个已选择)
          </span>
        </div>

        <button v-if="selectedTags.length > 0" @click="clearAllTags" class="clear-all-btn">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
            </path>
          </svg>
          清空选择
        </button>
      </div>

      <div class="tags-grid">
        <button v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)"
          :class="['tag-btn', { 'tag-active': selectedTags.includes(tag) }]">
          <span class="tag-text">{{ tag }}</span>
          <div v-if="selectedTags.includes(tag)" class="tag-check">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 筛选容器 */
.filter-container {
  @apply space-y-6;
}

/* 移动端容器优化 */
@media (max-width: 768px) {
  .filter-container {
    @apply space-y-4;
  }
}

/* 搜索区域 */
.search-section {
  @apply space-y-3;
}

.search-wrapper {
  @apply relative max-w-md mx-auto;
}

/* 移动端搜索框优化 */
@media (max-width: 768px) {
  .search-wrapper {
    @apply max-w-none mx-0;
  }
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2;
  @apply text-gray-400 dark:text-gray-500 pointer-events-none;
}

/* 移动端搜索图标优化 */
@media (max-width: 768px) {
  .search-icon {
    @apply left-3;
  }

  .search-icon svg {
    @apply w-4 h-4;
  }
}

.search-input {
  @apply w-full pl-12 pr-12 py-4 rounded-2xl text-base;
  @apply bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm;
  @apply border-2 border-gray-200/60 dark:border-gray-600/60;
  @apply text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
  @apply transition-all duration-300 ease-out;
  @apply focus:outline-none focus:ring-4 focus:ring-blue-200/50 dark:focus:ring-blue-800/50;
  @apply focus:border-blue-400 dark:focus:border-blue-500;
  @apply hover:border-gray-300 dark:hover:border-gray-500;
  @apply shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50;
}

/* 移动端搜索输入框优化 */
@media (max-width: 768px) {
  .search-input {
    @apply py-3 px-4 pl-11 pr-10 text-base rounded-xl;
    @apply shadow-md;
    /* 防止自动缩放 */
    font-size: 16px;
  }

  .search-input::placeholder {
    @apply text-sm;
  }
}

@media (max-width: 480px) {
  .search-input {
    @apply py-2.5 pl-10 pr-9 rounded-lg;
  }
}

.search-input:focus {
  @apply scale-[1.02] shadow-xl shadow-blue-200/30 dark:shadow-blue-900/30;
}

.clear-button {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2;
  @apply p-1 rounded-full text-gray-400 hover:text-gray-600;
  @apply dark:text-gray-500 dark:hover:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-all duration-200 cursor-pointer;
  /* 触摸友好尺寸 */
  min-width: 32px;
  min-height: 32px;
}

/* 移动端清除按钮优化 */
@media (max-width: 768px) {
  .clear-button {
    @apply right-3 p-1.5;
    min-width: 36px;
    min-height: 36px;
  }

  .clear-button svg {
    @apply w-3.5 h-3.5;
  }
}

/* 搜索状态 */
.search-status {
  @apply flex items-center justify-center space-x-2;
  @apply text-sm text-blue-600 dark:text-blue-400;
}

/* 移动端搜索状态优化 */
@media (max-width: 768px) {
  .search-status {
    @apply text-xs space-x-1;
  }
}

.status-text {
  @apply font-medium;
}

.search-indicator {
  @apply w-2 h-2 bg-blue-500 rounded-full animate-pulse;
}

/* 标签区域 */
.tags-section {
  @apply space-y-4;
}

.tags-header {
  @apply flex items-center justify-between flex-wrap gap-3;
}

/* 移动端标签头部优化 */
@media (max-width: 768px) {
  .tags-header {
    @apply flex-col items-start gap-3;
  }
}

@media (max-width: 480px) {
  .tags-header {
    @apply gap-2;
  }
}

.tags-title {
  @apply flex items-center space-x-2;
}

.title-icon {
  @apply w-5 h-5 text-indigo-500 dark:text-indigo-400;
}

.title-text {
  @apply text-lg font-semibold text-gray-800 dark:text-gray-200;
}

/* 移动端标题优化 */
@media (max-width: 768px) {
  .title-text {
    @apply text-base;
  }
}

@media (max-width: 480px) {
  .title-text {
    @apply text-sm;
  }
}

.selected-count {
  @apply text-sm font-medium text-blue-600 dark:text-blue-400;
  @apply px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50;
}

/* 移动端选中数量优化 */
@media (max-width: 768px) {
  .selected-count {
    @apply text-xs px-1.5 py-0.5;
  }
}

.clear-all-btn {
  @apply inline-flex items-center px-4 py-2 rounded-xl;
  @apply text-sm font-medium text-red-600 dark:text-red-400;
  @apply bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50;
  @apply hover:bg-red-100 dark:hover:bg-red-900/30;
  @apply hover:text-red-700 dark:hover:text-red-300;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-4 focus:ring-red-200/50 dark:focus:ring-red-800/50;
  /* 触摸友好尺寸 */
  min-height: 44px;
}

/* 移动端清空按钮优化 */
@media (max-width: 768px) {
  .clear-all-btn {
    @apply px-3 py-2 text-xs rounded-lg;
    @apply w-full justify-center;
    min-height: 40px;
  }

  .clear-all-btn svg {
    @apply w-3.5 h-3.5 mr-1;
  }
}

@media (max-width: 480px) {
  .clear-all-btn {
    @apply px-2.5 py-1.5 text-xs;
    min-height: 36px;
  }
}

/* 标签网格 */
.tags-grid {
  @apply flex flex-wrap gap-3;
}

/* 移动端标签网格优化 */
@media (max-width: 768px) {
  .tags-grid {
    @apply gap-2;
  }
}

@media (max-width: 480px) {
  .tags-grid {
    @apply gap-1.5;
  }
}

.tag-btn {
  @apply inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl;
  @apply text-sm font-medium transition-all duration-200;
  @apply bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400;
  @apply border border-gray-300/50 dark:border-gray-600/50;
  @apply hover:scale-105 hover:shadow-lg;
  @apply focus:outline-none focus:ring-4 focus:ring-blue-200/30 dark:focus:ring-blue-800/30;
  @apply transform hover:-translate-y-0.5;
  /* 触摸友好尺寸 */
  min-height: 44px;
}

/* 移动端标签按钮优化 */
@media (max-width: 768px) {
  .tag-btn {
    @apply px-3 py-2 text-xs rounded-lg;
    @apply hover:scale-100 hover:shadow-md;
    @apply transform-none hover:transform-none;
    min-height: 40px;
  }
}

@media (max-width: 480px) {
  .tag-btn {
    @apply px-2.5 py-1.5 text-xs;
    min-height: 36px;
  }
}

.tag-btn:hover {
  @apply border-blue-300/60 dark:border-blue-500/60;
  @apply bg-blue-50/80 dark:bg-blue-900/20;
  @apply text-blue-700 dark:text-blue-300;
  @apply shadow-blue-100/50 dark:shadow-blue-900/30;
}

.tag-active {
  @apply bg-gradient-to-r from-blue-500/90 to-indigo-500/90;
  @apply text-white/95 border-transparent;
  @apply shadow-md shadow-blue-200/40 dark:shadow-blue-900/40;
  @apply scale-105 -translate-y-0.5;
}

.tag-active:hover {
  @apply from-blue-600/90 to-indigo-600/90;
  @apply shadow-lg shadow-blue-300/50 dark:shadow-blue-900/60;
  @apply text-white;
}

.tag-text {
  @apply truncate max-w-[8rem];
}

/* 移动端标签文本优化 */
@media (max-width: 768px) {
  .tag-text {
    @apply max-w-[6rem] text-xs;
  }
}

@media (max-width: 480px) {
  .tag-text {
    @apply max-w-[5rem] text-xs;
  }
}

.tag-check {
  @apply flex items-center justify-center w-4 h-4;
  @apply bg-white/20 rounded-full;
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .tag-btn {
    /* 移除桌面端 hover 效果 */
    @apply hover:scale-100 hover:shadow-none;
    @apply hover:transform-none;
  }

  .tag-btn:active {
    @apply scale-95 bg-gray-200 dark:bg-gray-700;
    transition: all 0.1s ease-out;
  }

  .tag-active:active {
    @apply scale-95;
  }

  .clear-button:active,
  .clear-all-btn:active {
    @apply scale-95;
    transition: all 0.1s ease-out;
  }
}

/* 动画性能优化 */
.search-input,
.tag-btn,
.clear-button,
.clear-all-btn {
  will-change: transform, box-shadow;
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {

  .search-input,
  .tag-btn,
  .clear-button,
  .clear-all-btn,
  .search-indicator {
    @apply transition-none;
    animation: none;
    transform: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .search-input {
    @apply border-gray-900 dark:border-gray-100;
  }

  .tag-btn {
    @apply border-gray-900 dark:border-gray-100;
  }

  .tag-active {
    @apply bg-black dark:bg-white text-white dark:text-black;
  }
}
</style>
