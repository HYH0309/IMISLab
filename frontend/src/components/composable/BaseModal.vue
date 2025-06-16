<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue'
import { motion } from 'motion-v'
import { Z_INDEX } from '@/config/z-index'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['CloseShow'])

const closeModal = () => {
  if (props.show) {
    emit('CloseShow')
  }
}
const dialogOpenState = {
  opacity: 1,
  filter: 'blur(0px)',
  rotateX: 0,
  rotateY: 0,
  z: 0,
  transition: {
    delay: 0.2,
    duration: 0.5,
    ease: [0.17, 0.67, 0.51, 1],
    opacity: {
      delay: 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const dialogInitialState = {
  opacity: 0,
  filter: 'blur(10px)',
  z: -100,
  rotateY: 25,
  rotateX: 5,
  transformPerspective: 500,
  transition: {
    duration: 0.3,
    ease: [0.67, 0.17, 0.62, 0.64],
  },
}
</script>

<template>
  <Dialog :open="show" @close="closeModal" as="div" class="relative w-screen h-screen" :style="{ zIndex: Z_INDEX.MODAL }">
    <!-- 背景遮罩 -->
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
      class="fixed inset-0 backdrop-blur-sm bg-black/40" />
    <!-- 内容容器 -->
    <DialogPanel class="fixed inset-0 w-60vw mx-auto"> <!-- 改为全屏定位容器 -->
      <!-- 添加两层居中容器 -->
      <div class="absolute inset-0 flex items-center justify-center p-4 "> <!-- 外层响应式padding -->
        <motion.div class="modal-panel" :initial="dialogInitialState" :animate="dialogOpenState" :exit="{ opacity: 0 }"
          :style="{ transformPerspective: 500 }">
          <slot></slot>
        </motion.div>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<style scoped>
.modal-panel {
  /* 优化后的原子类 */
  @apply h-80vh w-full my-auto mx-auto
  /* 默认宽度 */
  max-w-[min(90vw, 800px)]
  /* 响应式最大宽度 */
  max-h-[min(80vh, 600px)]
  /* 响应式最大高度 */
  overflow-y-auto relative
  /* 确保内部定位基准 */
  shadow-xl rounded-2xl
  /* 圆角优化 */
  transform
  /* 启用变换 */
  translate-y-0;
  /* 修复可能存在的偏移 */

  /* 优化后的定位方式 */
  /* 双保险居中 */
}

/* 移动端优化 */
@media (max-width: 640px) {
  .modal-panel {
    @apply max-w-[95vw] rounded-lg;
  }
}

/* 滚动条优化 */
.modal-panel {
  scrollbar-gutter: stable;
  /* 防止内容跳动 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE */
}

.modal-panel::-webkit-scrollbar {
  @apply hidden;
  /* Chrome/Safari */
}
</style>
