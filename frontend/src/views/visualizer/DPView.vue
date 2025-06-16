<script setup lang="ts">
import DPControlPanel from '@/components/dp/DPControlPanel.vue'
import DPCanvas from '@/components/dp/DPCanvas.vue'
import DPStatus from '@/components/dp/DPStatus.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useDPStore } from '@/stores/dpStore'
import { onUnmounted } from 'vue'

const store = useDPStore()

// 组件卸载时清理动画资源，防止内存泄漏
onUnmounted(() => {
  store.cleanup()
})
</script>

<template>
  <div class="m-1 p-1">
    <DPControlPanel />
    <hr />
    <DPStatus />
    <hr />
    <DPCanvas class="h-full" />
  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc" />
  </Modal>
</template>
