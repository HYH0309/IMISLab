<template>
  <div class="rich-editor">
    <FormField
      :label="label"
      :error="error"
      :help-text="helpText"
      :required="required">

      <!-- 工具栏 -->
      <div class="editor-toolbar" v-if="!readonly">
        <div class="toolbar-group">
          <!-- 格式化工具 -->
          <button
            v-for="format in formats"
            :key="format.id"
            type="button"
            class="toolbar-button"
            :class="{ 'toolbar-button--active': isFormatActive() }"
            :title="format.title"
            @click="applyFormat(format)"
            :disabled="disabled">
            <component :is="format.icon" class="w-4 h-4" />
          </button>
        </div>

        <div class="toolbar-separator"></div>

        <div class="toolbar-group">
          <!-- 插入工具 -->
          <button
            type="button"
            class="toolbar-button"
            title="插入链接"
            @click="insertLink"
            :disabled="disabled">
            <LinkIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="toolbar-button"
            title="插入图片"
            @click="showImageDialog = true"
            :disabled="disabled">
            <PhotoIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="toolbar-button"
            title="插入代码块"
            @click="insertCodeBlock"
            :disabled="disabled">
            <CodeBracketIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="toolbar-separator"></div>

        <div class="toolbar-group">
          <!-- 视图切换 -->
          <button
            type="button"
            class="toolbar-button"
            :class="{ 'toolbar-button--active': mode === 'edit' }"
            title="编辑模式"
            @click="mode = 'edit'"
            :disabled="disabled">
            <PencilIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="toolbar-button"
            :class="{ 'toolbar-button--active': mode === 'preview' }"
            title="预览模式"
            @click="mode = 'preview'"
            :disabled="disabled">
            <EyeIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="toolbar-button"
            :class="{ 'toolbar-button--active': mode === 'split' }"
            title="分屏模式"
            @click="mode = 'split'"
            :disabled="disabled">
            <RectangleStackIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 编辑器内容区 -->
      <div class="editor-content" :class="`editor-content--${mode}`">
        <!-- 编辑器 -->
        <div v-if="mode === 'edit' || mode === 'split'" class="editor-pane">
          <textarea
            ref="textareaRef"
            :value="modelValue"
            @input="handleInput"
            @keydown="handleKeydown"
            @select="updateSelection"
            :placeholder="placeholder"
            :readonly="readonly || disabled"
            :rows="rows"
            class="editor-textarea"
            :class="{
              'editor-textarea--error': !!error,
              'editor-textarea--readonly': readonly || disabled
            }"
          ></textarea>

          <!-- 行号 -->
          <div v-if="showLineNumbers" class="line-numbers">
            <div
              v-for="n in lineCount"
              :key="n"
              class="line-number">
              {{ n }}
            </div>
          </div>
        </div>

        <!-- 预览 -->
        <div v-if="mode === 'preview' || mode === 'split'" class="preview-pane">
          <div
            class="preview-content markdown-body"
            v-html="renderedContent">
          </div>
        </div>
      </div>

      <!-- 状态栏 -->
      <div class="editor-status" v-if="!readonly">
        <div class="status-info">
          <span class="status-item">行 {{ currentLine }}</span>
          <span class="status-item">列 {{ currentColumn }}</span>
          <span class="status-item">{{ characterCount }} 字符</span>
          <span class="status-item">{{ wordCount }} 词</span>
        </div>

        <div class="status-actions">
          <button
            type="button"
            class="status-button"
            @click="showHelp = !showHelp"
            title="Markdown 帮助">
            <QuestionMarkCircleIcon class="w-4 h-4" />
          </button>

          <button
            v-if="allowFullscreen"
            type="button"
            class="status-button"
            @click="toggleFullscreen"
            :title="isFullscreen ? '退出全屏' : '全屏编辑'">
            <component :is="isFullscreen ? 'ArrowsPointingInIcon' : 'ArrowsPointingOutIcon'" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </FormField>

    <!-- 图片插入对话框 -->
    <div v-if="showImageDialog" class="modal-overlay" @click="showImageDialog = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">插入图片</h3>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">图片URL</label>
            <input
              v-model="imageUrl"
              type="url"
              class="form-input"
              placeholder="https://example.com/image.jpg"
              @keydown.enter="insertImage"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Alt文本（可选）</label>
            <input
              v-model="imageAlt"
              type="text"
              class="form-input"
              placeholder="图片描述"
              @keydown.enter="insertImage"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showImageDialog = false">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="insertImage">
            插入
          </button>
        </div>
      </div>
    </div>

    <!-- Markdown 帮助 -->
    <div v-if="showHelp" class="help-panel">
      <div class="help-header">
        <h4 class="help-title">Markdown 语法帮助</h4>
        <button type="button" class="help-close" @click="showHelp = false">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      <div class="help-content">
        <div class="help-section">
          <h5>基本格式</h5>
          <ul>
            <li><code>**粗体**</code> 或 <code>__粗体__</code></li>
            <li><code>*斜体*</code> 或 <code>_斜体_</code></li>
            <li><code>~~删除线~~</code></li>
            <li><code>`代码`</code></li>
          </ul>
        </div>
        <div class="help-section">
          <h5>标题</h5>
          <ul>
            <li><code># 一级标题</code></li>
            <li><code>## 二级标题</code></li>
            <li><code>### 三级标题</code></li>
          </ul>
        </div>
        <div class="help-section">
          <h5>链接和图片</h5>
          <ul>
            <li><code>[链接文本](URL)</code></li>
            <li><code>![图片描述](图片URL)</code></li>
          </ul>
        </div>
        <div class="help-section">
          <h5>列表</h5>
          <ul>
            <li><code>- 无序列表</code></li>
            <li><code>1. 有序列表</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  LinkIcon,
  PhotoIcon,
  PencilIcon,
  EyeIcon,
  RectangleStackIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ListBulletIcon,
  NumberedListIcon
} from '@heroicons/vue/24/outline'
import FormField from './FormField.vue'
import { md } from '@/composables/useMarked'

