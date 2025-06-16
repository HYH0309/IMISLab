<template>
  <div ref="editorContainer" class="codemirror-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'

export interface CodeMirrorProps {
  modelValue: string
  language?: 'javascript' | 'python' | 'java' | 'cpp' | 'text'
  theme?: 'light' | 'dark'
  placeholder?: string
  readonly?: boolean
  lineNumbers?: boolean
  height?: string
  width?: string
}

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'light',
  placeholder: '',
  readonly: false,
  lineNumbers: true,
  height: '400px',
  width: '100%'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const editorContainer = ref<HTMLElement>()
let editorView: EditorView | null = null

// 语言扩展映射
const getLanguageExtension = (lang: string) => {
  switch (lang) {
    case 'javascript':
      return javascript()
    case 'python':
      return python()
    case 'java':
      return java()
    case 'cpp':
      return cpp()
    default:
      return []
  }
}

// 创建编辑器
const createEditor = () => {
  if (!editorContainer.value) return

  const extensions = [
    basicSetup,
    getLanguageExtension(props.language),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const value = update.state.doc.toString()
        emit('update:modelValue', value)
        emit('change', value)
      }
    }),
    EditorView.theme({
      '&': {
        height: props.height,
        width: props.width
      },
      '.cm-editor': {
        height: '100%'
      },
      '.cm-scroller': {
        fontFamily: 'Fira Code, Monaco, Consolas, monospace'
      }
    })
  ]

  // 添加主题
  if (props.theme === 'dark') {
    extensions.push(oneDark)
  }

  // 只读模式
  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true))
  }

  const state = EditorState.create({
    doc: props.modelValue,
    extensions
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value
  })
}

// 销毁编辑器
const destroyEditor = () => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
}

// 更新编辑器内容
const updateContent = (newValue: string) => {
  if (editorView && newValue !== editorView.state.doc.toString()) {
    const transaction = editorView.state.update({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue
      }
    })
    editorView.dispatch(transaction)
  }
}

// 监听属性变化
watch(() => props.modelValue, updateContent)
watch(() => props.language, () => {
  destroyEditor()
  nextTick(createEditor)
})
watch(() => props.theme, () => {
  destroyEditor()
  nextTick(createEditor)
})

// 生命周期
onMounted(() => {
  nextTick(createEditor)
})

onBeforeUnmount(() => {
  destroyEditor()
})

// 暴露方法
defineExpose({
  focus: () => editorView?.focus(),
  getSelection: () => editorView?.state.selection,
  insertText: (text: string) => {
    if (editorView) {
      const transaction = editorView.state.update({
        changes: {
          from: editorView.state.selection.main.from,
          insert: text
        }
      })
      editorView.dispatch(transaction)
    }
  }
})
</script>

<style scoped>
.codemirror-container {
  @apply border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden;
}

:deep(.cm-editor) {
  @apply text-sm;
}

:deep(.cm-focused) {
  @apply outline-none ring-2 ring-blue-500/50;
}
</style>
