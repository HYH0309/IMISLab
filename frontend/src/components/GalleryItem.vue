<script setup lang="ts">
import { motion, useScroll, useTransform } from 'motion-v'
import { defineAsyncComponent, markRaw, ref } from 'vue'

const componentMap: Record<number, ReturnType<typeof markRaw>> = {
  1: markRaw(defineAsyncComponent(() => import('docs/era/era-information.md'))),
  2: markRaw(defineAsyncComponent(() => import('docs/era/era-pc.md'))),
  3: markRaw(defineAsyncComponent(() => import('docs/era/era-internet.md'))),
  4: markRaw(defineAsyncComponent(() => import('docs/era/era-mobile.md'))),
  5: markRaw(defineAsyncComponent(() => import('docs/era/era-ai.md'))),
}
const props = defineProps<{ id: number; title: string; imageUrl: string }>()
const emit = defineEmits(['submit'])
const targetRef = ref<HTMLElement | null>(null)
const { scrollYProgress } = useScroll({ target: targetRef })
const y = useTransform(scrollYProgress, [0, 1], [-300, 300])
const handleClick = () => emit('submit', componentMap[props.id])
</script>

<template>
  <section class="h-screen snap-center flex justify-center items-center relative">
    <div ref="targetRef"
      class="w-135 h-180 m-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:scale-105 shadow-lg hover:shadow-2xl active:shadow-none active:scale-95"
      @click="handleClick">
      <img :src="props.imageUrl" :alt="props.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
    </div>
    <motion.h2 :style="{ y }" class="gallery-title">
      {{ props.title }}
    </motion.h2>
  </section>
</template>

<style scoped>
.gallery-title {
  @apply m-0 font-sans font-extrabold tracking-[-3px] leading-[1.1] absolute inline-block select-none pointer-events-none left-[calc(50%+120px)] top-[calc(50%-40px)] color-emerald font-size-15;
}
</style>
