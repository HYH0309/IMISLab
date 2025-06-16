<script setup lang="ts">
import ControlPanel from '@/components/sort/SortControlPanel.vue'
import SortStatus from '@/components/sort/SortStatus.vue'
import SortCanvas from '@/components/sort/SortCanvas.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useSortingStore } from '@/stores/sortStore'
import { onUnmounted } from 'vue'

const store = useSortingStore()

// 组件卸载时清理动画资源，防止内存泄漏
onUnmounted(() => {
  store.cleanup()
})
</script>

<template>
  <div class="m-1 p1">
    <ControlPanel />
    <hr />
    <SortStatus />
    <hr />
    <div class="flex-center">
      <SortCanvas class="h-full" />
    </div>


  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc"></component>
  </Modal>
</template>
