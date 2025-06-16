<script setup lang="ts">
import SearchCanvas from '@/components/search/SearchCanvas.vue'
import ControlPanel from '@/components/search/SearchControlPanel.vue'
import SearchStatus from '@/components/search/SearchStatus.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useSearchStore } from '@/stores/searchStore'
import { onUnmounted } from 'vue'

const store = useSearchStore()

// 组件卸载时清理动画资源，防止内存泄漏
onUnmounted(() => {
  store.cleanup()
})
</script>

<template>
  <div class="m-1 p1">
    <ControlPanel />
    <hr />
    <SearchStatus />
    <hr />
    <SearchCanvas class="h-full flex-center" />
  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc" />
  </Modal>
</template>
