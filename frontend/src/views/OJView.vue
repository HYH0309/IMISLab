<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Codemirror } from 'vue-codemirror'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import Modal from '@/components/composable/BaseModal.vue'
import OJResultPanel from '@/components/oj/OJResultPanel.vue'
import OJLanguageSelector from '@/components/oj/OJLanguageSelector.vue'
import { api } from '@/api'
import type { JudgeResult, OJProblem } from '@/types/api'


// 语言配置
const LANGUAGES = [
  {
    value: 'java',
    label: 'Java',
    icon: '☕',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    extension: java()
  },
  {
    value: 'cpp',
    label: 'C++',
    icon: '⚡',
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
    extension: cpp()
  },
  {
    value: 'python',
    label: 'Python',
    icon: '🐍',
    template: `# Python Solution
def main():
    print("Hello World")

if __name__ == "__main__":
    main()`,
    extension: python()
  }
]

const LANGUAGE_ID_MAP: Record<string, number> = {
  'java': 62,
  'cpp': 54,
  'python': 71
}

// 响应式状态
const route = useRoute()
const problemId = computed(() => Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id))

const currentLanguage = ref(LANGUAGES[0].value)
const code = ref(LANGUAGES[0].template)
const isModalOpen = ref(false)
const isLoading = ref(true)
const error = ref<Error | null>(null)
const problemData = ref<OJProblem | null>(null)

// 判题相关状态
const judgeStatus = ref<JudgeResult | null>(null)
const tokens = ref<string[]>([])
const pollingInterval = ref<number>()
const submitStatus = ref<'idle' | 'loading' | 'polling'>('idle')

// 编辑器设置
const editorSettings = ref({
  fontSize: 14,
  tabSize: 4,
  theme: 'default'
})

// 语言切换时更新代码模板
watch(currentLanguage, (newLang) => {
  const language = LANGUAGES.find(lang => lang.value === newLang)
  if (language && !code.value.trim()) {
    code.value = language.template
  }
})

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    submitCode()
  }
}

// 获取题目数据
const fetchProblem = async () => {
  try {
    isLoading.value = true
    const res = await api.getOJProblemById(problemId.value)
    if (res.status && res.data) {
      problemData.value = res.data
    }
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading.value = false
  }
}

// 提交代码
const submitCode = async () => {
  if (submitStatus.value !== 'idle') return // 防止重复提交

  submitStatus.value = 'loading'
  judgeStatus.value = null

  try {
    const languageId = LANGUAGE_ID_MAP[currentLanguage.value]
    const res = await api.submitCode({
      tid: problemId.value,
      sourceCode: code.value,
      languageId: languageId
    })

    if (res.status && res.data?.token) {
      tokens.value = [res.data.token] // 后端返回单个token，转换为数组格式
      submitStatus.value = 'polling' // 设置为轮询状态
      isModalOpen.value = false // 提交成功后关闭弹窗
      startPolling()
    } else {
      submitStatus.value = 'idle' // 提交失败重置状态
    }
  } catch (err) {
    console.error('提交失败:', err)
    submitStatus.value = 'idle' // 提交失败重置状态
  }
}

// 轮询判题结果
const startPolling = () => {
  const startTime = Date.now()
  const TIMEOUT = 300000 // 5分钟

  pollingInterval.value = window.setInterval(async () => {
    // 超时检查
    if (Date.now() - startTime > TIMEOUT) {
      stopPolling()
      judgeStatus.value = {
        id: 0,
        problemId: problemId.value,
        code: '',
        language: '',
        status: 'TIMEOUT',
        isCompleted: true,
        executeTime: 0,
        memoryUsage: 0,
        submitTime: new Date().toISOString(),
        judgeToken: tokens.value[0] || ''
      }
      submitStatus.value = 'idle' // 超时后重置状态
      return
    }

    if (!tokens.value.length) return

    try {
      const res = await api.getJudgeResult(tokens.value[0])
      console.log('轮询获取判题结果:', res)
      if (res.status && res.data) {
        judgeStatus.value = res.data
        console.log('判题状态:', res.data.status, '是否完成:', res.data.isCompleted)

        // 使用后端返回的isCompleted字段判断是否完成
        if (res.data.isCompleted) {
          console.log('判题完成，停止轮询')
          stopPolling()
          submitStatus.value = 'idle' // 判题完成后重置状态
        }
      }
    } catch (err) {
      console.error('获取判题结果失败:', err)
    }
  }, 3000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = undefined
  }
}

