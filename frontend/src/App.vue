<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { Z_INDEX_VARS } from '@/config/z-index'
import MusicPlayer from '@/components/MusicPlayer.vue'
import NavBar from '@/components/NavBar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

// 状态管理
const themeStore = useThemeStore()
const isLoading = ref(true)
const hasError = ref(false)

// 注入CSS变量到根元素
onMounted(async () => {
  // 设置z-index CSS变量
  Object.entries(Z_INDEX_VARS).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, String(value))
  })

  try {
    // 初始化主题
    await themeStore.initTheme()

    // 模拟应用初始化延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    isLoading.value = false
  } catch (error) {
    handleGlobalError(error)
    isLoading.value = false
  }
})

// 重新加载应用
const reloadApp = () => {
  window.location.reload()
}

// 全局错误处理
const handleGlobalError = (error: unknown) => {
  console.error('Global error:', error)
  hasError.value = true
}

// 提供全局错误处理器
provide('handleError', handleGlobalError)
</script>

<template>
  <div id="app" class="app-container">
    <!-- 主内容区域 - 最底层 -->
    <main class="main-content">
      <Suspense>
        <template #default>
          <RouterView v-slot="{ Component, route }">
            <Transition
              :name="route.meta.transition as string || 'fade'"
              mode="out-in"
              appear>
              <component :is="Component" :key="route.path" />
            </Transition>
          </RouterView>
        </template>
        <template #fallback>
          <div class="route-loading">
            <div class="route-spinner"></div>
            <p>正在加载页面...</p>
          </div>
        </template>
      </Suspense>
    </main>

    <!-- 固定UI组件 - 中层 -->
    <!-- 主题切换器 - z-index: 30 -->
    <ThemeToggle />

    <!-- 导航栏 - z-index: 40 -->
    <NavBar />

    <!-- 音乐播放器 - z-index: 50 -->
    <MusicPlayer />

    <!-- 全局状态覆盖层 - 最高层 -->
    <!-- 全局加载状态 - z-index: 95 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLoading" class="global-loading">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载应用...</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 全局错误状态 - z-index: 100 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="hasError" class="global-error">
          <div class="error-content">
            <h2>应用加载失败</h2>
            <p>请刷新页面重试</p>
            <button @click="reloadApp" class="retry-btn">重新加载</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/*
  Z-Index 层级图解 (从低到高):

  ┌─────────────────────────────────────┐
  │ 100: 全局错误状态 (最高优先级)        │
  ├─────────────────────────────────────┤
  │  95: 全局加载状态                   │
  ├─────────────────────────────────────┤
  │  70: 弹窗/对话框 (BaseModal等)       │
  ├─────────────────────────────────────┤
  │  50: 音乐播放器 (固定在左下角)       │
  ├─────────────────────────────────────┤
  │  40: 导航栏 (固定在右侧)            │
  ├─────────────────────────────────────┤
  │  30: 主题切换器 (固定在右上角)       │
  ├─────────────────────────────────────┤
  │  15: 下拉菜单/工具提示              │
  ├─────────────────────────────────────┤
  │  10: 路由加载状态                   │
  ├─────────────────────────────────────┤
  │   5: 主内容区域 (RouterView)        │
  ├─────────────────────────────────────┤
  │   1: 基础层                        │
  └─────────────────────────────────────┘
*/

/* 确保全局状态覆盖层在最顶层 */
.app-container {
  @apply min-h-screen relative;
  @apply bg-white dark:bg-gray-900;
  @apply transition-colors duration-300;
  /* 容器本身不设置z-index，让子元素自由管理层级 */
}

/* 主内容区域 - 基础层 z-index: 5 */
.main-content {
  @apply flex-1 relative;
  @apply transition-all duration-300 ease-in-out;
  z-index: var(--z-content, 5);
}

/* 路由加载状态 - 内容层之上 z-index: 10 */
.route-loading {
  @apply flex flex-col items-center justify-center;
  @apply min-h-[50vh] space-y-4;
  z-index: var(--z-route-loading, 10);
}

.route-spinner {
  @apply w-8 h-8;
  @apply border-3 border-gray-300 dark:border-gray-600;
  @apply border-t-blue-500 rounded-full;
  @apply animate-spin;
}

.route-loading p {
  @apply text-gray-500 dark:text-gray-400 text-sm;
}

/* 全局加载状态 - 高优先级覆盖层 */
.global-loading {
  @apply fixed inset-0;
  @apply bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm;
  @apply flex items-center justify-center;
  z-index: var(--z-loading, 95) !important; /* 强制高优先级 */
  pointer-events: auto; /* 确保可以交互 */
}

.loading-content {
  @apply text-center space-y-4;
}

.loading-spinner {
  @apply w-12 h-12 mx-auto;
  @apply border-4 border-gray-200 dark:border-gray-700;
  @apply border-t-blue-500 rounded-full;
  @apply animate-spin;
}

.loading-text {
  @apply text-gray-600 dark:text-gray-400;
  @apply font-medium;
}

/* 全局错误状态 - 最高优先级 */
.global-error {
  @apply fixed inset-0;
  @apply bg-red-50/95 dark:bg-red-900/95 backdrop-blur-sm;
  @apply flex items-center justify-center;
  z-index: var(--z-error, 100) !important; /* 最高优先级 */
  pointer-events: auto; /* 确保可以交互 */
}

.error-content {
  @apply text-center space-y-4 max-w-md px-6;
}

.error-content h2 {
  @apply text-2xl font-bold text-red-600 dark:text-red-400;
}

.error-content p {
  @apply text-red-500 dark:text-red-300;
}

.retry-btn {
  @apply px-6 py-2 bg-red-500 text-white rounded-lg;
  @apply hover:bg-red-600 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}

/* 路由加载状态 */
.route-loading {
  @apply flex flex-col items-center justify-center;
  @apply min-h-[50vh] space-y-4;
}

.route-spinner {
  @apply w-8 h-8;
  @apply border-3 border-gray-300 dark:border-gray-600;
  @apply border-t-blue-500 rounded-full;
  @apply animate-spin;
}

.route-loading p {
  @apply text-gray-500 dark:text-gray-400 text-sm;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 响应式z-index调整 */
@media (max-width: 768px) {
  :root {
    --z-navbar: 45; /* 移动端导航栏提高优先级 */
    --z-theme-toggle: 25; /* 移动端主题切换降低优先级 */
  }

  .loading-spinner {
    @apply w-10 h-10;
  }

  .route-spinner {
    @apply w-6 h-6;
  }

  .error-content {
    @apply px-4;
  }

  .error-content h2 {
    @apply text-xl;
  }
}

/* 性能优化 */
.app-container * {
  @apply will-change-auto;
}

/* 减少重绘 */
.main-content {
  contain: layout style;
}

/* 滚动优化 */
html {
  scroll-behavior: smooth;
}

/* 无障碍优化 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }

  .loading-spinner,
  .route-spinner {
    @apply animate-none;
  }

  html {
    scroll-behavior: auto;
  }
}

/* z-index调试工具 (开发环境) */
@media (min-width: 1920px) {
  .app-container[data-debug="true"] * {
    position: relative;
  }

  .app-container[data-debug="true"] *::after {
    content: attr(style);
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    font-size: 10px;
    padding: 2px;
    pointer-events: none;
  }
}
</style>
