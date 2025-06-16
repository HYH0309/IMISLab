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
const routes = [
  { path: '/', text: '首页', icon: HomeIcon },
  { path: '/article-list', text: '文章', icon: DocumentTextIcon },
  { path: '/oj-list', text: 'OJ题目', icon: CodeBracketIcon },
  { path: '/visualizer', text: '可视化', icon: Squares2X2Icon },
  { path: '/about', text: '关于', icon: InformationCircleIcon }
]

const isExpanded = ref(false)
const navWidth = computed(() => isExpanded.value ? '12.5rem' : '2.5rem')
let collapseTimer: ReturnType<typeof setTimeout>

const navRef = ref<HTMLElement | null>(null)


const expand = () => {
  clearTimeout(collapseTimer)
  isExpanded.value = true
}
const collapse = () => {
  collapseTimer = setTimeout(() => {
    isExpanded.value = false
  }, 300)
}

onUnmounted(() => {
  clearTimeout(collapseTimer)
})
</script>

<template>
  <nav ref="navRef" class="nav-container" :style="{ width: navWidth }" @mouseenter="expand"
    @mouseleave="collapse">
    <RouterLink v-for="(route, index) in routes" :key="route.path" :to="route.path" class="nav-link"
      :class="{ 'active': $route.path === route.path }" :style="`--delay: ${index * 0.05}s`">
      <component :is="route.icon" class="nav-icon" />
      <span class="nav-text" :class="{ 'expanded': isExpanded }">
        {{ route.text }}
      </span>
    </RouterLink>
  </nav>
</template>



<style scoped>
.nav-container {
  @apply fixed right-0 top-1/3 transform -translate-y-1/2 h-auto;
  @apply bg-muted/40 rounded-l-2xl py-6 flex flex-col gap-6 shadow-lg;
  @apply overflow-hidden transition-all duration-300;
  backdrop-filter: blur(8px);
  z-index: var(--z-navbar, 40);
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

.nav-icon {
  @apply w-7 h-7 min-w-7 transition-all duration-300;
  transform-origin: center;

  .nav-link.active & {
    @apply scale-125;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
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

@media (max-width: 768px) {
  .nav-container {
    gap: 1rem;
    padding: 1rem 0.5rem;
  }
}
</style>
