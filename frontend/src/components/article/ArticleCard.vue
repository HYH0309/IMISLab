<script setup lang="ts">
import type { ArticleSummary, Tag } from '@/types/api';
import { CalendarIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

interface Props {
  article: ArticleSummary
  tags?: Tag[]
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 计算属性：根据标签ID获取标签名称
const articleTags = computed(() => {
  if (!props.tags || !props.article.tagIds) return []

  return props.article.tagIds
    .map(tagId => props.tags?.find(tag => tag.id === tagId))
    .filter((tag): tag is Tag => tag !== undefined)
    .slice(0, 3) // 最多显示3个标签
})

// 计算剩余标签数量
const remainingTagsCount = computed(() => {
  if (!props.article.tagIds) return 0
  return Math.max(0, props.article.tagIds.length - 3)
})

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.opacity = '1'
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <RouterLink :to="`/article/${article.id}`" class="article-card-link">
    <article class="article-card">
      <!-- 封面图片容器 -->
      <div class="cover-container">
        <!-- 实际图片 -->
        <img v-if="article.coverUrl" :src="article.coverUrl" class="cover-image" loading="lazy" alt="文章封面"
          @load="onImageLoad" @error="onImageError">

        <!-- 默认封面/占位符 -->
        <div v-else class="default-cover">
          <div class="default-cover-icon">
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
          </div>
          <span class="default-cover-text">{{ article.title }}</span>
        </div>

        <!-- 渐变遮罩 -->
        <div class="cover-overlay"></div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div class="article-header">
          <h3 class="article-title">{{ article.title }}</h3>
        </div>

        <!-- 标签区域 -->
        <div v-if="articleTags.length || remainingTagsCount > 0" class="tags-container">
          <span v-for="tag in articleTags" :key="tag.id" class="tag-item">
            {{ tag.name }}
          </span>
          <span v-if="remainingTagsCount > 0" class="tag-more">
            +{{ remainingTagsCount }}
          </span>
        </div>

        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="meta-item">
            <CalendarIcon class="meta-icon" />
            <time :datetime="article.createdAt.toString()">
              {{ formatDate(article.createdAt.toString()) }}
            </time>
          </div>
          <span class="meta-divider">·</span>
          <div class="meta-item">
            <EyeIcon class="meta-icon" />
            <span>{{ article.views || 0 }} 次阅读</span>
          </div>
        </div>
      </div>

      <!-- Hover效果指示器 -->
      <div class="hover-indicator"></div>
    </article>
  </RouterLink>
</template>

<style scoped>
/* 文章卡片链接 */
.article-card-link {
  @apply block no-underline transition-all duration-300 ease-out;
  @apply hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98];
  @apply focus:outline-none focus:ring-4 focus:ring-blue-200/50 dark:focus:ring-blue-800/50;
  @apply rounded-2xl;
}

/* 移动端卡片链接优化 */
@media (max-width: 768px) {
  .article-card-link {
    @apply hover:transform-none hover:scale-100;
    @apply active:scale-[0.97];
    @apply rounded-xl;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .article-card-link {
    @apply hover:transform-none hover:scale-100;
  }

  .article-card-link:active {
    @apply scale-[0.97];
    transition: transform 0.1s ease-out;
  }
}

/* 文章卡片主体 */
.article-card {
  @apply relative overflow-hidden rounded-2xl;
  @apply bg-white dark:bg-gray-800;
  @apply border-2 border-gray-200/80 dark:border-gray-600/50;
  @apply shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50;
  @apply transition-all duration-300 ease-out;
  @apply hover:shadow-2xl hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30;
  @apply hover:border-blue-300/60 dark:hover:border-blue-500/60;
  @apply backdrop-blur-sm;
}

/* 移动端卡片主体优化 */
@media (max-width: 768px) {
  .article-card {
    @apply rounded-xl border shadow-md;
    @apply hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40;
  }
}

@media (max-width: 480px) {
  .article-card {
    @apply rounded-lg border shadow-sm;
    @apply hover:shadow-md;
  }
}

/* 封面容器 */
.cover-container {
  @apply relative w-full h-48 overflow-hidden;
  @apply bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50;
  @apply dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30;
}

/* 移动端封面容器优化 */
@media (max-width: 768px) {
  .cover-container {
    @apply h-40;
  }
}

@media (max-width: 480px) {
  .cover-container {
    @apply h-36;
  }
}

/* 横屏模式封面优化 */
@media (max-width: 896px) and (orientation: landscape) and (max-height: 500px) {
  .cover-container {
    @apply h-32;
  }
}

/* 封面图片 */
.cover-image {
  @apply w-full h-full object-cover transition-all duration-500;
  @apply hover:scale-110 hover:brightness-110;
  @apply opacity-0;
  will-change: transform, opacity;
}

/* 移动端封面图片优化 */
@media (max-width: 768px) {
  .cover-image {
    @apply hover:scale-105 hover:brightness-105;
    @apply transition-all duration-300;
  }
}

/* 触摸设备封面图片优化 */
@media (hover: none) and (pointer: coarse) {
  .cover-image {
    @apply hover:scale-100 hover:brightness-100;
  }
}

/* 默认封面 */
.default-cover {
  @apply absolute inset-0 flex flex-col items-center justify-center;
  @apply bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100;
  @apply dark:from-blue-800/40 dark:via-indigo-800/40 dark:to-purple-800/40;
  @apply text-center px-4;
}

.default-cover-icon {
  @apply mb-3 p-3 rounded-full;
  @apply bg-white/80 dark:bg-gray-800/80;
  @apply shadow-lg;
}

/* 移动端默认封面图标优化 */
@media (max-width: 768px) {
  .default-cover-icon {
    @apply mb-2 p-2;
  }

  .default-cover-icon svg {
    @apply w-6 h-6;
  }
}

.default-cover-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-300;
  @apply line-clamp-2 leading-relaxed;
}

/* 移动端默认封面文本优化 */
@media (max-width: 768px) {
  .default-cover-text {
    @apply text-xs leading-tight px-2;
  }
}

@media (max-width: 480px) {
  .default-cover-text {
    @apply text-xs leading-tight px-1;
  }
}

/* 封面遮罩 */
.cover-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent;
  @apply opacity-0 transition-opacity duration-300;
}