interface FormatTool {
  id: string
  title: string
  icon: typeof BoldIcon
  markdown: string
  block?: boolean
}

interface Props {
  modelValue?: string
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  rows?: number
  showLineNumbers?: boolean
  allowFullscreen?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '开始编写内容...',
  rows: 10,
  showLineNumbers: false,
  allowFullscreen: true,
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

// 引用
const textareaRef = ref<HTMLTextAreaElement>()

// 状态
const mode = ref<'edit' | 'preview' | 'split'>('edit')
const showImageDialog = ref(false)
const showHelp = ref(false)
const isFullscreen = ref(false)
const imageUrl = ref('')
const imageAlt = ref('')
const currentLine = ref(1)
const currentColumn = ref(1)
const selectionStart = ref(0)
const selectionEnd = ref(0)

// 格式化工具
const formats: FormatTool[] = [
  { id: 'bold', title: '粗体', icon: BoldIcon, markdown: '**文本**' },
  { id: 'italic', title: '斜体', icon: ItalicIcon, markdown: '*文本*' },
  { id: 'code', title: '代码', icon: CodeBracketIcon, markdown: '`代码`' },
  { id: 'ul', title: '无序列表', icon: ListBulletIcon, markdown: '- ', block: true },
  { id: 'ol', title: '有序列表', icon: NumberedListIcon, markdown: '1. ', block: true }
]

// 计算属性
const renderedContent = computed(() => {
  return md.render(props.modelValue || '')
})

const lineCount = computed(() => {
  return (props.modelValue || '').split('\n').length
})

const characterCount = computed(() => {
  return (props.modelValue || '').length
})

const wordCount = computed(() => {
  return (props.modelValue || '').trim().split(/\s+/).filter(Boolean).length
})

// 更新选择状态
const updateSelection = () => {
  nextTick(() => {
    if (!textareaRef.value) return
    
    selectionStart.value = textareaRef.value.selectionStart
    selectionEnd.value = textareaRef.value.selectionEnd
    
    // 计算当前行列
    const content = props.modelValue || ''
    const beforeCursor = content.substring(0, selectionStart.value)
    const lines = beforeCursor.split('\n')
    currentLine.value = lines.length
    currentColumn.value = lines[lines.length - 1].length + 1
  })
}

// 更新统计信息
const updateStats = () => {
  updateSelection()
}

// 监听modelValue变化
watch(() => props.modelValue, () => {
  updateStats()
}, { immediate: true })

// 处理输入
const handleInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  emit('change', value)
  updateStats()
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  // Tab键处理
  if (event.key === 'Tab') {
    event.preventDefault()
    insertText('  ') // 插入两个空格
  }

  // Ctrl+快捷键
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault()
        applyFormat(formats.find(f => f.id === 'bold')!)
        break
      case 'i':
        event.preventDefault()
        applyFormat(formats.find(f => f.id === 'italic')!)
        break
      case '`':
        event.preventDefault()
        applyFormat(formats.find(f => f.id === 'code')!)
        break
    }
  }
}

