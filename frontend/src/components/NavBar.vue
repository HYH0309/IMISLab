<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  HomeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { RouterLink, useRoute } from 'vue-router'

const $route = useRoute()

// 桌面端完整路由
const desktopRoutes = [
  { path: '/', text: '首页', icon: HomeIcon },
  { path: '/article-list', text: '文章', icon: DocumentTextIcon },
  { path: '/oj-list', text: 'OJ题目', icon: CodeBracketIcon },
  { path: '/visualizer', text: '可视化', icon: Squares2X2Icon },
  { path: '/about', text: '关于', icon: InformationCircleIcon }
]

// 移动端路由（去除可视化）
const mobileRoutes = [
  { path: '/', text: '首页', icon: HomeIcon },
  { path: '/article-list', text: '文章', icon: DocumentTextIcon },
  { path: '/oj-list', text: 'OJ题目', icon: CodeBracketIcon },
  { path: '/about', text: '关于', icon: InformationCircleIcon }
]

// 响应式路由选择
const isMobile = ref(window.innerWidth <= 768)
const routes = computed(() => isMobile.value ? mobileRoutes : desktopRoutes)

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

window.addEventListener('resize', handleResize)

const isExpanded = ref(false)
const navWidth = computed(() => isExpanded.value ? '12.5rem' : '2.5rem')
let collapseTimer: ReturnType<typeof setTimeout>

const navRef = ref<HTMLElement | null>(null)

const expand = () => {
  // 移动端不展开
  if (isMobile.value) return
  clearTimeout(collapseTimer)
  isExpanded.value = true
}

const collapse = () => {
  // 移动端不收起
  if (isMobile.value) return
  collapseTimer = setTimeout(() => {
    isExpanded.value = false
  }, 300)
}

