<script setup lang="ts">
import { computed } from 'vue'

type StatusKey =
  | 'Accepted' | 'ACCEPTED'
  | 'Wrong Answer' | 'WRONG_ANSWER'
  | 'Time Limit Exceeded' | 'TIME_LIMIT_EXCEEDED'
  | 'Compile Error' | 'COMPILATION_ERROR'
  | 'Runtime Error' | 'RUNTIME_ERROR'
  | 'Pending' | 'PENDING' | 'IN_QUEUE'
  | 'TIMEOUT'
  | 'STOPPED'

const props = defineProps<{
  status: boolean
  msg: StatusKey | string
}>()

const statusMap: Record<StatusKey, {
  text: string;
  color: string;
  iconPath: string;
  description?: string;
  success?: boolean;
}> = {
  "Accepted": {
    text: '答案正确',
    color: 'success',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '恭喜！您的解决方案通过了所有测试用例',
    success: true
  },
  "ACCEPTED": {
    text: '答案正确',
    color: 'success',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '恭喜！您的解决方案通过了所有测试用例',
    success: true
  },
  'Wrong Answer': {
    text: '答案错误',
    color: 'error',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '输出结果与期望答案不匹配，请检查算法逻辑'
  },
  'WRONG_ANSWER': {
    text: '答案错误',
    color: 'error',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '输出结果与期望答案不匹配，请检查算法逻辑'
  },
  'Time Limit Exceeded': {
    text: '超时限制',
    color: 'warning',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '程序执行时间超过限制，尝试优化算法复杂度'
  },
  'TIME_LIMIT_EXCEEDED': {
    text: '超时限制',
    color: 'warning',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '程序执行时间超过限制，尝试优化算法复杂度'
  },
  'Compile Error': {
    text: '编译错误',
    color: 'error',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z',
    description: '代码编译失败，请检查语法错误'
  },
  'COMPILATION_ERROR': {
    text: '编译错误',
    color: 'error',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z',
    description: '代码编译失败，请检查语法错误'
  },
  'Runtime Error': {
    text: '运行错误',
    color: 'error',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z',
    description: '程序运行时发生错误，请检查边界条件和空指针'
  },
  'RUNTIME_ERROR': {
    text: '运行错误',
    color: 'error',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z',
    description: '程序运行时发生错误，请检查边界条件和空指针'
  },
  'Pending': {
    text: '正在判题',
    color: 'pending',
    iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: '代码已提交，正在后台执行测试用例'
  },
  'PENDING': {
    text: '正在判题',
    color: 'pending',
    iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: '代码已提交，正在后台执行测试用例'
  },
  'IN_QUEUE': {
    text: '等待中',
    color: 'pending',
    iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: '代码已加入判题队列，等待执行'
  },
  TIMEOUT: {
    text: '判题超时',
    color: 'warning',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '判题系统响应超时，请稍后重试'
  },
  STOPPED: {
    text: '判题停止',
    color: 'warning',
    iconPath: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '判题过程被中断'
  }
}

// 计算当前状态信息
const statusInfo = computed(() => {
  const msgKey = props.msg as StatusKey

  // 首先检查 msg 是否是已知的状态键，如果是则直接使用
  if (statusMap[msgKey]) {
    return statusMap[msgKey]
  }

  // 如果是未知状态，根据status判断
  if (!props.status) {
    // 如果status为false且是未知状态，可能是错误状态
    return {
      text: props.msg,
      color: 'error',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      description: '判题失败'
    }
  }

  // status为true但未知状态
  return {
    text: props.msg,
    color: 'success',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: '判题成功'
  }
})

// 判断是否正在判题中
const isJudging = computed(() => {
  const judgingStatuses = ['PENDING', 'IN_QUEUE', 'Pending']
  return judgingStatuses.includes(props.msg as string)
})

// 计算动画类
const animationClass = computed(() => {
  return !props.status ? 'animate-spin' : ''
})

// 计算面板样式类
const resultPanelClass = computed(() => {
  const info = statusInfo.value
  if (info.success) return 'success'
  if (info.color === 'error') return 'error'
  if (info.color === 'pending') return 'pending'
  return 'warning'
})
</script>