// 插入文本
const insertText = (text: string, selectInserted = false) => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = props.modelValue || ''

  const newValue = value.substring(0, start) + text + value.substring(end)
  emit('update:modelValue', newValue)

  nextTick(() => {
    if (selectInserted) {
      textarea.setSelectionRange(start, start + text.length)
    } else {
      textarea.setSelectionRange(start + text.length, start + text.length)
    }
    textarea.focus()
  })
}

// 应用格式
const applyFormat = (format: FormatTool) => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = (props.modelValue || '').substring(start, end)

  if (format.block) {
    // 块级格式（如列表）
    const lines = selectedText.split('\n')
    const formattedLines = lines.map(line => format.markdown + line)
    insertText(formattedLines.join('\n'), true)
  } else {
    // 内联格式
    if (selectedText) {
      const formatted = format.markdown.replace('文本', selectedText)
      insertText(formatted, true)
    } else {
      insertText(format.markdown, true)
    }
  }
}

// 检查格式是否激活
const isFormatActive = (): boolean => {
  // 这里可以实现更复杂的逻辑来检查当前选择的文本是否已应用该格式
  return false
}

// 插入链接
const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (url) {
    const text = prompt('请输入链接文字:') || url
    insertText(`[${text}](${url})`)
  }
}

// 插入图片
const insertImage = () => {
  if (imageUrl.value) {
    const alt = imageAlt.value || '图片'
    insertText(`![${alt}](${imageUrl.value})`)
    showImageDialog.value = false
    imageUrl.value = ''
    imageAlt.value = ''
  }
}

// 插入代码块
const insertCodeBlock = () => {
  const language = prompt('请输入代码语言（可选）:') || ''
  insertText(`\`\`\`${language}\n代码内容\n\`\`\``)
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // 这里可以实现真正的全屏逻辑
}
</script>

<style scoped>
.rich-editor {
  @apply w-full;
}

/* 工具栏样式 */
.editor-toolbar {
  @apply flex items-center p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg;
}

.toolbar-group {
  @apply flex items-center space-x-1;
}

.toolbar-separator {
  @apply w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2;
}

.toolbar-button {
  @apply p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.toolbar-button--active {
  @apply bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400;
}

/* 编辑器内容样式 */
.editor-content {
  @apply relative border-l border-r border-gray-200 dark:border-gray-700;
}

.editor-content--edit {
  @apply block;
}

.editor-content--preview {
  @apply block;
}

.editor-content--split {
  @apply grid grid-cols-2;
}

.editor-pane {
  @apply relative;
}

.editor-textarea {
  @apply w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 resize-none focus:outline-none;
}

.editor-textarea--error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.editor-textarea--readonly {
  @apply bg-gray-50 dark:bg-gray-800 cursor-not-allowed;
}

.line-numbers {
  @apply absolute left-0 top-0 bottom-0 w-12 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-mono leading-5 py-3;
}

.line-number {
  @apply px-2 text-right;
}

.preview-pane {
  @apply p-3 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-auto;
}

.preview-content {
  @apply prose dark:prose-invert max-w-none;
}

/* 状态栏样式 */
.editor-status {
  @apply flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg text-xs text-gray-500 dark:text-gray-400;
}

.status-info {
  @apply flex items-center space-x-4;
}

.status-item {
  @apply font-mono;
}

.status-actions {
  @apply flex items-center space-x-1;
}

.status-button {
  @apply p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors;
}

/* 模态框样式 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4;
}

.modal-title {
  @apply text-lg font-semibold p-4 border-b border-gray-200 dark:border-gray-700;
}

.modal-body {
  @apply p-4 space-y-4;
}

.modal-footer {
  @apply flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700;
}

.form-group {
  @apply space-y-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500;
}

/* 帮助面板样式 */
.help-panel {
  @apply mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg;
}

.help-header {
  @apply flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700;
}

.help-title {
  @apply font-semibold text-gray-900 dark:text-white;
}

.help-close {
  @apply p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded;
}

.help-content {
  @apply p-3 max-h-64 overflow-auto text-sm;
}

.help-section {
  @apply mb-4 last:mb-0;
}

.help-section h5 {
  @apply font-medium text-gray-900 dark:text-white mb-2;
}

.help-section ul {
  @apply space-y-1 text-gray-600 dark:text-gray-300;
}

.help-section code {
  @apply px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono;
}
</style>
