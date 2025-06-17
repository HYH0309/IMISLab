<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', data: { content: string; author: string }): void
}>()

const comment = ref('')
const author = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!comment.value.trim() || !author.value.trim()) return

  isSubmitting.value = true
  emit('submit', {
    content: comment.value,
    author: author.value
  })
  comment.value = ''
  // 保留用户名，方便连续评论
  isSubmitting.value = false
}
</script>

<template>
  <div class="mt-8 border-t border-border/50 pt-6">
    <div class="space-y-3">
      <!-- 用户名输入 -->
      <div class="flex gap-2">
        <input v-model="author" type="text" placeholder="输入您的昵称..."
          class="flex-1 px-4 py-2 rounded-lg border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-8 text-gray-9 dark:text-gray-1">
      </div>

      <!-- 评论内容输入 -->
      <div class="flex gap-2">
        <textarea v-model="comment" placeholder="输入评论内容..." rows="3"
          class="flex-1 px-4 py-2 rounded-lg border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-8 text-gray-9 dark:text-gray-1 resize-none"
          @keyup.ctrl.enter="handleSubmit"></textarea>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <button :disabled="isSubmitting || !comment.trim() || !author.trim()"
          class="px-6 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors"
          @click="handleSubmit">
          {{ isSubmitting ? '提交中...' : '提交评论' }}
        </button>
      </div>

      <!-- 提示文字 -->
      <p class="text-sm text-gray-500 dark:text-gray-400">
        按 Ctrl+Enter 快速提交评论
      </p>
    </div>
  </div>
</template>
