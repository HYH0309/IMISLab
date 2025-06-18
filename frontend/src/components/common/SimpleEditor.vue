<template>
  <div class="simple-editor">
    <FormField 
      :label="label" 
      :error="error" 
      :help-text="helpText"
      :required="required">
      
      <!-- 简单工具栏 -->
      <div class="editor-toolbar" v-if="!readonly">
        <div class="toolbar-group">
          <button
            v-for="tool in tools"
            :key="tool.id"
            type="button"
            class="toolbar-button"
            :title="tool.title"
            @click="insertText(tool.syntax)"
            :disabled="disabled">
            <component :is="tool.icon" class="w-4 h-4" />
          </button>
        </div>
        
        <div class="toolbar-separator"></div>
        
        <div class="toolbar-group">
          <button
            type="button"
            class="toolbar-button"
            title="预览"
            @click="showPreview = !showPreview"
            :disabled="disabled">
            <EyeIcon class="w-4 h-4" />
          </button>
          
          <button
            type="button"
            class="toolbar-button"
            title="帮助"
            @click="showHelp = !showHelp"
            :disabled="disabled">
            <QuestionMarkCircleIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- 编辑器内容 -->
      <div class="editor-content" :class="{ 'editor-content--split': showPreview }">
        <!-- 文本区域 -->
        <div class="editor-pane">
          <textarea
            ref="textareaRef"
            :value="modelValue"
            @input="handleInput"
            @keydown="handleKeydown"
            :placeholder="placeholder"
            :readonly="readonly || disabled"
            :rows="rows"
            class="editor-textarea"
            :class="{
              'editor-textarea--error': !!error,
              'editor-textarea--readonly': readonly || disabled
            }"
          ></textarea>
        </div>
        
        <!-- 预览区域 -->
        <div v-if="showPreview" class="preview-pane">
          <div class="preview-content" v-html="renderedContent"></div>
        </div>
      </div>
      
      <!-- 状态栏 -->
      <div class="editor-status" v-if="!readonly">
        <div class="status-info">
          <span class="status-item">{{ characterCount }} 字符</span>
          <span class="status-item">{{ wordCount }} 词</span>
        </div>
      </div>
    </FormField>
    
    <!-- 帮助面板 -->
    <div v-if="showHelp" class="help-panel">
      <div class="help-header">
        <h4 class="help-title">Markdown 语法</h4>
        <button type="button" class="help-close" @click="showHelp = false">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      <div class="help-content">
        <div class="help-section">
          <p><code>**粗体**</code> <code>*斜体*</code> <code>`代码`</code></p>
          <p><code># 标题</code> <code>- 列表</code> <code>[链接](URL)</code></p>
          <p><code>![图片](URL)</code> <code>```代码块```</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  LinkIcon,
  PhotoIcon,
  ListBulletIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import FormField from './FormField.vue'
import { md } from '@/composables/useMarked'

interface Tool {
  id: string
  title: string
  icon: typeof BoldIcon
  syntax: string
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
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '开始编写内容...',
  rows: 10,
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

// 引用
const textareaRef = ref<HTMLTextAreaElement>()

// 状态
const showPreview = ref(false)
const showHelp = ref(false)

// 工具栏配置
const tools: Tool[] = [
  { id: 'bold', title: '粗体', icon: BoldIcon, syntax: '**文本**' },
  { id: 'italic', title: '斜体', icon: ItalicIcon, syntax: '*文本*' },
  { id: 'code', title: '代码', icon: CodeBracketIcon, syntax: '`代码`' },
  { id: 'link', title: '链接', icon: LinkIcon, syntax: '[链接文字](URL)' },
  { id: 'image', title: '图片', icon: PhotoIcon, syntax: '![图片描述](图片URL)' },
  { id: 'list', title: '列表', icon: ListBulletIcon, syntax: '- 列表项' }
]

// 计算属性
const renderedContent = computed(() => {
  try {
    return md.render(props.modelValue || '')
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    return '<p>内容预览错误</p>'
  }
})

const characterCount = computed(() => {
  return (props.modelValue || '').length
})

const wordCount = computed(() => {
  return (props.modelValue || '').trim().split(/\s+/).filter(Boolean).length
})

// 处理输入
const handleInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  emit('change', value)
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  // Tab键处理
  if (event.key === 'Tab') {
    event.preventDefault()
    insertTextAtCursor('  ') // 插入两个空格
  }
  
  // Ctrl+快捷键
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault()
        insertText('**文本**')
        break
      case 'i':
        event.preventDefault()
        insertText('*文本*')
        break
      case '`':
        event.preventDefault()
        insertText('`代码`')
        break
    }
  }
}

// 插入文本
const insertText = (text: string) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = props.modelValue || ''
  
  const newValue = value.substring(0, start) + text + value.substring(end)
  emit('update:modelValue', newValue)
  
  nextTick(() => {
    const newCursorPos = start + text.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    textarea.focus()
  })
}

// 在光标位置插入文本
const insertTextAtCursor = (text: string) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const value = props.modelValue || ''
  
  const newValue = value.substring(0, start) + text + value.substring(start)
  emit('update:modelValue', newValue)
  
  nextTick(() => {
    const newCursorPos = start + text.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    textarea.focus()
  })
}
</script>

<style scoped>
.simple-editor {
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

/* 编辑器内容样式 */
.editor-content {
  @apply relative border-l border-r border-gray-200 dark:border-gray-700;
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

.preview-pane {
  @apply p-3 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-auto;
}

.preview-content {
  @apply prose dark:prose-invert max-w-none text-sm;
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
  @apply p-3 text-sm;
}

.help-section p {
  @apply mb-2 text-gray-600 dark:text-gray-300;
}

.help-section code {
  @apply px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono mr-2;
}
</style>
