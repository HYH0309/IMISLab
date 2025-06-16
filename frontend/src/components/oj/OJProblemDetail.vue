<script setup lang="ts">
import type { OJProblem } from '@/types/api'

defineProps<{
  problem: OJProblem
}>()
</script>

<template>
  <div class="p-4 border rounded-lg bg-white dark:bg-gray-800">
    <h1 class="text-2xl font-bold mb-4">{{ problem.title }}</h1>

    <!-- 题目信息 -->
    <div class="flex flex-wrap gap-4 mb-4">
      <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full" :class="{
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': problem.difficulty === 'Easy',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': problem.difficulty === 'Medium',
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': problem.difficulty === 'Hard'
      }">
        {{ problem.difficulty }}
      </span>
      <span class="text-sm text-gray-600 dark:text-gray-400">
        时间限制: {{ problem.timeLimit }}ms
      </span>
      <span class="text-sm text-gray-600 dark:text-gray-400">
        内存限制: {{ problem.memoryLimit }}MB
      </span>
    </div>

    <!-- 题目描述 -->
    <div class="prose dark:prose-invert max-w-none">
      <pre class="whitespace-pre-wrap text-sm">{{ problem.description }}</pre>
    </div>
  </div>
</template>
