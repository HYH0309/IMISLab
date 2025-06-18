<template>
  <div class="image-upload" :class="{ 'image-upload--disabled': disabled }">
    <FormField 
      :label="label" 
      :error="error" 
      :help-text="helpText"
      :required="required">
      
      <!-- 图片预览区域 -->
      <div v-if="previewUrl" class="image-preview">
        <div class="preview-container">
          <img :src="previewUrl" :alt="alt || '图片预览'" class="preview-image" />
          <div class="preview-overlay">
            <button
              type="button"
              @click="removeImage"
              class="remove-button"
              :disabled="disabled"
              aria-label="移除图片">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 上传区域 -->
      <div v-else class="upload-area" :class="{ 'upload-area--dragover': isDragover }">
        <input
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          class="file-input"
          @change="handleFileSelect"
          @dragover.prevent="isDragover = true"
          @dragleave.prevent="isDragover = false"
          @drop.prevent="handleDrop"
        />
        
        <div class="upload-content" @click="triggerFileSelect">
          <PhotoIcon class="upload-icon" />
          <p class="upload-text">
            <span class="upload-primary">点击上传图片</span>
            或拖拽图片到此处
          </p>
          <p class="upload-hint">
            支持 {{ acceptedFormats.join(', ') }} 格式，最大 {{ maxSizeMB }}MB          </p>
        </div>
      </div>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import FormField from './FormField.vue'

interface Props {
  modelValue?: File | string | null
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  accept?: string
  multiple?: boolean
  maxSize?: number // MB
  alt?: string
}

interface Emits {
  (e: 'update:modelValue', value: File | string | null): void
  (e: 'upload', file: File): void
  (e: 'remove'): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: false,
  maxSize: 5, // 5MB
  disabled: false,
  required: false
})

const emit = defineEmits<Emits>()

// 响应式状态
const fileInput = ref<HTMLInputElement>()
const isDragover = ref(false)
const previewUrl = ref<string>('')

// 计算属性
const maxSizeMB = computed(() => props.maxSize)
const acceptedFormats = computed(() => {
  if (props.accept === 'image/*') return ['PNG', 'JPG', 'JPEG', 'GIF', 'WebP']
  return props.accept.split(',').map(format => format.trim().toUpperCase())
})

// 监听modelValue变化更新预览
watch(() => props.modelValue, (newValue) => {
  if (typeof newValue === 'string' && newValue) {
    // 如果是URL字符串，直接显示
    previewUrl.value = newValue
  } else if (newValue instanceof File) {
    // 如果是文件对象，读取为base64显示（这通常已经在processFile中处理了）
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(newValue)
  } else {
    // 清空预览
    previewUrl.value = ''
  }
}, { immediate: true })

// 验证文件
const validateFile = (file: File): string | null => {
  // 检查文件类型
  if (props.accept !== '*' && !file.type.match(props.accept.replace('*', '.*'))) {
    return `不支持的文件格式。请选择 ${acceptedFormats.value.join(', ')} 格式的文件。`
  }

  // 检查文件大小
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `文件过大。请选择小于 ${maxSizeMB.value}MB 的文件。`
  }

  return null
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

// 处理拖拽上传
const handleDrop = (event: DragEvent) => {
  isDragover.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

// 处理文件
const processFile = (file: File) => {
  const validationError = validateFile(file)
  if (validationError) {
    emit('error', validationError)
    return
  }
  
  // 立即创建本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  // 更新模型值为文件对象
  emit('update:modelValue', file)
  
  // 触发上传事件
  emit('upload', file)
}

// 触发文件选择
const triggerFileSelect = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

// 移除图片
const removeImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', null)
  emit('remove')
  
  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-upload {
  @apply w-full;
}

.image-upload--disabled {
  @apply opacity-50 pointer-events-none;
}

/* 图片预览样式 */
.image-preview {
  @apply relative w-full;
}

.preview-container {
  @apply relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 group;
}

.preview-image {
  @apply w-full h-full object-cover;
}

.preview-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center;
}

.remove-button {
  @apply p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}

/* 上传区域样式 */
.upload-area {
  @apply relative w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10;
}

.upload-area--dragover {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.upload-content {
  @apply flex flex-col items-center justify-center h-full p-6 text-center;
}

.upload-icon {
  @apply w-12 h-12 text-gray-400 mb-4;
}

.upload-text {
  @apply text-sm text-gray-600 dark:text-gray-300 mb-2;
}

.upload-primary {
  @apply text-blue-600 dark:text-blue-400 font-medium;
}

.upload-hint {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

/* 进度条样式 */
.upload-progress {
  @apply mt-4;
}

.progress-bar {
  @apply w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2;
}

.progress-fill {
  @apply bg-blue-600 h-2 rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-sm text-gray-600 dark:text-gray-300 text-center;
}
</style>