<template>
  <div class="result-panel" :class="resultPanelClass">
    <div class="result-header">
      <!-- 状态图标 -->
      <div class="status-icon" :class="[statusInfo.color, animationClass]">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="statusInfo.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            :d="statusInfo.iconPath"></path>
        </svg>
      </div>

      <!-- 状态信息 -->
      <div class="status-info">
        <h3 class="status-title">{{ statusInfo.text }}</h3>
        <p v-if="statusInfo.description" class="status-description">{{ statusInfo.description }}</p>
      </div>

      <!-- 时间戳 -->
      <div class="result-time">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ new Date().toLocaleTimeString() }}
        </span>
      </div>
    </div>

    <!-- 判题进行中的动画提示 -->
    <div v-if="isJudging" class="progress-indicator">
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <p class="progress-text">
        <span class="animate-pulse">正在执行判题</span>
        <span class="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>

    <!-- 成功结果的额外信息 -->
    <div v-if="props.status && statusInfo.success" class="success-details">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="detail-item">
          <div class="detail-value text-emerald-600 dark:text-emerald-400">100%</div>
          <div class="detail-label">通过率</div>
        </div>
        <div class="detail-item">
          <div class="detail-value text-cyan-600 dark:text-cyan-400">&lt; 1s</div>
          <div class="detail-label">执行时间</div>
        </div>
        <div class="detail-item">
          <div class="detail-value text-blue-600 dark:text-blue-400">优秀</div>
          <div class="detail-label">代码质量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-panel {
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8;
  @apply transition-all duration-500 transform;
  animation: slideInUp 0.5s ease-out;
}

.result-panel.success {
  @apply border-emerald-200 dark:border-emerald-700;
  @apply bg-emerald-50/80 dark:bg-emerald-900/20;
}

.result-panel.error {
  @apply border-red-200 dark:border-red-700;
  @apply bg-red-50/80 dark:bg-red-900/20;
}

.result-panel.pending {
  @apply border-cyan-200 dark:border-cyan-700;
  @apply bg-cyan-50/80 dark:bg-cyan-900/20;
}

.result-header {
  @apply flex items-start gap-4;
}

.status-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-white;
  @apply shadow-lg;
}

.status-icon.success {
  @apply bg-gradient-to-r from-emerald-500 to-green-500;
}

.status-icon.error {
  @apply bg-gradient-to-r from-red-500 to-rose-500;
}

.status-icon.pending {
  @apply bg-gradient-to-r from-cyan-500 to-blue-500;
}

.status-icon.warning {
  @apply bg-gradient-to-r from-amber-500 to-orange-500;
}

.status-info {
  @apply flex-1 min-w-0;
}

.status-title {
  @apply text-xl font-bold text-gray-900 dark:text-white mb-1;
}

.status-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.result-time {
  @apply text-right;
}

.progress-indicator {
  @apply mt-6 space-y-3;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-cyan-500 to-blue-500;
  @apply rounded-full;
  animation: progressLoad 2s ease-in-out infinite;
}

.progress-text {
  @apply text-center text-sm text-gray-600 dark:text-gray-400;
}

.dots span {
  animation: dotBlink 1.5s infinite;
}

.dots span:nth-child(1) {
  animation-delay: 0s;
}

.dots span:nth-child(2) {
  animation-delay: 0.5s;
}

.dots span:nth-child(3) {
  animation-delay: 1s;
}

.success-details {
  @apply mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-700;
}

.detail-item {
  @apply space-y-1;
}

.detail-value {
  @apply text-lg font-bold;
}

.detail-label {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progressLoad {
  0% {
    width: 0%;
    margin-left: 0%;
  }

  50% {
    width: 75%;
    margin-left: 12.5%;
  }

  100% {
    width: 0%;
    margin-left: 100%;
  }
}

@keyframes dotBlink {

  0%,
  20% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  80%,
  100% {
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .result-header {
    @apply flex-col gap-3;
  }

  .success-details .grid {
    @apply grid-cols-1 gap-2;
  }

  .detail-item {
    @apply flex justify-between items-center;
  }

  .detail-value {
    @apply text-base;
  }
}
</style>
