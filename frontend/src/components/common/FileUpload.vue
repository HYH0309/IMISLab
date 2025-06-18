<template>
  <div class="file-upload" :class="{ 'file-upload--disabled': disabled }">
    <FormField 
      :label="label" 
      :error="error" 
      :help-text="helpText"
      :required="required">
      
      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <div 
          v-for="(file, index) in fileList" 
          :key="index"
          class="file-item">
          <div class="file-info">
            <DocumentIcon class="file-icon" />
            <div class="file-details">
              <p class="file-name">{{ file.name }}</p>
              <p class="file-size">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <div class="file-actions">
            <button
              v-if="file.progress !== undefined && file.progress < 100"
              type="button"
              class="cancel-button"
              @click="cancelUpload(index)"
              aria-label="取消上传">
              <XMarkIcon class="w-4 h-4" />
            </button>
            <button
              v-else
              type="button"
              class="remove-button"
              @click="removeFile(index)"
              :disabled="disabled"
              aria-label="移除文件">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
          
          <!-- 上传进度 -->
          <div v-if="file.progress !== undefined" class="file-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${file.progress}%` }"></div>
            </div>
            <span class="progress-text">{{ file.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- 上传区域 -->
      <div 
        class="upload-area" 
        :class="{ 
          'upload-area--dragover': isDragover,
          'upload-area--compact': fileList.length > 0
        }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop">
        
        <input
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          class="file-input"
          @change="handleFileSelect"
        />
        
        <div class="upload-content" @click="triggerFileSelect">
          <CloudArrowUpIcon class="upload-icon" />
          <p class="upload-text">
            <span class="upload-primary">点击选择文件</span>
            <span v-if="!multiple">或拖拽文件</span>
            <span v-else>或拖拽多个文件</span>
            到此处
          </p>
          <p class="upload-hint">
            <span v-if="accept !== '*'">支持 {{ acceptedFormats.join(', ') }} 格式，</span>
            单个文件最大 {{ maxSizeMB }}MB
            <span v-if="multiple && maxFiles">，最多 {{ maxFiles }} 个文件</span>
          </p>
        </div>
      </div>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'
import FormField from './FormField.vue'

interface FileWithProgress extends File {
  progress?: number
  id?: string
}

interface Props {
  modelValue?: File[] | File | null
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  accept?: string
  multiple?: boolean
  maxSize?: number // MB
  maxFiles?: number
}

interface Emits {
  (e: 'update:modelValue', value: File[] | File | null): void
  (e: 'upload', files: File[]): void
  (e: 'remove', file: File, index: number): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  multiple: false,
  maxSize: 10, // 10MB
  disabled: false,
  required: false
})

const emit = defineEmits<Emits>()

// 响应式状态
const fileInput = ref<HTMLInputElement>()
const isDragover = ref(false)
const fileList = ref<FileWithProgress[]>([])

// 计算属性
const maxSizeMB = computed(() => props.maxSize)
const acceptedFormats = computed(() => {
  if (props.accept === '*') return ['所有格式']
  if (props.accept.includes('image/*')) return ['图片文件']
  if (props.accept.includes('text/*')) return ['文本文件']
  return props.accept.split(',').map(format => format.trim().toUpperCase())
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (Array.isArray(newValue)) {
    fileList.value = newValue.map(file => ({ ...file }))
  } else if (newValue instanceof File) {
    fileList.value = [{ ...newValue }]
  } else {
    fileList.value = []
  }
}, { immediate: true })

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 验证文件
const validateFile = (file: File): string | null => {
  // 检查文件类型
  if (props.accept !== '*' && !file.type.match(props.accept.replace('*', '.*'))) {
    return `不支持的文件格式。请选择 ${acceptedFormats.value.join(', ')} 格式的文件。`
  }

  // 检查文件大小
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `文件"${file.name}"过大。请选择小于 ${maxSizeMB.value}MB 的文件。`
  }

  // 检查文件数量
  if (props.multiple && props.maxFiles && fileList.value.length >= props.maxFiles) {
    return `最多只能上传 ${props.maxFiles} 个文件。`
  }

  return null
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragover.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragover.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragover.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    processFiles(files)
  }
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    processFiles(files)
  }
}

