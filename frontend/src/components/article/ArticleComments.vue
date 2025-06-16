<script setup lang="ts">
import CommentInput from '@/components/article/CommentInput.vue'
import type { Comment } from '@/types/api'

defineProps<{
  comments: Comment[]
  loading?: boolean
  error?: string | null
}>()
const emit = defineEmits<{
  (e: 'submit', data: { content: string; author: string }): void
}>()
</script>

<template>
  <div
    class="rounded-2xl shadow-lg p-6 bg-white/95 dark:bg-gray-900/90 border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto">
    <CommentInput @submit="data => emit('submit', data)" />
    <div v-if="loading" class="mt-6 text-sky-400 text-center text-base animate-pulse">正在加载评论...</div>
    <div v-else-if="error" class="mt-6 text-rose-400 text-center text-base">{{ error }}</div>
    <div v-else-if="comments.length" class="mt-6 space-y-4">
      <div v-for="comment in comments" :key="comment.id"
        class="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 shadow-sm transition hover:shadow-md">
        <div class="flex justify-between items-start mb-2">
          <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ comment.author }}</span>
          <span class="text-xs text-gray-400 dark:text-gray-500">{{ comment.createdAt }}</span>
        </div>
        <span class="inline-block align-middle break-words leading-relaxed">{{ comment.content }}</span>
      </div>
    </div>
    <div v-else class="mt-6 text-gray-400 text-center text-base">暂无评论，快来抢沙发吧！</div>
  </div>
</template>
