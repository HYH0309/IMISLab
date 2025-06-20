<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
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
const MOBILE_BREAKPOINT = 768

const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT)
const routes = computed(() => isMobile.value ? mobileRoutes : desktopRoutes)

// 移动端导航栏显示状态（始终可见）
const isNavVisible = ref(true)

// 滑动手势相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isSwipeDetected = ref(false)
const swipeThreshold = 50 // 最小滑动距离
const swipeAngleThreshold = 30 // 角度阈值（度）

// 桌面端展开/收缩
const isExpanded = ref(false)
const navWidth = computed(() => isExpanded.value ? '12.5rem' : '2.5rem')
let collapseTimer: ReturnType<typeof setTimeout>

const navRef = ref<HTMLElement | null>(null)

// 监听窗口大小变化
const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT

  // 如果从桌面端切换到移动端，添加触摸事件监听器
  if (!wasMobile && isMobile.value) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
  // 如果从移动端切换到桌面端，移除触摸事件监听器
  else if (wasMobile && !isMobile.value) {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }

  // 确保导航栏始终可见
  isNavVisible.value = true
}

// 滑动手势处理
const handleTouchStart = (e: TouchEvent) => {
  if (!isMobile.value) return

  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwipeDetected.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isMobile.value) return

  touchEndX.value = e.touches[0].clientX
  touchEndY.value = e.touches[0].clientY
}

const handleTouchEnd = () => {
  if (!isMobile.value || isSwipeDetected.value) return

  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // 检查是否满足最小滑动距离
  if (distance < swipeThreshold) return

  // 计算滑动角度
  const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI)

  // 检查是否为水平滑动（角度小于阈值或大于 180-阈值）
  const isHorizontalSwipe = angle < swipeAngleThreshold || angle > (180 - swipeAngleThreshold)

  if (!isHorizontalSwipe) return

  isSwipeDetected.value = true

  // 左滑隐藏，右滑显示
  if (deltaX < -swipeThreshold) {
    // 左滑隐藏导航栏
    isNavVisible.value = false
  } else if (deltaX > swipeThreshold) {
    // 右滑显示导航栏
    isNavVisible.value = true
  }
}

// 桌面端展开/收缩函数
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

// 点击导航链接处理
const handleNavClick = () => {
  // 移动端保持导航栏可见
  if (isMobile.value) {
    isNavVisible.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 添加全局触摸事件监听器（仅移动端）
  if (isMobile.value) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  clearTimeout(collapseTimer)
  window.removeEventListener('resize', handleResize)

  // 移除触摸事件监听器
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <nav ref="navRef" class="nav-container" :style="{ width: isMobile ? '100%' : navWidth }" :class="{
    'mobile-nav': isMobile,
    'desktop-nav': !isMobile,
    'nav-hidden': isMobile && !isNavVisible
  }" @mouseenter="expand" @mouseleave="collapse">
    <RouterLink v-for="(route, index) in routes" :key="route.path" :to="route.path" class="nav-link"
      :class="{ 'active': $route.path === route.path }" :style="`--delay: ${index * 0.05}s`" @click="handleNavClick">
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
    /* 固定到底部 */
    @apply fixed bottom-0 left-0 right-0 top-auto;
    @apply w-full h-auto py-3 px-4;
    @apply flex-row justify-around items-center gap-2;
    @apply rounded-none rounded-t-2xl transform-none;
    backdrop-filter: blur(16px);
    background: rgba(var(--muted-rgb, 148 163 184), 0.85);
    border-top: 1px solid rgba(var(--border-rgb, 203 213 225), 0.4);

    /* 确保在其他元素上方 */
    z-index: var(--z-navbar, 50);

    /* 为安全区域留出空间 */
    padding-bottom: max(env(safe-area-inset-bottom, 0), 0.75rem);
    min-height: calc(3.5rem + env(safe-area-inset-bottom, 0));
  }

  .mobile-nav {
    /* 移动端特定样式 */
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
  }

  /* 移动端导航栏隐藏状态 */
  .nav-hidden {
    transform: translateY(100%) !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* 显示状态的过渡 */
  .mobile-nav:not(.nav-hidden) {
    transform: translateY(0) !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .nav-container {
    @apply py-2.5 px-2 gap-1;
    /* 更紧凑的布局 */
    min-height: calc(3rem + env(safe-area-inset-bottom, 0));
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
    @apply flex-col justify-center px-2 py-2 min-w-0 flex-1;
    @apply rounded-lg transition-all duration-200;
    /* 触摸友好的最小尺寸 */
    min-height: 44px;

    &:hover {
      @apply bg-background/30;
      transform: translateY(-1px);
    }

    &:active {
      @apply bg-background/40 scale-95;
      transform: translateY(0);
    }

    &.active {
      background: linear-gradient(180deg, transparent, var(--primary)/20%);
      @apply shadow-sm;

      &::before {
        @apply bottom-0 left-1/2 transform -translate-x-1/2;
        @apply w-[70%] h-1 rounded-t-full bg-primary;
        box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.4);
      }
    }
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .nav-link {

    /* 移除桌面端 hover 效果 */
    &:hover {
      transform: none;
      @apply bg-transparent;
    }

    /* 优化触摸反馈 */
    &:active {
      @apply bg-background/40 scale-95;
      transition: all 0.1s ease-out;
    }
  }

  /* 移动端触摸优化 */
  @media (max-width: 768px) {
    .nav-link {
      &:hover {
        @apply bg-transparent;
        transform: none;
      }

      &:active {
        @apply bg-primary/20 scale-95;
        transition: all 0.15s ease-out;
      }

      &.active:active {
        @apply bg-primary/30;
      }
    }
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
    background: rgba(15, 23, 42, 0.85);
    border-color: rgba(51, 65, 85, 0.4);
  }

  @media (max-width: 768px) {
    .nav-container {
      background: rgba(15, 23, 42, 0.9);
      border-top-color: rgba(51, 65, 85, 0.5);
    }
  }
}

/* 全局样式：为移动端页面内容提供底部间距 */
@media (max-width: 768px) {
  :global(body) {
    padding-bottom: calc(3.5rem + env(safe-area-inset-bottom, 0)) !important;
  }

  /* 为有背景音乐播放器的页面提供额外空间 */
  :global(body.has-music-player) {
    padding-bottom: calc(7rem + env(safe-area-inset-bottom, 0)) !important;
  }

  /* 确保主要内容区域不被遮挡 */
  :global(.main-content),
  :global(.page-content),
  :global(.container),
  :global(main) {
    padding-bottom: 1rem;
    margin-bottom: 0;
  }

  /* 确保文章列表等特定组件的间距 */
  :global(.articles-section),
  :global(.article-grid) {
    margin-bottom: 1.5rem;
  }

  /* 确保分页组件不被遮挡 */
  :global(.pagination),
  :global(.pagination-container) {
    margin-bottom: 2rem;
  }
}
</style>