.article-card:hover .cover-overlay {
  @apply opacity-100;
}

/* 内容区域 */
.content-area {
  @apply p-6 space-y-4;
}

/* 移动端内容区域优化 */
@media (max-width: 768px) {
  .content-area {
    @apply p-4 space-y-3;
  }
}

@media (max-width: 480px) {
  .content-area {
    @apply p-3 space-y-2.5;
  }
}

/* 文章标题 */
.article-header {
  @apply space-y-3;
}

.article-title {
  @apply text-xl font-bold line-clamp-2 leading-tight;
  @apply text-gray-900 dark:text-white;
  @apply transition-colors duration-200;
  @apply hover:text-blue-600 dark:hover:text-blue-400;
}

/* 移动端文章标题优化 */
@media (max-width: 768px) {
  .article-title {
    @apply text-lg leading-snug;
  }
}

@media (max-width: 480px) {
  .article-title {
    @apply text-base leading-snug;
  }
}

/* 触摸设备标题优化 */
@media (hover: none) and (pointer: coarse) {
  .article-title {
    @apply hover:text-gray-900 dark:hover:text-white;
  }
}

/* 标签容器 */
.tags-container {
  @apply flex flex-wrap items-center gap-2;
}

/* 移动端标签容器优化 */
@media (max-width: 768px) {
  .tags-container {
    @apply gap-1.5;
  }
}

@media (max-width: 480px) {
  .tags-container {
    @apply gap-1;
  }
}

