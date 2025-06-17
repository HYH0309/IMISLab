<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { api } from '@/api'
import useAnimatedStats from '@/composables/useAnimatedStats'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'

// 导入类型定义
import type { ColorType } from '@/types/admin'
import type { StatConfig } from '@/types/admin'

// 导入配置数据
import { ADMIN_TABS, COLOR_STYLES, BASE_CLASSES } from '@/config/admin'

// 状态管理
const currentTab = ref(0)
const isLoading = ref(false)
const lastFetchTime = ref<number>(0)
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存
const errorState = ref<string | null>(null)

const statsData = ref<StatConfig[]>([
  { label: '总文章数', value: 0, icon: ADMIN_TABS[0].icon, color: 'blue' },
  { label: '总标签数', value: 0, icon: ADMIN_TABS[1].icon, color: 'green' },
  { label: 'OJ题目数', value: 0, icon: ADMIN_TABS[2].icon, color: 'purple' },
])

// 使用动画统计系统
const initialStats = { articles: 0, tags: 0, ojProblems: 0 }
const { startAnimation } = useAnimatedStats(initialStats)

// 键盘导航增强
useKeyboardNavigation({
  enableShortcuts: true,
  shortcuts: {
    'ctrl+1': () => currentTab.value = 0,
    'ctrl+2': () => currentTab.value = 1,
    'ctrl+3': () => currentTab.value = 2,
    'f5': () => fetchStatsIfNeeded(true),
    'ctrl+r': () => fetchStatsIfNeeded(true),
    'ctrl+e': () => exportStats(),
    'ctrl+m': () => toggleMonitoring()
  }
})

// 性能监控
const performanceMetrics = ref({
  lastFetchDuration: 0,
  averageFetchTime: 0,
  totalFetches: 0,
  failureCount: 0
})

// 实时监控状态
const monitoringEnabled = ref(false)
const monitoringInterval = ref<number | null>(null)

// 数据变化历史
const statsHistory = ref<Array<{
  timestamp: number
  data: Record<string, number>
}>>([])

// 计算性能得分
const performanceScore = computed(() => {
  if (performanceMetrics.value.totalFetches === 0) return 100

  const successRate = (performanceMetrics.value.totalFetches - performanceMetrics.value.failureCount) / performanceMetrics.value.totalFetches
  const speedScore = Math.max(0, 100 - (performanceMetrics.value.averageFetchTime / 100))

  return Math.round((successRate * 0.7 + speedScore * 0.3) * 100)
})

// 计算属性
const currentTabData = computed(() => ADMIN_TABS[currentTab.value])

// 检查是否需要刷新数据
const shouldRefreshData = computed(() => {
  return Date.now() - lastFetchTime.value > CACHE_DURATION
})

// 判断是否有错误状态
const hasError = computed(() => !!errorState.value)

// 格式化最后更新时间
const formatLastUpdateTime = computed(() => {
  if (!lastFetchTime.value) return ''

  const now = Date.now()
  const diff = now - lastFetchTime.value

  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return new Date(lastFetchTime.value).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
})

// 简化的样式工具函数
const getStyle = (color: ColorType, type: 'bg' | 'text' | 'border' | 'active' | 'indicator' | 'ring') => {
  return COLOR_STYLES[color][type]
}

