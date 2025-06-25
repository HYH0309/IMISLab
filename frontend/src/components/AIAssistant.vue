<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useMotion } from '@vueuse/motion'
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    UserIcon,
    CpuChipIcon
} from '@heroicons/vue/24/outline'
import { Z_INDEX } from '@/config/z-index'

interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

// 组件状态
const isOpen = ref(false)
const isTyping = ref(false)
const messages = ref<Message[]>([
    {
        id: '1',
        content: '你好！我是您的AI助手，有什么可以帮助您的吗？',
        isUser: false,
        timestamp: new Date()
    }
])
const inputMessage = ref('')

// DOM 引用
const toggleButtonRef = ref<HTMLButtonElement>()
const assistantPanelRef = ref<HTMLDivElement>()
const messagesContainerRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()

// 计算属性
const hasMessages = computed(() => messages.value.length > 1)

// 动画配置
useMotion(toggleButtonRef, {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
})

const panelMotion = useMotion(assistantPanelRef, {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        x: 20
    },
    enter: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            duration: 300
        }
    },
    leave: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        x: 20,
        transition: { duration: 200 }
    }
})

// 切换面板显示状态
const togglePanel = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        nextTick(() => {
            scrollToBottom()
            inputRef.value?.focus()
        })
    }
}

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
        }
    })
}

// 发送消息
const sendMessage = async () => {
    const content = inputMessage.value.trim()
    if (!content) return

    // 添加用户消息
    const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date()
    }
    messages.value.push(userMessage)
    inputMessage.value = ''

    scrollToBottom()

    // 显示AI正在输入
    isTyping.value = true

    // 模拟AI响应（这里可以替换为实际的API调用）
    setTimeout(() => {
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: getAIResponse(content),
            isUser: false,
            timestamp: new Date()
        }
        messages.value.push(aiMessage)
        isTyping.value = false
        scrollToBottom()
    }, 1000 + Math.random() * 2000) // 1-3秒随机延迟
}

// 模拟AI响应（可以替换为实际的API调用）
const getAIResponse = (userMessage: string): string => {
    const responses = [
        '我理解您的问题，让我来帮助您解决。',
        '这是一个很好的问题！根据我的理解...',
        '我可以为您提供以下建议...',
        '基于您的描述，我认为...',
        '让我为您分析一下这个问题...',
        '这个问题涉及到几个方面，让我逐一解释...'
    ]

    if (userMessage.toLowerCase().includes('hello') || userMessage.includes('你好')) {
        return '你好！很高兴为您服务，请告诉我您需要什么帮助。'
    }

    if (userMessage.toLowerCase().includes('help') || userMessage.includes('帮助')) {
        return '我是您的AI助手，可以帮助您解答问题、提供建议、协助编程等。请告诉我您的具体需求！'
    }

    return responses[Math.floor(Math.random() * responses.length)]
}

// 处理回车键发送
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
    }
}

// 清空对话
const clearMessages = () => {
    messages.value = [messages.value[0]] // 保留欢迎消息
}

// 监听面板状态变化
watch(isOpen, (newVal) => {
    if (newVal) {
        panelMotion.apply('enter')
    } else {
        panelMotion.apply('leave')
    }
})
</script>

<template>
    <!-- 切换按钮 -->
    <button ref="toggleButtonRef" @click="togglePanel"
        class="fixed bottom-5 right-5 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center justify-center w-14 h-14 hover:shadow-xl transition-shadow duration-300"
        :style="{ zIndex: Z_INDEX.AI_ASSISTANT }" :aria-label="isOpen ? 'Close AI Assistant' : 'Open AI Assistant'"
        :title="isOpen ? '关闭AI助手' : '打开AI助手'">
        <div class="flex items-center justify-center transition-transform duration-200">
            <XMarkIcon v-if="isOpen" class="w-6 h-6" />
            <ChatBubbleLeftRightIcon v-else class="w-6 h-6" />
        </div>

        <!-- 新消息指示器 -->
        <div v-if="!isOpen && hasMessages"
            class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
        </div>
    </button>

    <!-- AI助手面板 -->
    <div v-if="isOpen" ref="assistantPanelRef"
        class="fixed bottom-20 right-5 w-96 h-96 bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        :style="{ zIndex: Z_INDEX.AI_ASSISTANT }">
        <!-- 头部 -->
        <div
            class="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <SparklesIcon class="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 class="font-semibold text-foreground">AI 助手</h3>
                    <p class="text-xs text-muted-foreground">智能对话助手</p>
                </div>
            </div>
            <button @click="clearMessages"
                class="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm px-2 py-1 rounded hover:bg-muted"
                title="清空对话">
                清空
            </button>
        </div>

        <!-- 消息列表 -->
        <div ref="messagesContainerRef"
            class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div v-for="message in messages" :key="message.id" :class="[
                'flex gap-3',
                message.isUser ? 'justify-end' : 'justify-start'
            ]">
                <!-- AI头像 -->
                <div v-if="!message.isUser"
                    class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <CpuChipIcon class="w-4 h-4 text-white" />
                </div>

                <!-- 消息气泡 -->
                <div :class="[
                    'max-w-[80%] p-3 rounded-2xl text-sm',
                    message.isUser
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                ]">
                    {{ message.content }}
                </div>

                <!-- 用户头像 -->
                <div v-if="message.isUser"
                    class="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <UserIcon class="w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            <!-- 正在输入指示器 -->
            <div v-if="isTyping" class="flex gap-3 justify-start">
                <div
                    class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <CpuChipIcon class="w-4 h-4 text-white" />
                </div>
                <div class="bg-muted text-foreground p-3 rounded-2xl rounded-bl-sm">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="p-4 border-t border-border bg-muted/30">
            <div class="flex gap-2">
                <input ref="inputRef" v-model="inputMessage" @keypress="handleKeyPress" type="text"
                    placeholder="输入消息..."
                    class="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    :disabled="isTyping" />
                <button @click="sendMessage" :disabled="!inputMessage.trim() || isTyping"
                    class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200">
                    <PaperAirplaneIcon class="w-4 h-4" />
                </button>
            </div>
            <p class="text-xs text-muted-foreground mt-2 text-center">
                按 Enter 发送消息
            </p>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-thin {
    scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted));
    border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--muted-foreground));
}
</style>
