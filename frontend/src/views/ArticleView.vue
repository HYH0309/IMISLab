<script setup lang="ts">
// 声明id为props，确保RouterView传递的id能被接收
defineProps<{ id: string }>()

import { reactive, onMounted, computed, watch, Teleport } from 'vue'
import { useRoute } from 'vue-router'
import { md } from '@/composables/useMarked'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleTitle from '@/components/article/ArticleTitle.vue'
import ArticleComments from '@/components/article/ArticleComments.vue'
import { motion, useScroll, useSpring } from 'motion-v'
import { api } from '@/api/index'
import type { Comment } from '@/types/api'

const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress)

const route = useRoute()
const articleId = computed(() => Number(route.params.id))

const scrollIndicator = {
  scaleX,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  originX: 0,
  backgroundColor: '#38bdf8', // sky-400
  zIndex: 9999
}

const articleData = reactive({
  title: '' as string,
  content: '' as string,
  rawContent: '' as string, // 保存原始 Markdown 内容
  tocItems: [] as Array<{ id: string, title: string }>,
  comments: [] as Comment[],
  loading: false,
  error: null as string | null
})

// 数据加载
const loadArticleData = async (id: number) => {
  try {
    articleData.loading = true
    articleData.error = null
    const [contentRes, commentsRes] = await Promise.all([
      api.getArticleById(id),
      api.getCommentsByArticleId(id)
    ])
    if (!contentRes?.data) {
      throw new Error('Failed to load article data')
    }
    console.log('Comments response:', commentsRes)
    console.log('Comments data:', commentsRes.data)
    articleData.comments = commentsRes.data || []
    console.log('Article comments after assignment:', articleData.comments)

    // 保存原始内容
    articleData.rawContent = contentRes.data.content

    const fullContent = `[[toc]]\n\n${contentRes.data.content}`
    const fullHtml = md.render(fullContent)

    // 提取标题
    articleData.title = contentRes.data.title
    // 提取TOC项
    const parser = new DOMParser()
    const doc = parser.parseFromString(fullHtml, 'text/html')
    const tocLinks = doc.querySelectorAll('.toc a')
    articleData.tocItems = Array.from(tocLinks).map(link => ({
      id: link.getAttribute('href')?.substring(1) || '',
      title: link.textContent || ''
    }))

    // 获取主要内容
    const tocEnd = fullHtml.indexOf('</nav>') + 6
    articleData.content = fullHtml.slice(tocEnd)
  } catch (err) {
    articleData.error = '加载失败，请稍后重试'
    console.error(err)
  } finally {
    articleData.loading = false
  }
}

onMounted(() => loadArticleData(articleId.value))
watch(articleId, (newId: number) => {
  loadArticleData(newId)
})

const handleCommentSubmit = async (data: { content: string; author: string }) => {
  const comment: Comment = {
    articleId: articleId.value,
    content: data.content,
    author: data.author
  }
  try {
    console.log('Submitting comment:', comment)
    const submitResult = await api.postComment(comment)
    console.log('Comment submit result:', submitResult)
    const comments = await api.getCommentsByArticleId(articleId.value)
    console.log('Updated comments response:', comments)
    articleData.comments = comments.data || []
    console.log('Updated comments data:', articleData.comments)
  } catch (err) {
    articleData.error = '评论提交失败'
    console.error(err)
  }
}

// 下载文章为 Markdown 文件
const downloadMarkdown = () => {
  if (!articleData.title || !articleData.rawContent) {
    return
  }

  // 创建完整的 Markdown 内容
  const markdownContent = `# ${articleData.title}\n\n${articleData.rawContent}`

  // 创建下载链接
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url

  // 清理文件名，移除特殊字符
  const fileName = articleData.title
    .replace(/[<>:"/\\|?*]/g, '') // 移除 Windows 不允许的字符
    .replace(/\s+/g, '_') // 将空格替换为下划线
    .trim()

  link.download = `${fileName}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="article-view-wrapper">
    <div class="relative">
      <div class="flex flex-col gap-8 mx-auto p-4">
        <!-- 文章标题和操作按钮 -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="flex-1">
            <ArticleTitle :title="articleData.title" :comments="articleData.comments" :speed="8" />
          </div>

          <!-- 下载按钮 -->
          <div v-if="!articleData.loading && !articleData.error && articleData.title" class="flex-shrink-0">
            <button @click="downloadMarkdown"
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-200 text-sm font-medium"
              title="下载为 Markdown 文件">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              下载 MD
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 min-h-[calc(100vh-200px)]">
          <!-- 目录卡片（去除外层背景和圆角，避免重复） -->
          <div class="hidden md:block">
            <ArticleToc :items="articleData.tocItems" />
          </div>
          <!-- 正文卡片 -->
          <div v-if="articleData.loading"
            class="bg-sky-50 dark:bg-sky-900 rounded-xl shadow p-8 text-center text-sky-400">
            正在加载文章内容...
          </div>
          <div v-else-if="articleData.error"
            class="bg-rose-50 dark:bg-rose-900 rounded-xl shadow p-8 text-center text-rose-400">
            {{ articleData.error }}
          </div>
          <article v-else class="max-w-3xl mx-auto w-full px-4 py-8 rounded-2xl shadow-lg markdown-content"
            v-html="articleData.content"></article>
        </div>

        <!-- 评论区卡片 -->
        <div class="max-w-3xl mx-auto w-full">
          <ArticleComments :comments="articleData.comments" :loading="articleData.loading" :error="articleData.error"
            @submit="handleCommentSubmit" />
        </div>
      </div>
    </div>

    <!-- 使用 Teleport 将进度条移到 body -->
    <Teleport to="body">
      <motion.div :style="scrollIndicator" />
    </Teleport>
  </div>
</template>

<style scoped>
.article-view-wrapper {
  @apply w-full h-full;
  /* 包装器不影响布局，只是为了满足 Transition 的要求 */
}

.markdown-content :deep(h2) {
  @apply text-xl font-bold mt-10 mb-4 pb-2 border-b border-gray-300 dark:border-gray-700;
}

.markdown-content :deep(pre) {
  @apply rounded-md p-4 my-4 overflow-x-auto font-mono;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27];
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  line-height: 1.5;
}

.markdown-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  @apply px-1.5 py-0.5;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] text-gray-800 dark:text-gray-200;
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  border-radius: 0 !important;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 border-0;
}

.dark .markdown-content :deep(pre code) {
  color: #e6edf3;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-500;
  @apply bg-gray-50 dark:bg-gray-800/30;
  @apply border border-gray-200 dark:border-gray-700;
  @apply px-4 py-2 my-4 text-gray-700 dark:text-gray-300;
  @apply rounded-sm;
}

.markdown-content :deep(.markdown-it-code-copy) {
  @apply absolute right-2 top-2 p-1 text-sm;
  @apply text-gray-500 dark:text-gray-400 opacity-70 hover:opacity-100;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] border border-[#e1e4e8] dark:border-[#3b424d] rounded;
}
</style>