.tag-item {
  @apply px-3 py-1.5 text-xs font-semibold rounded-full;
  @apply bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700;
  @apply dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300;
  @apply border border-blue-200/50 dark:border-blue-700/50;
  @apply transition-all duration-200;
  @apply hover:scale-105 hover:shadow-md;
  @apply hover:from-blue-200 hover:to-indigo-200;
  @apply dark:hover:from-blue-800/60 dark:hover:to-indigo-800/60;
}

/* 移动端标签项优化 */
@media (max-width: 768px) {
  .tag-item {
    @apply px-2 py-1 text-xs;
    @apply hover:scale-100 hover:shadow-sm;
    @apply rounded-md;
  }
}

@media (max-width: 480px) {
  .tag-item {
    @apply px-1.5 py-0.5 text-xs;
    @apply rounded;
  }
}

/* 触摸设备标签优化 */
@media (hover: none) and (pointer: coarse) {
  .tag-item {
    @apply hover:scale-100 hover:shadow-none;
    @apply hover:from-blue-100 hover:to-indigo-100;
    @apply dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50;
  }
}

.tag-more {
  @apply px-2 py-1 text-xs font-medium rounded-full;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply border border-gray-200 dark:border-gray-600;
}

/* 移动端标签更多优化 */
@media (max-width: 768px) {
  .tag-more {
    @apply px-1.5 py-0.5 text-xs rounded-md;
  }
}

@media (max-width: 480px) {
  .tag-more {
    @apply px-1 py-0.5 text-xs rounded;
  }
}

/* 文章元信息 */
.article-meta {
  @apply flex items-center text-sm;
  @apply text-gray-500 dark:text-gray-400;
  @apply pt-3 border-t border-gray-100 dark:border-gray-700;
}

/* 移动端元信息优化 */
@media (max-width: 768px) {
  .article-meta {
    @apply text-xs pt-2.5;
  }
}

@media (max-width: 480px) {
  .article-meta {
    @apply text-xs pt-2 flex-wrap gap-1;
  }
}

.meta-item {
  @apply flex items-center space-x-1.5;
}

.meta-icon {
  @apply w-4 h-4 opacity-70;
}

/* 移动端元信息图标优化 */
@media (max-width: 768px) {
  .meta-icon {
    @apply w-3.5 h-3.5;
  }
}

@media (max-width: 480px) {
  .meta-icon {
    @apply w-3 h-3;
  }
}

.meta-divider {
  @apply text-gray-300 dark:text-gray-600 font-bold;
}

/* Hover指示器 */
.hover-indicator {
  @apply absolute left-0 bottom-0 w-full h-1;
  @apply bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500;
  @apply transform scale-x-0 transition-transform duration-300 origin-left;
}

.article-card:hover .hover-indicator {
  @apply scale-x-100;
}

/* 高分屏优化 */
@media (min-width: 1440px) {
  .article-card {
    @apply rounded-3xl;
  }

  .cover-container {
    @apply h-56;
  }

  .content-area {
    @apply p-8 space-y-5;
  }

  .article-title {
    @apply text-2xl;
  }
}

/* 触摸设备全局优化 */
@media (hover: none) and (pointer: coarse) {
  .article-card:hover .cover-overlay {
    @apply opacity-0;
  }

  .article-card:hover .hover-indicator {
    @apply scale-x-0;
  }
}

/* 深色模式特殊处理 */
@media (prefers-color-scheme: dark) {
  .article-card {
    @apply shadow-gray-900/20;
  }

  .article-card:hover {
    @apply shadow-blue-900/40;
  }
}

/* 动画性能优化 */
.cover-image,
.cover-overlay,
.reading-time,
.hover-indicator {
  will-change: transform, opacity;
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {

  .article-card-link,
  .article-card,
  .cover-image,
  .cover-overlay,
  .reading-time,
  .tag-item,
  .hover-indicator {
    @apply transition-none;
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .article-card {
    @apply border-gray-900 dark:border-gray-100;
  }

  .tag-item {
    @apply border-gray-900 dark:border-gray-100;
  }
}
</style>