// 获取统计数据
const fetchStats = async (retryCount = 0) => {
  const maxRetries = 3
  const startTime = performance.now()
  isLoading.value = true

  try {
    // 更新性能指标
    performanceMetrics.value.totalFetches++

    // 使用 Promise.allSettled 并行获取数据，避免单个失败影响整体
    const [articlesResult, tagsResult, ojProblemsResult] = await Promise.allSettled([
      api.getArticles(),
      api.getTags(),
      api.getOJProblems()
    ])

    // 处理文章数据
    if (articlesResult.status === 'fulfilled' && articlesResult.value.status && articlesResult.value.data) {
      const newValue = articlesResult.value.data.length
      statsData.value[0].value = newValue
    } else {
      console.warn('获取文章数据失败:', articlesResult.status === 'rejected' ? articlesResult.reason : '无数据返回')
    }

    // 处理标签数据
    if (tagsResult.status === 'fulfilled' && tagsResult.value.status && tagsResult.value.data) {
      const newValue = tagsResult.value.data.length
      statsData.value[1].value = newValue
    } else {
      console.warn('获取标签数据失败:', tagsResult.status === 'rejected' ? tagsResult.reason : '无数据返回')
    }

    // 处理OJ题目数据
    if (ojProblemsResult.status === 'fulfilled' && ojProblemsResult.value.status && ojProblemsResult.value.data) {
      const newValue = ojProblemsResult.value.data.length
      statsData.value[2].value = newValue
    } else {
      console.warn('获取OJ题目数据失败:', ojProblemsResult.status === 'rejected' ? ojProblemsResult.reason : '无数据返回')
    }

    // 启动动画更新
    startAnimation({
      articles: statsData.value[0].value,
      tags: statsData.value[1].value,
      ojProblems: statsData.value[2].value
    })

    // 记录统计历史
    recordStatsHistory()

    // 更新性能指标
    const endTime = performance.now()
    performanceMetrics.value.lastFetchDuration = endTime - startTime
    performanceMetrics.value.averageFetchTime =
      (performanceMetrics.value.averageFetchTime * (performanceMetrics.value.totalFetches - 1) +
       performanceMetrics.value.lastFetchDuration) / performanceMetrics.value.totalFetches
  } catch (error) {
    console.error('获取统计数据失败:', error)
    performanceMetrics.value.failureCount++

    // 错误重试机制
    if (retryCount < maxRetries) {
      console.log(`重试获取统计数据 (${retryCount + 1}/${maxRetries})`)
      setTimeout(() => fetchStats(retryCount + 1), 1000 * (retryCount + 1))
      return
    }

    // 最大重试次数后的错误处理
    errorState.value = '数据加载失败，请稍后重试。'
  } finally {
    isLoading.value = false
  }
}

// 智能获取统计数据
const fetchStatsIfNeeded = async (force = false) => {
  if (!force && !shouldRefreshData.value) {
    return // 缓存仍有效，无需刷新
  }

  await fetchStats()
}

// 键盘快捷键处理
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + 数字键切换标签页
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
    const key = event.key
    if (key >= '1' && key <= '3') {
      event.preventDefault()
      currentTab.value = parseInt(key) - 1
    }
  }

  // F5 或 Ctrl/Cmd + R 刷新数据
  if (event.key === 'F5' || ((event.ctrlKey || event.metaKey) && event.key === 'r')) {
    if (!event.shiftKey) { // 避免硬刷新页面
      event.preventDefault()
      fetchStatsIfNeeded(true)
    }
  }
}

// 根据统计卡片类型切换到相应的标签页
const handleStatClick = async (statLabel: string) => {
  if (statLabel === '总文章数') {
    currentTab.value = 0 // 切换到文章管理
  } else if (statLabel === '总标签数') {
    currentTab.value = 1 // 切换到标签管理
  } else if (statLabel === 'OJ题目数') {
    currentTab.value = 2 // 切换到OJ管理
  }

  // 智能刷新：只在必要时重新获取数据
  await fetchStatsIfNeeded()
}

