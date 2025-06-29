<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useMotion } from '@vueuse/motion'
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    SparklesIcon
} from '@heroicons/vue/24/outline'
import { Z_INDEX } from '@/config/z-index'
import AiBubble from '@/components/common/AiBubble.vue'
import { useSparkAIBubble } from '@/composables/useSparkAIBubble'

// 组件状态
const isOpen = ref(false)

// DOM 引用
const toggleButtonRef = ref<HTMLButtonElement>()
const assistantPanelRef = ref<HTMLDivElement>()

// 星火AI配置
const sparkConfig = {
    appId: 'd4d657d4', // 替换为您的真实APPID
    apiKey: '5d4a1f777bea6db99ff2541fd6e7f836', // 替换为您的真实API Key
    apiSecret: 'Njg1OGY1Y2EzNzAyMjY4OTVmNjY2NTY3', // 替换为您的真实API Secret
    version: 'v1.1' as const,
    temperature: 0.7,
    maxTokens: 2048,
    // 系统提示词 - 定义AI的角色和行为
    systemPrompt: '你是小王，一位专门负责IMIS（信息管理与信息系统）专业学生答疑的助手。你熟悉信息管理、数据库、系统分析与设计、编程技术、数据挖掘等相关课程内容。请用友善、耐心的态度帮助学生解答学习中遇到的问题，提供准确的专业指导和学习建议。'
}

// 使用星火AI聊天功能
const {
    messages,
    isLoading,
    generationProgress,
    handleSendMessage,
    handleCopyMessage,
    clearMessages,
    initWithWelcomeMessage
} = useSparkAIBubble(sparkConfig)

// 计算属性
const hasNewMessages = computed(() => messages.value.length > 1)

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
        x: -20
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
        x: -20,
        transition: { duration: 200 }
    }
})

// 切换面板显示状态
const togglePanel = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        // 初始化欢迎消息（如果还没有消息的话）
        if (messages.value.length === 0) {
            initWithWelcomeMessage()
        }
        nextTick(() => {
            panelMotion.apply('enter')
        })
    } else {
        panelMotion.apply('leave')
    }
}

// 清空对话并重新初始化
const handleClearMessages = () => {
    clearMessages()
    initWithWelcomeMessage()
}
</script>

<template>
    <!-- 紧凑切换按钮 -->
    <button ref="toggleButtonRef" @click="togglePanel"
        class="fixed bottom-5 left-5 p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center justify-center w-12 h-12 hover:shadow-xl transition-all duration-300 hover:scale-105"
        :style="{ zIndex: Z_INDEX.AI_ASSISTANT }" :aria-label="isOpen ? 'Close AI Assistant' : 'Open AI Assistant'"
        :title="isOpen ? '关闭AI助手' : '打开AI助手'">
        <div class="flex items-center justify-center transition-transform duration-200">
            <XMarkIcon v-if="isOpen" class="w-5 h-5" />
            <ChatBubbleLeftRightIcon v-else class="w-5 h-5" />
        </div>

        <!-- 新消息指示器 -->
        <div v-if="!isOpen && hasNewMessages"
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white">
        </div>
    </button>

    <!-- AI助手面板 -->
    <div v-if="isOpen" ref="assistantPanelRef"
        class="fixed bottom-20 left-5 w-80 h-[450px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/10 flex flex-col overflow-hidden"
        :style="{ zIndex: Z_INDEX.AI_ASSISTANT }">
        <!-- 超紧凑头部 -->
        <div
            class="flex items-center justify-between px-2.5 py-1.5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30">
            <!-- 左侧：AI图标 + 名称 -->
            <div class="flex items-center gap-1.5">
                <div
                    class="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <SparklesIcon class="w-2.5 h-2.5 text-white" />
                </div>
                <h3 class="font-medium text-xs text-gray-900 dark:text-gray-100">小王助手</h3>
                <div v-if="isLoading" class="flex items-center gap-0.5 text-xs">
                    <span class="text-gray-600 dark:text-gray-400 text-xs animate-pulse">
                        思考中
                    </span>
                </div>
            </div>

            <!-- 右侧：操作按钮 -->
            <div class="flex items-center gap-0.5">
                <button @click="handleClearMessages"
                    class="px-1 py-0.5 text-xs text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                    title="清空对话">
                    清空
                </button>
            </div>
        </div>

        <!-- 进度条 -->
        <div v-if="generationProgress > 0" class="h-0.5 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
            <!-- 主进度条 -->
            <div class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
                :style="{ width: `${generationProgress}%` }">
                <!-- 光泽效果 -->
                <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer">
                </div>
            </div>
        </div>

        <!-- AI聊天组件 -->
        <div class="flex-1 overflow-hidden">
            <AiBubble :messages="messages" :is-loading="isLoading" :enable-streaming="true" height="100%"
                @send-message="handleSendMessage" @copy-message="handleCopyMessage" />
        </div>
    </div>
</template>

<style scoped>
/* 进度条光泽动画 */
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(200%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}

/* 组件已经简化，大部分样式由 AiBubble 组件处理 */
</style>
