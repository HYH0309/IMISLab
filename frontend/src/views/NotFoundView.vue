<template>
  <div class="not-found-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content-wrapper">
      <!-- 404图标和数字 -->
      <div class="error-display">
        <div class="error-number">
          <span class="digit">4</span>
          <div class="zero-container">
            <svg class="zero-svg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="zero-circle"
              />
            </svg>
          </div>
          <span class="digit">4</span>
        </div>

        <!-- 错误信息 -->
        <div class="error-message">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移动。
            <br>
            请检查URL是否正确，或返回首页继续浏览。
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="goHome" class="btn btn-primary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回首页
        </button>

        <button @click="goBack" class="btn btn-secondary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回上页
        </button>
      </div>

      <!-- 帮助信息 -->
      <div class="help-section">
        <h2 class="help-title">您可能想要访问：</h2>
        <div class="help-links">
          <router-link to="/" class="help-link">
            <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            首页
          </router-link>

          <router-link to="/article-list" class="help-link">
            <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            文章列表
          </router-link>

          <router-link to="/oj-list" class="help-link">
            <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            编程题目
          </router-link>

          <router-link to="/about" class="help-link">
            <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            关于我们
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

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
.not-found-container {
  @apply min-h-screen flex items-center justify-center relative overflow-hidden;
  @apply bg-gradient-to-br from-blue-50 via-white to-purple-50;
  @apply dark:from-gray-900 dark:via-gray-800 dark:to-purple-900;
}

/* 背景装饰 */
.background-decoration {
  @apply absolute inset-0 pointer-events-none;
}

.floating-shapes {
  @apply relative w-full h-full;
}

.shape {
  @apply absolute rounded-full opacity-10 dark:opacity-5;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  @apply w-64 h-64 bg-blue-400 top-10 left-10;
  animation-delay: 0s;
}

.shape-2 {
  @apply w-48 h-48 bg-purple-400 top-32 right-20;
  animation-delay: 2s;
}

.shape-3 {
  @apply w-80 h-80 bg-pink-400 bottom-20 left-1/4;
  animation-delay: 4s;
}

.shape-4 {
  @apply w-56 h-56 bg-indigo-400 bottom-32 right-16;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(5deg);
  }
  66% {
    transform: translateY(10px) rotate(-5deg);
  }
}

/* 主要内容 */
.content-wrapper {
  @apply relative z-10 text-center max-w-4xl mx-auto px-6;
}

/* 404错误显示 */
.error-display {
  @apply mb-12;
}

.error-number {
  @apply flex items-center justify-center mb-8;
  @apply text-8xl md:text-9xl font-bold;
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.digit {
  @apply inline-block;
  animation: bounce 2s ease-in-out infinite;
}

.digit:last-child {
  animation-delay: 0.2s;
}

.zero-container {
  @apply mx-4 inline-block;
}

.zero-svg {
  @apply w-20 h-20 md:w-24 md:h-24;
  @apply text-blue-600 dark:text-blue-400;
}

.zero-circle {
  stroke-dasharray: 251;
  stroke-dashoffset: 251;
  animation: drawCircle 2s ease-in-out infinite;
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

@keyframes drawCircle {
  0% {
    stroke-dashoffset: 251;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 251;
  }
}

/* 错误信息 */
.error-title {
  @apply text-3xl md:text-4xl font-bold mb-4;
  @apply text-gray-800 dark:text-white;
}

.error-description {
  @apply text-lg md:text-xl text-gray-600 dark:text-gray-300;
  @apply leading-relaxed;
}

/* 操作按钮 */
.action-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center mb-12;
}

.btn {
  @apply inline-flex items-center px-6 py-3 rounded-lg font-medium;
  @apply transition-all duration-300 transform hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
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

.btn-icon {
  @apply w-5 h-5 mr-2;
}

/* 帮助信息 */
.help-section {
  @apply text-center;
}

.help-title {
  @apply text-xl font-semibold mb-6;
  @apply text-gray-700 dark:text-gray-300;
}

.help-links {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.help-link {
  @apply flex flex-col items-center p-4 rounded-lg;
  @apply bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm;
  @apply border border-gray-200 dark:border-gray-700;
  @apply text-gray-700 dark:text-gray-300;
  @apply transition-all duration-300 hover:scale-105;
  @apply hover:bg-white dark:hover:bg-gray-800;
  @apply hover:shadow-lg;
}

.link-icon {
  @apply w-8 h-8 mb-2 text-blue-600 dark:text-blue-400;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .error-number {
    @apply text-6xl;
  }

  .zero-svg {
    @apply w-16 h-16;
  }

  .help-links {
    @apply grid-cols-1;
  }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .shape {
    @apply opacity-5;
  }
}
</style>