// 导出统计数据
const exportStats = () => {
  const data = {
    exportTime: new Date().toISOString(),
    lastUpdate: new Date(lastFetchTime.value).toISOString(),
    statistics: statsData.value.map(stat => ({
      label: stat.label,
      value: stat.value,
      color: stat.color
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `admin-stats-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 切换实时监控
const toggleMonitoring = () => {
  monitoringEnabled.value = !monitoringEnabled.value

  if (monitoringEnabled.value) {
    // 开启自动刷新（每30秒）
    monitoringInterval.value = window.setInterval(() => {
      if (shouldRefreshData.value) {
        fetchStatsIfNeeded(false)
      }
    }, 30000)
  } else {
    // 关闭自动刷新
    if (monitoringInterval.value) {
      clearInterval(monitoringInterval.value)
      monitoringInterval.value = null
    }
  }
}

// 记录数据历史
const recordStatsHistory = () => {
  statsHistory.value.push({
    timestamp: Date.now(),
    data: {
      articles: statsData.value[0].value,
      tags: statsData.value[1].value,
      ojProblems: statsData.value[2].value
    }
  })

  // 只保留最近100条记录
  if (statsHistory.value.length > 100) {
    statsHistory.value = statsHistory.value.slice(-100)
  }
}

onMounted(() => {
  fetchStatsIfNeeded(true) // 初始加载时强制刷新
  document.addEventListener('keydown', handleKeyDown)
  toggleMonitoring()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)

  // 清理监控定时器
  if (monitoringInterval.value) {
    clearInterval(monitoringInterval.value)
    monitoringInterval.value = null
  }

  // 清理历史数据
  statsHistory.value = []

  // 关闭监控状态
  monitoringEnabled.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-0']" role="banner">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="['text-3xl font-bold', BASE_CLASSES.heading]" id="page-title">管理后台</h1>
            <div class="flex items-center gap-2 mt-1">
              <p :class="['text-sm', BASE_CLASSES.subtext]" aria-describedby="page-title">管理网站内容和数据</p>
              <span v-if="lastFetchTime" :class="['text-xs', BASE_CLASSES.subtext]" role="status" aria-live="polite">
                · 最后更新: {{ formatLastUpdateTime }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3" role="toolbar" aria-label="管理操作工具栏">
            <!-- 手动刷新按钮 -->
            <button @click="fetchStatsIfNeeded(true)"
                    :disabled="isLoading"
                    :class="[
                      'p-2 rounded-lg transition-all duration-200',
                      'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      isLoading ? 'animate-spin' : ''
                    ]"
                    :aria-label="isLoading ? '正在刷新统计数据' : '刷新统计数据'"
                    :aria-describedby="isLoading ? 'refresh-status' : undefined"
                    title="刷新统计数据">
              <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span v-if="isLoading" id="refresh-status" class="sr-only">正在刷新中，请稍候</span>
            </button>
            <!-- 导出数据按钮 -->
            <button @click="exportStats"
                    :class="[
                      'p-2 rounded-lg transition-all duration-200',
                      'bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600',
                      'text-blue-600 dark:text-blue-300',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    ]"
                    aria-label="导出统计数据为JSON文件"
                    title="导出统计数据">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <!-- 自动刷新状态指示器 -->
            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
              <div :class="['w-2 h-2 rounded-full', shouldRefreshData ? 'bg-orange-400' : 'bg-green-400']"
                   :aria-label="shouldRefreshData ? '数据需要更新' : '数据为最新状态'"></div>
              <span>{{ shouldRefreshData ? '需要更新' : '数据最新' }}</span>
            </div>
            <!-- 快捷键提示 -->
            <div class="hidden lg:flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500" role="note" aria-label="可用快捷键">
              <span>快捷键:</span>
              <div class="flex gap-1 items-center">
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs" aria-label="按键组合 Control加1到3">Ctrl+1-3</kbd>
                <span class="text-xs">切换</span>
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs" aria-label="按键F5或Control加R">F5</kbd>
                <span class="text-xs">刷新</span>
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs" aria-label="按键组合 Control加E">Ctrl+E</kbd>
                <span class="text-xs">导出</span>
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs" aria-label="按键组合 Control加M">Ctrl+M</kbd>
                <span class="text-xs">监控</span>
              </div>
            </div>
            <!-- 实时监控切换 -->
            <button @click="toggleMonitoring"
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all duration-200',
                      monitoringEnabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                      'hover:scale-105'
                    ]"
                    title="切换实时监控">
              <div class="flex items-center gap-1">
                <div :class="['w-1.5 h-1.5 rounded-full', monitoringEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
                <span>{{ monitoringEnabled ? '监控中' : '已停止' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 错误状态 -->
    <div v-if="hasError && !isLoading"
         class="max-w-7xl mx-auto px-6 py-4 mb-6"
         role="alert"
         aria-live="assertive">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-title">
              数据加载失败
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300" aria-describedby="error-title">
              <p>{{ errorState }}</p>
            </div>
            <div class="mt-3">
              <button @click="fetchStatsIfNeeded(true)"
                      class="bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 text-xs rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="重新加载统计数据">
                重新加载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能监控面板 -->
    <div v-if="monitoringEnabled" class="max-w-7xl mx-auto px-6 py-4">
      <section :class="[BASE_CLASSES.card, 'p-4']" aria-labelledby="performance-title">
        <div class="flex items-center justify-between mb-3">
          <h3 :class="['text-sm font-medium', BASE_CLASSES.heading]" id="performance-title">性能监控面板</h3>
          <div class="flex items-center gap-2">
            <div :class="['px-2 py-1 rounded text-xs',
                         performanceScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' :
                         performanceScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' :
                         'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200']"
                 role="status"
                 :aria-label="`性能评分 ${performanceScore} 分，满分100分`">
              性能评分: {{ performanceScore }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" role="group" aria-labelledby="performance-title">
          <div class="text-center">
            <div :class="['text-lg font-semibold', BASE_CLASSES.heading]" aria-label="`最近请求耗时 ${performanceMetrics.lastFetchDuration.toFixed(0)} 毫秒`">
              {{ performanceMetrics.lastFetchDuration.toFixed(0) }}ms
            </div>
            <div :class="[BASE_CLASSES.subtext]">最近请求</div>
          </div>
          <div class="text-center">
            <div :class="['text-lg font-semibold', BASE_CLASSES.heading]" aria-label="`平均请求耗时 ${performanceMetrics.averageFetchTime.toFixed(0)} 毫秒`">
              {{ performanceMetrics.averageFetchTime.toFixed(0) }}ms
            </div>
            <div :class="[BASE_CLASSES.subtext]">平均耗时</div>
          </div>
          <div class="text-center">
            <div :class="['text-lg font-semibold', BASE_CLASSES.heading]" aria-label="`总请求数 ${performanceMetrics.totalFetches} 次`">
              {{ performanceMetrics.totalFetches }}
            </div>
            <div :class="[BASE_CLASSES.subtext]">总请求数</div>
          </div>
          <div class="text-center">
            <div :class="['text-lg font-semibold', performanceMetrics.failureCount > 0 ? 'text-red-500' : BASE_CLASSES.heading]"
                 aria-label="`失败次数 ${performanceMetrics.failureCount} 次`">
              {{ performanceMetrics.failureCount }}
            </div>
            <div :class="[BASE_CLASSES.subtext]">失败次数</div>
          </div>
        </div>
      </section>
    </div>

    <!-- 统计概览 -->
    <section class="max-w-7xl mx-auto px-6 py-6" aria-labelledby="stats-title">
      <h2 id="stats-title" class="sr-only">网站统计概览</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="group" aria-labelledby="stats-title">
        <motion.div v-for="(stat, index) in statsData" :key="stat.label" :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.1, duration: 0.5 }"
          @click="handleStatClick(stat.label)"
          @keydown.enter="handleStatClick(stat.label)"
          @keydown.space.prevent="handleStatClick(stat.label)"
          :class="[
            BASE_CLASSES.card,
            'hover:shadow-md p-6 cursor-pointer',
            BASE_CLASSES.button,
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            currentTab === index ? getStyle(stat.color, 'border') + ' ring-2 ring-offset-2 ' + getStyle(stat.color, 'ring') : '',
            getStyle(stat.color, 'border')
          ]"
          :tabindex="0"
          role="button"
          :aria-label="`${stat.label}: ${isLoading ? '加载中' : hasError ? '加载失败' : stat.value + '个'}。点击查看详情`"
          :aria-pressed="currentTab === index">
          <div class="flex items-center">
            <div :class="['p-3 rounded-lg', getStyle(stat.color, 'bg')]" aria-hidden="true">
              <component :is="stat.icon" :class="['w-6 h-6', getStyle(stat.color, 'text')]" />
            </div>
            <div class="ml-4">
              <p :class="['text-sm font-medium', BASE_CLASSES.subtext]">{{ stat.label }}</p>
              <div :class="['text-2xl font-semibold', BASE_CLASSES.heading]">
                <span v-if="isLoading"
                  class="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                  aria-label="数据加载中"></span>
                <span v-else-if="hasError" class="text-red-500 dark:text-red-400" aria-label="数据加载失败">--</span>
                <motion.span v-else
                             :key="stat.value"
                             :initial="{ opacity: 0, scale: 0.8 }"
                             :animate="{ opacity: 1, scale: 1 }"
                             :transition="{ duration: 0.3 }"
                             :aria-label="`共${stat.value}个`">
                  {{ stat.value }}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-6 pb-12" role="main">
      <!-- 当前页面信息 -->
      <section :class="[BASE_CLASSES.card, 'mb-6 p-4']" aria-labelledby="current-tab-title">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', getStyle(currentTabData.color, 'bg')]" aria-hidden="true">
            <component :is="currentTabData.activeIcon" :class="['w-5 h-5', getStyle(currentTabData.color, 'text')]" />
          </div>
          <div>
            <h2 :class="['text-lg font-semibold', BASE_CLASSES.heading]" id="current-tab-title">{{ currentTabData.name }}</h2>
            <p :class="['text-sm', BASE_CLASSES.subtext]" aria-describedby="current-tab-title">{{ currentTabData.description }}</p>
          </div>
        </div>
      </section>

      <!-- 内容区域 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <AnimatePresence mode="wait">
          <motion.div :key="currentTab" :initial="{ opacity: 0, x: 20 }" :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -20 }" :transition="{ duration: 0.3, ease: 'easeInOut' }" class="p-6">
            <component :is="currentTabData.component" />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
</template>