// 计算属性
const currentLanguageInfo = computed(() => {
  return LANGUAGES.find(lang => lang.value === currentLanguage.value) || LANGUAGES[0]
})

const codemirrorExtensions = computed(() => {
  const extensions: any[] = [currentLanguageInfo.value.extension]

  const isDark = false // 可以从主题状态获取
  if (isDark) {
    extensions.push(oneDark)
  }

  return extensions
})

const isSubmitting = computed(() => submitStatus.value === 'loading')
const isPolling = computed(() => submitStatus.value === 'polling')
const canSubmit = computed(() => {
  return !isSubmitting.value && !isPolling.value && code.value.trim().length > 0
})

// 生命周期
onMounted(fetchProblem)
watch(problemId, fetchProblem)
onUnmounted(stopPolling)
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-900 dark:via-cyan-900 dark:to-blue-900">
    <!-- 页面头部装饰 -->
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 dark:from-emerald-400/5 dark:to-cyan-400/5">
      </div>
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-4 -left-4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto p-6 max-w-6xl relative mobile-optimized pb-20 sm:pb-6">
      <!-- 智能标题栏 -->
      <div class="smart-header">
        <div class="header-left">
          <div class="flex items-center space-x-4 lg:space-x-6">
            <!-- 题目信息 -->
            <div class="problem-info flex-1 min-w-0">
              <h1
                class="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1 truncate">
                {{ problemData?.title || '加载中...' }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                <template v-if="isLoading">题目加载中...</template>
                <template v-else>题目ID: {{ problemId }} | 在线编程挑战</template>
              </p>
            </div>

            <!-- 分隔线 - 在小屏幕隐藏 -->
            <div
              class="hidden lg:block w-px h-12 bg-gradient-to-b from-emerald-300 to-cyan-300 dark:from-emerald-600 dark:to-cyan-600">
            </div>

            <!-- 语言信息 -->
            <div class="language-info hidden sm:block">
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-1.5 h-4 sm:w-2 sm:h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
                <span class="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {{ currentLanguageInfo.label }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-3.5 sm:ml-4">
                当前编程语言
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="header-actions">
          <button @click="isModalOpen = true" class="action-btn primary touch-btn">
            <Icon icon="tabler:code" class="w-4 h-4" />
            <span class="hidden sm:inline">编写代码</span>
            <span class="sm:hidden">代码</span>
          </button>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="problem-content">
        <div v-if="isLoading" class="loading-state">
          <div class="flex items-center justify-center py-8 sm:py-12">
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin">
            </div>
            <span class="ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">正在加载题目...</span>
          </div>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="text-center py-8 sm:py-12">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <Icon icon="tabler:alert-triangle" class="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">加载失败</h3>
            <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 px-4">{{ error.message }}</p>
            <button @click="fetchProblem" class="action-btn primary touch-btn">
              <Icon icon="tabler:refresh" class="w-4 h-4" />
              重试
            </button>
          </div>
        </div>

        <div v-else class="problem-detail">
          <div class="prose max-w-none dark:prose-invert">
            <pre class="problem-text">{{ problemData?.description || '题目内容加载中...' }}</pre>
          </div>
        </div>
      </div>

      <!-- 判题结果 -->
      <div v-if="isPolling && !judgeStatus" class="polling-status">
        <div class="polling-content">
          <div class="polling-icon">
            <Icon icon="tabler:refresh" class="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-500" />
          </div>
          <div class="polling-text">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white">正在判题中...</h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">请稍候，系统正在评判您的代码</p>
          </div>
        </div>
      </div>
      <OJResultPanel v-if="judgeStatus" :status="judgeStatus.status === 'ACCEPTED' || judgeStatus.status === 'Accepted'"
        :msg="judgeStatus.status" />

      <!-- 代码编辑器弹窗 -->
      <Modal :show="isModalOpen" @close-show="isModalOpen = false">
        <div class="code-editor-modal">
          <!-- 头部 -->
          <header class="modal-header">
            <div class="header-title">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">代码编辑器</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{{ problemData?.title }}</p>
            </div>
          </header>

          <!-- 工具栏 -->
          <div class="editor-toolbar">
            <div class="toolbar-left">
              <div class="language-selector">
                <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  语言：
                </label>
                <OJLanguageSelector v-model="currentLanguage" :languages="LANGUAGES" />
              </div>
            </div>
          </div>

          <!-- 代码编辑器 -->
          <div class="editor-container">
            <div class="editor-header">
              <div class="flex items-center space-x-2">
                <Icon icon="tabler:file-code" class="w-4 h-4 text-gray-500" />
                <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">代码编辑器</span>
              </div>
            </div>

            <!-- CodeMirror 编辑器 -->
            <Codemirror v-model="code" :placeholder="`在这里输入你的 ${currentLanguageInfo.label} 代码...`"
              :style="{ height: '300px', fontSize: '14px' }" :autofocus="true" :indent-with-tab="true"
              :tab-size="editorSettings.tabSize" :extensions="codemirrorExtensions" @keydown="handleKeyDown"
              class="mobile-editor" />
          </div>

          <!-- 底部操作栏 -->
          <div class="editor-footer">
            <div class="footer-left">
              <p class="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                快捷键：Ctrl+Enter 提交代码 | 支持 {{ currentLanguageInfo.label }}
              </p>
              <p class="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                {{ currentLanguageInfo.label }}
              </p>
            </div>
            <div class="footer-right">
              <button @click="submitCode" :disabled="!canSubmit" class="submit-btn touch-btn">
                <Icon v-if="isSubmitting" icon="tabler:refresh" class="w-4 h-4 animate-spin" />
                <Icon v-else-if="isPolling" icon="tabler:clock" class="w-4 h-4 animate-pulse" />
                <Icon v-else icon="tabler:player-play" class="w-4 h-4" />
                <span class="ml-2">
                  <span class="hidden sm:inline">
                    {{ isSubmitting ? '提交中...' : isPolling ? '评判中...' : '提交代码' }}
                  </span>
                  <span class="sm:hidden">
                    {{ isSubmitting ? '提交中' : isPolling ? '评判中' : '提交' }}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
/* 移动端容器优化 */
.mobile-optimized {
  @apply transition-all duration-300;
  /* 全局底部间距，避免被导航栏遮挡 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}

@media (min-width: 768px) {
  .mobile-optimized {
    @apply p-6;
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 767px) {
  .mobile-optimized {
    @apply p-4;
  }
}

@media (max-width: 640px) {
  .mobile-optimized {
    @apply p-3;
  }
}

@media (max-width: 480px) {
  .mobile-optimized {
    @apply p-2;
  }
}

/* 智能标题栏样式 */
.smart-header {
  @apply flex items-start justify-between flex-wrap gap-4 lg:gap-6 mb-6 sm:mb-8;
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20;
}

/* 移动端智能标题栏优化 */
@media (max-width: 768px) {
  .smart-header {
    @apply flex-col items-stretch gap-3 p-4 mb-6;
  }

  .header-left {
    @apply w-full;
  }

  .header-left>div {
    @apply flex-col space-x-0 space-y-3 items-start;
  }

  .problem-info h1 {
    @apply text-lg;
  }

  .language-info span {
    @apply text-sm;
  }

  .header-actions {
    @apply flex-row justify-center;
  }
}

@media (max-width: 640px) {
  .smart-header {
    @apply p-3 mb-4;
  }

  .problem-info h1 {
    @apply text-base;
  }
}

@media (max-width: 480px) {
  .smart-header {
    @apply p-2.5;
  }
}

.header-left {
  @apply flex-1 min-w-0;
}

/* 题目信息 */
.problem-info h1 {
  @apply text-2xl font-bold mb-1;
}

.problem-info p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* 语言信息 */
.language-info span {
  @apply text-lg font-semibold text-gray-800 dark:text-gray-200;
}

.language-info p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* 操作按钮 */
.header-actions {
  @apply flex flex-col gap-2;
}

/* 触摸友好按钮基础样式 */
.touch-btn {
  /* 确保最小触摸目标尺寸 */
  min-height: 44px;
  min-width: 44px;
  /* 触摸反馈优化 */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* 防止双击缩放 */
  touch-action: manipulation;
}

.action-btn {
  @apply inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium;
  @apply transition-all duration-200 transform hover:scale-105;
  @apply focus:outline-none focus:ring-4;
}

/* 移动端操作按钮优化 */
@media (max-width: 768px) {
  .action-btn {
    @apply px-3 py-2.5 text-sm;
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .action-btn {
    @apply w-full justify-center px-4 py-3;
    min-height: 48px;
  }
}

/* 触摸设备操作按钮优化 */
@media (hover: none) and (pointer: coarse) {
  .action-btn {
    @apply hover:scale-100;
  }

  .action-btn:active {
    @apply scale-95;
    transition: all 0.1s ease-out;
  }
}

.action-btn.primary {
  @apply bg-gradient-to-r from-emerald-500 to-cyan-500 text-white;
  @apply hover:from-emerald-600 hover:to-cyan-600 hover:shadow-lg;
  @apply focus:ring-emerald-200 dark:focus:ring-emerald-800;
}

.action-btn.secondary {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-200 dark:hover:bg-gray-600;
  @apply focus:ring-gray-200 dark:focus:ring-gray-600;
}

/* 题目内容 */
.problem-content {
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl sm:rounded-2xl;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20 mb-6 sm:mb-8;
}

.problem-detail {
  @apply p-4 sm:p-6 lg:p-8;
}

.problem-text {
  @apply bg-gray-50 dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-xs sm:text-sm leading-relaxed;
  @apply overflow-auto border border-gray-200 dark:border-gray-700;
  @apply font-mono whitespace-pre-wrap;
  /* 移动端优化滚动 */
  -webkit-overflow-scrolling: touch;
  max-height: 60vh;
}

.loading-state,
.error-state {
  @apply p-4 sm:p-6 lg:p-8;
}

/* 移动端题目内容优化 */
@media (max-width: 640px) {
  .problem-detail {
    @apply p-3;
  }

  .problem-text {
    @apply text-xs p-3;
    max-height: 50vh;
  }
}

/* 代码编辑器弹窗 */
.code-editor-modal {
  @apply w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl;
  @apply overflow-hidden flex flex-col;
  @apply max-w-6xl max-h-[90vh];
}

/* 移动端编辑器弹窗优化 */
@media (max-width: 768px) {
  .code-editor-modal {
    @apply max-w-full max-h-full rounded-lg;
    height: 100vh;
  }
}

@media (max-width: 640px) {
  .code-editor-modal {
    @apply rounded-none;
    height: 100vh;
  }
}

/* 弹窗头部 */
.modal-header {
  @apply flex items-center justify-between;
  @apply bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-3 sm:py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.header-title h2 {
  @apply text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1;
}

.header-title p {
  @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400;
}

.close-btn {
  @apply p-2 rounded-lg text-gray-400 hover:text-gray-600;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

/* 编辑器工具栏 */
.editor-toolbar {
  @apply flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
  @apply bg-gray-50/50 dark:bg-gray-900/50;
}

/* 移动端工具栏优化 */
@media (max-width: 640px) {
  .editor-toolbar {
    @apply flex-col items-stretch gap-3 px-3 py-3;
  }

  .language-selector {
    @apply justify-between;
  }
}

.language-selector {
  @apply flex items-center gap-2 sm:gap-3;
}

.toolbar-btn {
  @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-lg;
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
  @apply bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600;
  @apply transition-colors duration-200;
}

/* 编辑器容器 */
.editor-container {
  @apply flex-1 overflow-hidden;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.editor-header {
  @apply flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3;
  @apply bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.icon-btn {
  @apply p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

/* 移动端编辑器优化 */
.mobile-editor {
  font-size: 13px !important;
}

@media (max-width: 640px) {
  .mobile-editor {
    font-size: 12px !important;
  }
}

/* 编辑器底部 */
.editor-footer {
  @apply flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4;
  @apply bg-gray-50 dark:bg-gray-900;
}

/* 移动端底部优化 */
@media (max-width: 640px) {
  .editor-footer {
    @apply flex-col items-stretch gap-3 px-3 py-3;
  }

  .footer-left {
    @apply text-center;
  }

  .footer-right {
    @apply w-full;
  }
}

.submit-btn {
  @apply inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3;
  @apply bg-gradient-to-r from-emerald-500 to-cyan-500 text-white;
  @apply hover:from-emerald-600 hover:to-cyan-600;
  @apply disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed;
  @apply rounded-xl font-medium shadow-lg hover:shadow-xl;
  @apply transform hover:scale-105 disabled:hover:scale-100;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-800;
}

/* 移动端提交按钮优化 */
@media (max-width: 640px) {
  .submit-btn {
    @apply w-full justify-center py-3;
    min-height: 48px;
  }
}

/* 触摸设备提交按钮优化 */
@media (hover: none) and (pointer: coarse) {
  .submit-btn {
    @apply hover:scale-100;
  }

  .submit-btn:active {
    @apply scale-95;
    transition: all 0.1s ease-out;
  }
}

/* 轮询状态样式 */
.polling-status {
  @apply bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6;
}

.polling-content {
  @apply flex items-center space-x-2 sm:space-x-3;
}

.polling-icon {
  @apply flex-shrink-0;
}

.polling-text h3 {
  @apply text-blue-900 dark:text-blue-100;
}

.polling-text p {
  @apply text-blue-700 dark:text-blue-300;
}

/* CodeMirror 样式定制 */
:deep(.cm-editor) {
  @apply border-0 outline-none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  height: 300px;
}

/* 移动端编辑器高度调整 */
@media (max-width: 768px) {
  :deep(.cm-editor) {
    height: 250px;
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  :deep(.cm-editor) {
    height: 200px;
    font-size: 12px;
  }
}

:deep(.cm-focused) {
  @apply outline-none;
}

:deep(.cm-content) {
  @apply p-3 sm:p-4;
  min-height: 200px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
}

:deep(.cm-activeLine) {
  @apply bg-emerald-50 dark:bg-emerald-900/20;
}

/* CodeMirror 样式覆盖 */
:deep(.CodeMirror) {
  @apply font-mono text-sm;
  @apply border border-gray-300 dark:border-gray-600;
}

:deep(.CodeMirror-focused .CodeMirror-selected) {
  @apply bg-emerald-100 dark:bg-emerald-900/30;
}

/* 过渡动画和交互优化 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 移动端动画优化 */
@media (max-width: 768px) {
  * {
    /* 减少动画以提升性能 */
    transition-duration: 150ms;
  }
}

/* 横屏模式优化 */
@media (max-height: 480px) and (orientation: landscape) {
  .mobile-optimized {
    padding-bottom: calc(env(safe-area-inset-bottom) + 60px);
  }

  .smart-header {
    @apply p-3 mb-4;
  }

  .problem-info h1 {
    @apply text-base;
  }

  :deep(.cm-editor) {
    height: 150px;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 2dppx) {

  .action-btn,
  .submit-btn,
  .toolbar-btn {
    /* 高分屏更精细的边框 */
    border-width: 0.5px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 大字体支持 */
@media (prefers-font-size: large) {

  .action-btn,
  .submit-btn,
  .toolbar-btn {
    @apply text-base;
    min-height: 48px;
  }
}

/* 焦点可见性优化 */
@media (prefers-reduced-motion: no-preference) {

  .action-btn:focus-visible,
  .submit-btn:focus-visible,
  .toolbar-btn:focus-visible {
    @apply ring-2 ring-offset-2;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .smart-header {
    @apply shadow-gray-900/20;
  }

  .problem-content {
    @apply shadow-gray-900/20;
  }
}
</style>
