<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { ClipboardIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'

// 接口定义
export interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
    isLoading?: boolean
    isStreaming?: boolean  // 新增：标识是否为流式消息
}

interface Props {
    messages?: Message[]
    isLoading?: boolean
    height?: string
    enableStreaming?: boolean  // 新增：是否启用流式功能
}

const props = withDefaults(defineProps<Props>(), {
    messages: () => [],
    isLoading: false,
    height: '85vh',
    enableStreaming: false
})

// 固定配置
const showActions = true
const userAvatar = 'https://dummyimage.com/128x128/363536/ffffff&text=U'
const aiAvatar = 'https://dummyimage.com/128x128/354ea1/ffffff&text=AI'
const placeholder = '请输入您的问题...'

// 事件定义
const emit = defineEmits<{
    'send-message': [content: string]
    'copy-message': [messageId: string, content: string]
}>()

// 响应式数据
const inputContent = ref('')
const copiedMessageId = ref<string | null>(null)
const messagesContainer = ref<HTMLDivElement>()  // 消息容器引用

// 计算属性
const displayMessages = computed(() => {
    const msgs = [...props.messages]
    if (props.isLoading) {
        msgs.push({
            id: 'loading',
            content: '...',
            isUser: false,
            timestamp: new Date(),
            isLoading: true
        })
    }
    return msgs
})

// 方法
const sendMessage = () => {
    const content = inputContent.value.trim()
    if (!content) return

    emit('send-message', content)
    inputContent.value = ''

    // 发送消息后自动滚动到底部
    scrollToBottom()
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
    }
}

const copyMessage = async (messageId: string, content: string) => {
    try {
        await navigator.clipboard.writeText(content)
        copiedMessageId.value = messageId
        emit('copy-message', messageId, content)

        setTimeout(() => {
            copiedMessageId.value = null
        }, 2000)
    } catch (error) {
        console.error('复制失败:', error)
    }
}

const formatContent = (content: string) => {
    return content.replace(/\n/g, '<br>')
}

// 自动滚动到底部
const scrollToBottom = (smooth = true) => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTo({
                top: messagesContainer.value.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            })
        }
    })
}

// 监听消息变化，自动滚动
watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })

// 监听流式消息内容变化
watch(() => props.messages.find(msg => msg.isStreaming)?.content, () => {
    scrollToBottom()
})
</script>

<template>
    <div class="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        :style="{ height: props.height }">
        <!-- 紧凑状态栏 -->
        <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <!-- 加载状态 -->
                    <div v-if="props.isLoading" class="flex items-center gap-1">
                        <div class="flex gap-0.5">
                            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms">
                            </div>
                            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms">
                            </div>
                            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms">
                            </div>
                        </div>
                        <span class="text-gray-500">思考中</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 消息列表区域 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-2">
            <div class="space-y-2">
                <div v-for="message in displayMessages" :key="message.id" class="flex gap-2"
                    :class="{ 'flex-row-reverse': message.isUser }">
                    <!-- 头像 -->
                    <img :src="message.isUser ? userAvatar : aiAvatar" class="w-6 h-6 rounded-full flex-shrink-0 mt-1"
                        :alt="message.isUser ? 'User Avatar' : 'AI Avatar'" />

                    <!-- 消息气泡 -->
                    <div class="max-w-[75%] px-3 py-2 rounded-lg text-sm" :class="[
                        message.isUser
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                    ]">
                        <!-- 加载状态 -->
                        <div v-if="message.isLoading" class="flex items-center gap-2 text-gray-500">
                            <div class="flex gap-0.5">
                                <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                    style="animation-delay: 0ms"></div>
                                <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                    style="animation-delay: 150ms"></div>
                                <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                    style="animation-delay: 300ms"></div>
                            </div>
                            <span>正在思考...</span>
                        </div>

                        <!-- 流式消息 -->
                        <div v-else-if="message.isStreaming" class="relative">
                            <span v-html="formatContent(message.content)"></span>
                            <span class="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"
                                style="animation-duration: 1s;"></span>
                        </div>

                        <!-- 普通消息 -->
                        <div v-else v-html="formatContent(message.content)"></div>
                    </div>

                    <!-- 操作按钮 -->
                    <div v-if="showActions && !message.isUser && !message.isLoading" class="flex items-start mt-1">
                        <button @click="copyMessage(message.id, message.content)"
                            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            :class="{ 'text-green-500': copiedMessageId === message.id }"
                            :title="copiedMessageId === message.id ? '已复制' : '复制'">
                            <ClipboardIcon class="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2">
            <form @submit.prevent="sendMessage" class="flex gap-2">
                <textarea v-model="inputContent" @keydown="handleKeyPress"
                    class="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[36px] max-h-20"
                    :placeholder="placeholder" rows="1" required></textarea>

                <button type="submit" :disabled="!inputContent.trim()"
                    class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                    title="发送消息">
                    <PaperAirplaneIcon class="w-4 h-4" />
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* 自定义动画样式 */
@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-3px);
    }

    60% {
        transform: translateY(-1px);
    }
}

.animate-bounce {
    animation: bounce 1s infinite;
}

/* 流式消息光标动画 */
@keyframes pulse {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}

.animate-pulse {
    animation: pulse 1s infinite;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
}

/* 文本自动换行 */
div[v-html] {
    word-wrap: break-word;
    word-break: break-word;
}
</style>