// 处理文件
const processFiles = (files: File[]) => {
  const validFiles: File[] = []
  
  for (const file of files) {
    const validationError = validateFile(file)
    if (validationError) {
      emit('error', validationError)
      continue
    }
    validFiles.push(file)
  }

  if (validFiles.length === 0) return

  // 更新文件列表
  if (props.multiple) {
    const newFiles = [...fileList.value, ...validFiles.map(file => ({ ...file, id: generateId() }))]
    fileList.value = newFiles
    emit('update:modelValue', newFiles)
  } else {
    const newFile = { ...validFiles[0], id: generateId() }
    fileList.value = [newFile]
    emit('update:modelValue', newFile)
  }
  
  // 触发上传事件
  emit('upload', validFiles)
  
  // 模拟上传进度
  simulateUpload(validFiles)
}

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 模拟上传进度
const simulateUpload = (files: File[]) => {
  files.forEach((file) => {
    const targetIndex = fileList.value.findIndex(f => f.name === file.name && f.size === file.size)
    if (targetIndex === -1) return

    const interval = setInterval(() => {
      const currentFile = fileList.value[targetIndex]
      if (!currentFile) {
        clearInterval(interval)
        return
      }

      currentFile.progress = (currentFile.progress || 0) + Math.random() * 15
      if (currentFile.progress >= 100) {
        currentFile.progress = 100
        clearInterval(interval)
      }
    }, 200)
  })
}

// 触发文件选择
const triggerFileSelect = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

// 移除文件
const removeFile = (index: number) => {
  const removedFile = fileList.value[index]
  fileList.value.splice(index, 1)
  
  // 更新modelValue
  if (props.multiple) {
    emit('update:modelValue', [...fileList.value])
  } else {
    emit('update:modelValue', null)
  }
  
  emit('remove', removedFile, index)
  
  // 清空文件输入
  if (fileList.value.length === 0 && fileInput.value) {
    fileInput.value.value = ''
  }
}

// 取消上传
const cancelUpload = (index: number) => {
  removeFile(index)
}
</script>

<style scoped>
.file-upload {
  @apply w-full;
}

.file-upload--disabled {
  @apply opacity-50 pointer-events-none;
}

/* 文件列表样式 */
.file-list {
  @apply space-y-2 mb-4;
}

.file-item {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700;
}

.file-info {
  @apply flex items-center space-x-3 mb-2;
}

.file-icon {
  @apply w-6 h-6 text-gray-400 flex-shrink-0;
}

.file-details {
  @apply flex-1 min-w-0;
}

.file-name {
  @apply text-sm font-medium text-gray-900 dark:text-white truncate;
}

.file-size {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.file-actions {
  @apply flex justify-end;
}

.remove-button,
.cancel-button {
  @apply p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded transition-colors;
}

.file-progress {
  @apply flex items-center space-x-2;
}

.progress-bar {
  @apply flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5;
}

.progress-fill {
  @apply bg-blue-600 h-1.5 rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-xs text-gray-500 dark:text-gray-400 font-mono;
}

/* 上传区域样式 */
.upload-area {
  @apply relative w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10;
}

.upload-area--compact {
  @apply h-20;
}

.upload-area--dragover {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.upload-content {
  @apply flex flex-col items-center justify-center h-full p-4 text-center;
}

.upload-icon {
  @apply w-8 h-8 text-gray-400 mb-2;
}

.upload-area--compact .upload-icon {
  @apply w-6 h-6 mb-1;
}

.upload-text {
  @apply text-sm text-gray-600 dark:text-gray-300 mb-1;
}

.upload-area--compact .upload-text {
  @apply text-xs mb-0;
}

.upload-primary {
  @apply text-blue-600 dark:text-blue-400 font-medium;
}

.upload-hint {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.upload-area--compact .upload-hint {
  @apply text-xs;
}
</style>
