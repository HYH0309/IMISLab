<template>
  <div class="not-found-container">
    <!-- 主要内容 -->
    <div class="content-wrapper">
      <!-- 404显示区域 -->
      <div class="error-display">
        <!-- 简化的404数字 -->
        <div class="error-number">
          <span class="number-text">404</span>
        </div>

        <!-- 错误图标 -->
        <div class="error-icon">
          <ExclamationTriangleIcon class="w-24 h-24 text-yellow-500" />
        </div>

        <!-- 错误信息 -->
        <div class="error-message">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="goHome" class="btn btn-primary">
          <HomeIcon class="w-5 h-5 mr-2" />
          返回首页
        </button>

        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          返回上页
        </button>
      </div>

      <!-- 快速导航 -->
      <div class="quick-nav">
        <h2 class="nav-title">快速导航</h2>
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <HomeIcon class="w-6 h-6" />
            <span>首页</span>
          </router-link>

          <router-link to="/article-list" class="nav-link">
            <DocumentTextIcon class="w-6 h-6" />
            <span>文章</span>
          </router-link>

          <router-link to="/oj-list" class="nav-link">
            <CodeBracketIcon class="w-6 h-6" />
            <span>编程</span>
          </router-link>

          <router-link to="/about" class="nav-link">
            <InformationCircleIcon class="w-6 h-6" />
            <span>关于</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* 基础容器 */
.not-found-container {
  @apply min-h-screen flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-50 via-white to-purple-50;
  @apply dark:from-gray-900 dark:via-gray-800 dark:to-purple-900;
  @apply px-6;
}

/* 主要内容 */
.content-wrapper {
  @apply text-center max-w-2xl mx-auto space-y-12;
}

/* 404显示区域 */
.error-display {
  @apply space-y-8;
}

.error-number {
  @apply mb-6;
}

.number-text {
  @apply text-8xl md:text-9xl font-bold;
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  @apply inline-block;
  animation: pulse 2s ease-in-out infinite alternate;
}

.error-icon {
  @apply flex justify-center mb-6;
  animation: bounce 2s ease-in-out infinite;
}

.error-message {
  @apply space-y-4;
}

.error-title {
  @apply text-3xl md:text-4xl font-bold;
  @apply text-gray-800 dark:text-white;
}

.error-description {
  @apply text-lg text-gray-600 dark:text-gray-300;
  @apply leading-relaxed max-w-md mx-auto;
}

/* 操作按钮 */
.action-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

.btn {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium;
  @apply transition-all duration-300 transform hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply min-w-[140px];
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white;
  @apply hover:from-blue-700 hover:to-purple-700;
  @apply focus:ring-blue-500 shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply border-2 border-gray-300 dark:border-gray-600;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700;
  @apply focus:ring-gray-500;
}

/* 快速导航 */
.quick-nav {
  @apply space-y-6;
}

.nav-title {
  @apply text-xl font-semibold text-gray-700 dark:text-gray-300;
}

.nav-links {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.nav-link {
  @apply flex flex-col items-center p-6 rounded-xl;
  @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm;
  @apply border border-gray-200 dark:border-gray-700;
  @apply text-gray-700 dark:text-gray-300;
  @apply transition-all duration-300 hover:scale-105;
  @apply hover:bg-white dark:hover:bg-gray-800;
  @apply hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600;
  @apply space-y-2;
}

.nav-link:hover {
  @apply text-blue-600 dark:text-blue-400;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 响应式优化 */
@media (max-width: 640px) {
  .number-text {
    @apply text-6xl;
  }

  .error-icon {
    @apply scale-75;
  }

  .nav-links {
    @apply grid-cols-2;
  }

  .nav-link {
    @apply p-4;
  }
}

@media (max-width: 480px) {
  .nav-links {
    @apply grid-cols-1 max-w-xs mx-auto;
  }
}
</style>
