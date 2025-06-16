<script setup lang="ts">
import { ref } from 'vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useFormatDate } from '@/composables/useFormatDate'
import type { ArticleSummary, Tag } from '@/types/api'

const props = defineProps<{
  article: ArticleSummary
  selected?: boolean
  tags?: Tag[] // 添加tags prop
}>()

const emit = defineEmits(['update:selected', 'delete'])
const isDeleteModalOpen = ref(false)

// 根据tagIds获取标签名称
const getTagNames = (tagIds: number[]) => {
  if (!props.tags) return []
  return tagIds.map(id => {
    const tag = props.tags!.find(t => t.id === id)
    return tag ? tag.name : ''
  }).filter(Boolean)
}

const handleDelete = () => {
  emit('delete', props.article.id)
  isDeleteModalOpen.value = false
}

const toggleSelect = (checked: boolean) => {
  emit('update:selected', checked)
}

const { formatDate } = useFormatDate()
</script>

<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap">
      <input type="checkbox" class="h-4 w-4" :checked="selected"
        @change="(e) => toggleSelect((e.target as HTMLInputElement).checked)" />
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      {{ article.title }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex flex-wrap gap-1">
        <span v-for="tag in getTagNames(article.tagIds)" :key="tag"
          class="tag-item text-success bg-success/10 hover:bg-success/20">
          {{ tag }}
        </span>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-500">
      {{ formatDate(article.createdAt) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button @click="(e: MouseEvent) => { e.preventDefault(); isDeleteModalOpen = true }"
        :tabindex="isDeleteModalOpen ? -1 : 0"
        class="p-2 bg-purple-50 rounded-md text-red-600 hover:bg-purple-100 hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
        aria-label="删除文章">
        <TrashIcon class="h-5 w-5" aria-hidden="true" />
      </button>

      <TransitionRoot appear :show="isDeleteModalOpen" as="template">
        <Dialog as="div" @close="isDeleteModalOpen = false" class="relative" :style="{ zIndex: 70 }">
          <!-- Modal level -->
          <TransitionChild enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
            leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black/25"></div>
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95">
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                    删除确认
                  </DialogTitle>
                  <div class="mt-4">
                    <p class="text-sm text-gray-500">确定要永久删除这篇文章吗？此操作不可撤销。</p>
                  </div>

                  <div class="mt-6 flex justify-end gap-3">
                    <button type="button" class="btn bg-gray-100 hover:bg-gray-200" @click="isDeleteModalOpen = false">
                      取消
                    </button>
                    <button type="button" class="btn bg-red-500 text-white hover:bg-red-600"
                      @click="(e: MouseEvent) => { e.preventDefault(); handleDelete() }">
                      确认删除
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </td>
  </tr>
</template>

<style scoped>
.tag-item {
  @apply px-2 py-1 text-xs font-medium rounded-md transition-colors;
}
</style>
