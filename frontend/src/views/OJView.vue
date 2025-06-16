<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Modal from '@/components/composable/BaseModal.vue'
import OJResultPanel from '@/components/oj/OJResultPanel.vue'
import OJLanguageSelector from '@/components/oj/OJLanguageSelector.vue'
import { api } from '@/api'
import type { JudgeResult, OJProblem } from '@/types/api'

// CodeMirror 导入
import Codemirror from "codemirror-editor-vue3"

// 语言配置
const LANGUAGES = [
  {
    value: 'text/x-java',
    label: 'Java',
    icon: 'i-logos:java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
  },
  {
    value: 'text/x-c++src',
    label: 'C++',
    icon: 'i-logos:c-plusplus',
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`
  },
  {
    value: 'text/x-python',
    label: 'Python',
    icon: 'i-logos:python',
    template: `# Python Solution
def main():
    print("Hello World")

if __name__ == "__main__":
    main()`
  }
]

const LANGUAGE_ID_MAP: Record<string, number> = {
  'text/x-java': 62,
  'text/x-c++src': 54,
  'text/x-python': 71
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
const codemirrorOptions = computed(() => ({
  mode: currentLanguage.value,
  theme: editorSettings.value.theme,
  lineNumbers: true,
  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
  fontSize: `${editorSettings.value.fontSize}px`,
  lineWrapping: true,
  indentUnit: editorSettings.value.tabSize,
  autoCloseBrackets: true,
  matchBrackets: true,
  styleActiveLine: true,
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  extraKeys: {
    'Ctrl-Enter': () => submitCode(),
    'Cmd-Enter': () => submitCode()
  }
}))

const isSubmitting = computed(() => submitStatus.value === 'loading')
const isPolling = computed(() => submitStatus.value === 'polling')
const canSubmit = computed(() => submitStatus.value === 'idle')

const currentLanguageInfo = computed(() =>
  LANGUAGES.find(lang => lang.value === currentLanguage.value) || LANGUAGES[0]
)

// 重置代码模板
const resetCode = () => {
  const language = LANGUAGES.find(lang => lang.value === currentLanguage.value)
  if (language) {
    code.value = language.template
  }
}

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

    <div class="container mx-auto p-6 max-w-6xl relative">
      <!-- 智能标题栏 -->
      <div class="smart-header">
        <div class="header-left">
          <div class="flex items-center space-x-4">
            <!-- 题目信息 -->
            <div class="problem-info">
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                {{ problemData?.title || '加载中...' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <template v-if="isLoading">题目加载中...</template>
                <template v-else>题目ID: {{ problemId }} | 在线编程挑战</template>
              </p>
            </div>

            <!-- 分隔线 -->
            <div class="w-px h-12 bg-gradient-to-b from-emerald-300 to-cyan-300 dark:from-emerald-600 dark:to-cyan-600">
            </div>

            <!-- 语言信息 -->
            <div class="language-info">
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
                <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {{ currentLanguageInfo.label }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 ml-4">
                当前编程语言
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="header-actions">
          <div class="flex gap-3">
            <button @click="isModalOpen = true" class="action-btn primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4">
                </path>
              </svg>
              编写代码
            </button>
          </div>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="problem-content">
        <div v-if="isLoading" class="loading-state">
          <div class="flex items-center justify-center py-12">
            <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <span class="ml-3 text-gray-600 dark:text-gray-300">正在加载题目...</span>
          </div>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="text-center py-12">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z">
                </path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">加载失败</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ error.message }}</p>
            <button @click="fetchProblem" class="action-btn primary">重试</button>
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
            <svg class="w-6 h-6 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
          </div>
          <div class="polling-text">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">正在判题中...</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">请稍候，系统正在评判您的代码</p>
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
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">代码编辑器</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ problemData?.title }}</p>
            </div>
          </header>

          <!-- 工具栏 -->
          <div class="editor-toolbar">
            <div class="toolbar-left">
              <div class="language-selector">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  编程语言：
                </label>
                <OJLanguageSelector v-model="currentLanguage" :languages="LANGUAGES" />
              </div>
            </div>

            <div class="toolbar-right">
              <button @click="resetCode" class="toolbar-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
                重置
              </button>
            </div>
          </div>

          <!-- 代码编辑器 -->
          <div class="editor-container">
            <Codemirror v-model:value="code" :options="codemirrorOptions" height="450px" width="100%"
              class="code-editor" />
          </div>

          <!-- 底部操作栏 -->
          <div class="editor-footer">
            <div class="footer-left">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                快捷键：Ctrl+Enter 提交代码 | 支持 {{ currentLanguageInfo.label }}
              </p>
            </div>
            <div class="footer-right">
              <button @click="submitCode" :disabled="!canSubmit" class="submit-btn">
                <span v-if="isSubmitting" class="loading-icon">
                  <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                </span>
                <span v-else-if="isPolling" class="polling-icon">
                  <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                <span v-else class="submit-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </span>
                {{
                  isSubmitting ? '提交中...' :
                    isPolling ? '等待结果...' :
                      '提交代码'
                }}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
/* 智能标题栏样式 */
.smart-header {
  @apply flex items-start justify-between flex-wrap gap-6 mb-8;
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20;
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

.action-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium;
  @apply transition-all duration-200 transform hover:scale-105;
  @apply focus:outline-none focus:ring-4;
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
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20 mb-8;
}

.problem-detail {
  @apply p-8;
}

.problem-text {
  @apply bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-sm leading-relaxed;
  @apply overflow-auto border border-gray-200 dark:border-gray-700;
  @apply font-mono whitespace-pre-wrap;
}

.loading-state,
.error-state {
  @apply p-8;
}

/* 代码编辑器弹窗 */
.code-editor-modal {
  @apply w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl;
  @apply overflow-hidden flex flex-col;
  @apply max-w-6xl max-h-[90vh];
}

/* 弹窗头部 */
.modal-header {
  @apply flex items-center justify-between;
  @apply bg-gray-50 dark:bg-gray-900 px-6 py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.header-title h2 {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-1;
}

.header-title p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.close-btn {
  @apply p-2 rounded-lg text-gray-400 hover:text-gray-600;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

/* 编辑器工具栏 */
.editor-toolbar {
  @apply flex items-center justify-between px-6 py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
  @apply bg-gray-50/50 dark:bg-gray-900/50;
}

.language-selector {
  @apply flex items-center gap-3;
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

.code-editor {
  @apply h-full;
}

/* 编辑器底部 */
.editor-footer {
  @apply flex items-center justify-between px-6 py-4;
  @apply bg-gray-50 dark:bg-gray-900;
}

.submit-btn {
  @apply inline-flex items-center gap-2 px-6 py-3;
  @apply bg-gradient-to-r from-emerald-500 to-cyan-500 text-white;
  @apply hover:from-emerald-600 hover:to-cyan-600;
  @apply disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed;
  @apply rounded-xl font-medium shadow-lg hover:shadow-xl;
  @apply transform hover:scale-105 disabled:hover:scale-100;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-800;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-header {
    @apply flex-col items-stretch gap-4 p-6;
  }

  .header-left>div {
    @apply flex-col space-x-0 space-y-4 items-start;
  }

  .problem-info h1 {
    @apply text-xl;
  }

  .language-info span {
    @apply text-base;
  }

  .header-actions {
    @apply flex-row justify-center;
  }

  .code-editor-modal {
    @apply max-w-full max-h-full rounded-none;
  }

  .editor-toolbar {
    @apply flex-col items-stretch gap-3;
  }

  .language-selector {
    @apply justify-between;
  }
}

@media (max-width: 640px) {
  .smart-header {
    @apply p-4;
  }

  .problem-detail {
    @apply p-4;
  }

  .problem-text {
    @apply text-xs p-4;
  }

  /* 隐藏分隔线在小屏幕上 */
  .header-left>div>div:nth-child(2) {
    @apply hidden;
  }

  .action-btn {
    @apply w-full justify-center;
  }

  .submit-btn {
    @apply w-full justify-center;
  }
}

/* CodeMirror 样式覆盖 */
:deep(.CodeMirror) {
  @apply font-mono text-sm;
  @apply border border-gray-300 dark:border-gray-600;
}

:deep(.CodeMirror-focused .CodeMirror-selected) {
  @apply bg-emerald-100 dark:bg-emerald-900/30;
}

:deep(.CodeMirror-activeline-background) {
  @apply bg-emerald-50 dark:bg-emerald-900/20;
}

/* 轮询状态样式 */
.polling-status {
  @apply bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6;
}

.polling-content {
  @apply flex items-center space-x-3;
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

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .smart-header {
    @apply shadow-gray-900/20;
  }

  .problem-content {
    @apply shadow-gray-900/20;
  }
}

/* 过渡动画 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
