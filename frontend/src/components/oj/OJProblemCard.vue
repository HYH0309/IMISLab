<script setup lang="ts">
import type { OJProblem } from '@/types/api'

const props = defineProps<{ problem: OJProblem }>()

// 调试信息
console.log('OJProblemCard 接收到的 problem 数据:', props.problem)

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case '简单': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    case '中等': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
    case '困难': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
  }
}
</script>

<template>
  <RouterLink :to="{ name: 'OJDetail', params: { id: problem.id } }" class="block no-underline">
    <div tabindex="0" class="oj-problem-card">
      <div class="flex items-start justify-between gap-3 mb-3">
        <h3 class="oj-problem-title">{{ problem.title }}</h3>
        <span :class="['oj-difficulty-badge', getDifficultyColor(problem.difficulty)]">
          {{ problem.difficulty }}
        </span>
      </div>

      <p class="oj-problem-description">{{ problem.description }}</p>

      <div class="oj-problem-meta">
        <div class="meta-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ problem.timeLimit }}ms</span>
        </div>

        <div class="meta-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
            </path>
          </svg>
          <span>{{ problem.memoryLimit }}MB</span>
        </div>

        <div class="oj-problem-id">ID: #{{ problem.id }}</div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.oj-problem-card {
  @apply p-6 rounded-xl bg-white shadow-lg dark:bg-sky-950 border border-sky-100 dark:border-sky-900 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-sky-50 dark:hover:bg-sky-900 active:scale-95 focus:ring-2 focus:ring-sky-300 outline-none;
}

.oj-problem-title {
  @apply text-lg font-semibold text-sky-700 dark:text-sky-200 line-clamp-2 leading-tight;
}

.oj-difficulty-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap;
}

.oj-problem-description {
  @apply text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-4;
}

.oj-problem-meta {
  @apply flex items-center justify-between text-xs text-gray-500 dark:text-gray-400;
}

.meta-item {
  @apply flex items-center gap-1;
}

.oj-problem-id {
  @apply text-xs text-gray-400 font-mono;
}

/* 响应式适配 */
@media (max-width: 640px) {
  .oj-problem-card {
    @apply p-4;
  }

  .oj-problem-title {
    @apply text-base;
  }

  .oj-problem-meta {
    @apply flex-col items-start gap-2;
  }
}
</style>
