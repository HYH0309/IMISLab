<script setup lang="ts">
import { motion, useScroll, useSpring } from 'motion-v'
import GalleryItem from '@/components/GalleryItem.vue'
import Modal from '@/components/composable/BaseModal.vue';
import { ref, Teleport } from 'vue';

const titleMap: Record<number, string> = {
  1: '信息革命初期',
  2: '个人计算机时代',
  3: ' 互联网时代',
  4: '移动互联网时代 ',
  5: ' AI觉醒时代'
}

const imageMap: Record<number, string> = {
  1: '/gallery/1.png',
  2: '/gallery/2.png',
  3: '/gallery/3.png',
  4: '/gallery/4.png',
  5: '/gallery/5.png'
}

// 创建容器引用用于监控滚动
const galleryContainerRef = ref<HTMLElement | null>(null)

// 监听整个页面的滚动进度
const { scrollYProgress } = useScroll()

// 使用 useSpring 添加弹性效果
const scaleX = useSpring(scrollYProgress)

// 创建进度条样式对象
const progressBarStyle = {
  scaleX,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "4px",
  originX: 0,
  backgroundColor: "#10b981",
  zIndex: 9999
}

const show = ref<boolean>(false)
const currentComponent = ref(null)
</script>
<template>
  <div class="gallery-view-wrapper">
    <div ref="galleryContainerRef" class="gallery-container">
      <div class="w-full">
        <GalleryItem v-for="image in [1, 2, 3, 4, 5]" :key="image" :id="image" :title="titleMap[image]"
          :imageUrl="imageMap[image]" @submit="show = true; currentComponent = $event" />
      </div>
      <Modal :show="show" @close-show="show = false">
        <component :is="currentComponent"></component>
      </Modal>
    </div>

    <!-- 使用 Teleport 将进度条移到 body，确保不受父容器影响 -->
    <Teleport to="body">
      <motion.div :style="progressBarStyle" />
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-view-wrapper {
  @apply w-full h-full;
  /* 包装器不影响布局，只是为了满足 Transition 的要求 */
}

.gallery-container {
  @apply w-full bg-gradient-to-br from-teal-100 via-sky-50 to-white dark:from-gray-900 dark:via-sky-950 dark:to-gray-800 transition-colors duration-500;
  /* 移除 flex center，让内容自然流动产生滚动 */
}
</style>