onUnmounted(() => {
  clearTimeout(collapseTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav ref="navRef" class="nav-container" :style="{ width: isMobile ? '100%' : navWidth }"
    :class="{ 'mobile-nav': isMobile, 'desktop-nav': !isMobile }" @mouseenter="expand" @mouseleave="collapse">
    <RouterLink v-for="(route, index) in routes" :key="route.path" :to="route.path" class="nav-link"
      :class="{ 'active': $route.path === route.path }" :style="`--delay: ${index * 0.05}s`">
      <component :is="route.icon" class="nav-icon" />
      <span class="nav-text" :class="{ 'expanded': isExpanded || isMobile }">
        {{ route.text }}
      </span>
    </RouterLink>
  </nav>
</template>



<style scoped>
.nav-container {
  @apply fixed transform transition-all duration-300;
  @apply bg-muted/40 rounded-l-2xl py-6 flex flex-col gap-6 shadow-lg;
  @apply overflow-hidden;
  backdrop-filter: blur(8px);
  z-index: var(--z-navbar, 40);

  /* 桌面端默认位置 */
  @apply right-0 top-1/3 -translate-y-1/2 h-auto;
}

.desktop-nav {
  /* 桌面端特定样式 */
  @apply right-0 top-1/3 -translate-y-1/2 h-auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-container {
    /* 移动端改为底部导航，避免与音乐播放器冲突 */
    @apply fixed bottom-0 left-0 right-0 top-auto;
    @apply w-full h-auto max-h-20 py-2 px-4;
    @apply flex-row justify-around items-center gap-2;
    @apply rounded-none rounded-t-2xl transform-none;
    backdrop-filter: blur(12px);
    background: rgba(var(--muted-rgb, 148 163 184), 0.8);
    border-top: 1px solid rgba(var(--border-rgb, 203 213 225), 0.3);

    /* 确保在音乐播放器上方 */
    z-index: var(--z-navbar, 45);

    /* 为音乐播放器留出空间 */
    margin-bottom: env(safe-area-inset-bottom, 0);
    padding-bottom: calc(env(safe-area-inset-bottom, 0) + 0.5rem);
  }

  .mobile-nav {
    /* 移动端特定样式 */
    bottom: 0;
    left: 0;
    right: 0;
    width: 100% !important;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .nav-container {
    @apply py-1.5 px-2 gap-1;
    /* 在小屏幕上为音乐播放器预留更多空间 */
    margin-bottom: calc(env(safe-area-inset-bottom, 0) + 60px);
  }
}

.nav-link {
  @apply flex items-center no-underline py-2 px-5 whitespace-nowrap;
  @apply text-foreground relative transition-all duration-300 will-change-transform;

  &:hover {
    @apply bg-background/20 shadow-md;
    transform: translateX(-2px);

    .nav-icon {
      @apply scale-125;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }

    .nav-text {
      @apply text-primary font-medium;
      transform: scale(1.05);
    }
  }

  &.active {
    background: linear-gradient(90deg, transparent, var(--primary)/10%);

    &::before {
      content: '';
      @apply absolute left-0 h-[70%] w-1 bg-primary rounded-r-full;
    }
  }
}

/* 移动端导航链接适配 */
@media (max-width: 768px) {
  .nav-link {
    @apply flex-col justify-center px-2 py-1 min-w-0 flex-1;
    @apply rounded-lg;

    &:hover {
      @apply bg-background/30;
      transform: translateY(-2px);
    }

    &.active {
      background: linear-gradient(180deg, transparent, var(--primary)/15%);

      &::before {
        @apply bottom-0 left-1/2 transform -translate-x-1/2;
        @apply w-[60%] h-0.5 rounded-t-full;
      }
    }
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .nav-link:hover {
    transform: none;
    @apply bg-background/25;
  }

  .nav-link:active {
    @apply bg-background/40 scale-95;
    transition: all 0.1s ease-out;
  }
}

.nav-icon {
  @apply w-7 h-7 min-w-7 transition-all duration-300;
  transform-origin: center;

  .nav-link.active & {
    @apply scale-125;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
  }
}

/* 移动端图标调整 */
@media (max-width: 768px) {
  .nav-icon {
    @apply w-6 h-6 min-w-6 mb-1;
  }

  .nav-link.active .nav-icon {
    @apply scale-110;
  }
}

@media (max-width: 480px) {
  .nav-icon {
    @apply w-5 h-5 min-w-5 mb-0.5;
  }
}

.nav-text {
  @apply overflow-hidden text-ellipsis ml-4 text-lg;

  opacity: 0;
  transform: translateY(10px) scale(0.9);

  &.expanded {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: all 0.6s cubic-bezier(0.34, 2.2, 0.64, 1) calc(var(--delay) + 0.1s);
  }
}

/* 移动端文字调整 */
@media (max-width: 768px) {
  .nav-text {
    @apply ml-0 text-xs leading-tight;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: all 0.3s ease;

    &.expanded {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

@media (max-width: 480px) {
  .nav-text {
    @apply text-[10px] leading-none;
  }
}

/* 横屏模式适配 */
@media (max-width: 896px) and (orientation: landscape) and (max-height: 500px) {
  .nav-container {
    @apply max-h-16 py-1;
  }

  .nav-icon {
    @apply w-5 h-5 min-w-5;
  }

  .nav-text {
    @apply text-[10px];
  }
}

/* 桌面端小屏幕优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav-container {
    gap: 1rem;
    padding: 1rem 0.75rem;
  }

  .nav-icon {
    @apply w-6 h-6 min-w-6;
  }

  .nav-text {
    @apply text-base;
  }
}

/* 高分辨率屏幕优化 */
@media (min-width: 1440px) {
  .nav-container {
    @apply py-8 gap-8;
  }

  .nav-icon {
    @apply w-8 h-8 min-w-8;
  }

  .nav-text {
    @apply text-xl;
  }
}

/* 减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {

  .nav-container,
  .nav-link,
  .nav-icon,
  .nav-text {
    transition: none;
  }

  .nav-text.expanded {
    transition: opacity 0.2s ease;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .nav-container {
    background: rgba(15, 23, 42, 0.8);
    border-color: rgba(51, 65, 85, 0.3);
  }

  @media (max-width: 768px) {
    .nav-container {
      background: rgba(15, 23, 42, 0.9);
      border-top-color: rgba(51, 65, 85, 0.4);
    }
  }
}
</style>
