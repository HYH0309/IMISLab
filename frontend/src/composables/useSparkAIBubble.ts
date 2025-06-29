// AiBubble 组件与星火大模型集成适配器

import { ref } from 'vue'
import {
  SparkAIClient,
  type SparkConfig,
  type ChatMessage as SparkChatMessage,
} from '@/utils/sparkAI'
import type { Message } from '@/components/common/AiBubble.vue'

export interface SparkAIBubbleConfig extends SparkConfig {
  enableAutoScroll?: boolean
  enableTypingEffect?: boolean
  systemPrompt?: string // 系统提示词
}

export function useSparkAIBubble(config: SparkAIBubbleConfig) {
  // 响应式状态
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const currentStreamingMessage = ref<Message | null>(null)
  const generationProgress = ref(0) // AI生成进度 0-100

  // 系统提示词配置
  const systemPrompt = config.systemPrompt || ''

  let sparkClient: SparkAIClient | null = null
  let messageIdCounter = 1
  let progressTimer: NodeJS.Timeout | null = null

  // 启动进度条模拟
  const startProgressSimulation = () => {
    if (progressTimer) {
      clearInterval(progressTimer)
    }

    generationProgress.value = 0
    progressTimer = setInterval(() => {
      if (generationProgress.value < 20) {
        // 初始阶段较快增长
        generationProgress.value += Math.random() * 8 + 2
      } else if (generationProgress.value < 60) {
        // 中间阶段稳定增长
        generationProgress.value += Math.random() * 3 + 1
      } else if (generationProgress.value < 80) {
        // 后期阶段减缓
        generationProgress.value += Math.random() * 1.5 + 0.5
      }

      // 限制最大值，避免在实际完成前到达100%
      if (generationProgress.value >= 85) {
        generationProgress.value = 85
        if (progressTimer) {
          clearInterval(progressTimer)
          progressTimer = null
        }
      }
    }, 200) // 每200ms更新一次
  }

  // 停止进度条模拟
  const stopProgressSimulation = () => {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }

  // 初始化星火AI客户端
  const initSparkClient = () => {
    sparkClient = new SparkAIClient(config, {
      onConnect: () => {
        console.log('星火AI连接成功')
      },

      onMessage: (content: string) => {
        // 处理流式消息
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.content += content
          currentStreamingMessage.value.isStreaming = true
          currentStreamingMessage.value.isLoading = false

          // 根据内容长度更新进度
          const currentLength = currentStreamingMessage.value.content.length
          const estimatedMaxLength = 800 // 估算最大长度
          const contentProgress = Math.min(90, (currentLength / estimatedMaxLength) * 90)

          // 结合模拟进度和内容进度
          generationProgress.value = Math.max(generationProgress.value, contentProgress)

          console.log('收到流式内容:', content)
        }
      },

      onComplete: (fullContent: string, conversation: SparkChatMessage[]) => {
        // 流式消息完成
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.isStreaming = false
          currentStreamingMessage.value.isLoading = false
          currentStreamingMessage.value = null
        }
        isLoading.value = false

        // 完成进度动画
        stopProgressSimulation()
        generationProgress.value = 100
        setTimeout(() => {
          generationProgress.value = 0
        }, 800) // 800ms后重置进度条

        console.log('对话完成:', fullContent)
        console.log('完整对话历史:', conversation)
      },

      onError: (error) => {
        console.error('星火AI错误:', error)
        isLoading.value = false

        // 重置进度条
        stopProgressSimulation()
        generationProgress.value = 0

        // 添加错误消息
        const errorMessage: Message = {
          id: generateMessageId(),
          content: `抱歉，发生了错误：${error}`,
          isUser: false,
          timestamp: new Date(),
          isLoading: false,
        }
        messages.value.push(errorMessage)

        if (currentStreamingMessage.value) {
          // 移除失败的流式消息
          const index = messages.value.findIndex((m) => m.id === currentStreamingMessage.value?.id)
          if (index !== -1) {
            messages.value.splice(index, 1)
          }
          currentStreamingMessage.value = null
        }
      },

      onClose: () => {
        console.log('星火AI连接关闭')
      },

      onStatusChange: (status) => {
        switch (status) {
          case 'connecting':
          case 'streaming':
            isLoading.value = true
            break
          case 'completed':
          case 'error':
          case 'init':
            isLoading.value = false
            break
        }
      },
    })
  }

  // 生成消息ID
  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${messageIdCounter++}`
  }

  // 处理发送消息
  const handleSendMessage = async (content: string) => {
    if (!sparkClient) {
      initSparkClient()
    }

    // 添加用户消息
    const userMessage: Message = {
      id: generateMessageId(),
      content,
      isUser: true,
      timestamp: new Date(),
      isLoading: false,
    }
    messages.value.push(userMessage)

    // 创建AI流式回复消息
    const aiMessage: Message = {
      id: generateMessageId(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
      isStreaming: true,
    }
    messages.value.push(aiMessage)
    currentStreamingMessage.value = aiMessage

    // 发送到星火AI，如果有系统提示词则在首次对话时添加
    try {
      isLoading.value = true

      // 开始进度条模拟
      startProgressSimulation()

      let fullContent = content
      if (systemPrompt && sparkClient) {
        const conversation = sparkClient.getConversation()
        if (conversation.length === 0) {
          fullContent = `[系统设定: ${systemPrompt}]\n\n${content}`
        }
      }

      await sparkClient!.sendUserMessage(fullContent)
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }

  // 处理复制消息
  const handleCopyMessage = (messageId: string, content: string) => {
    console.log(`复制消息 ${messageId}:`, content)
    // 这里可以添加复制成功的提示
  }

  // 清空对话历史
  const clearMessages = () => {
    messages.value = []
    if (sparkClient) {
      sparkClient.clearConversation()
    }
    currentStreamingMessage.value = null

    // 重置进度条
    stopProgressSimulation()
    generationProgress.value = 0
  }

  // 添加系统消息
  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: generateMessageId(),
      content,
      isUser: false,
      timestamp: new Date(),
      isLoading: false,
    }
    messages.value.push(systemMessage)
  }

  // 获取对话历史（星火AI格式）
  const getSparkConversation = (): SparkChatMessage[] => {
    return messages.value
      .filter((msg) => !msg.isLoading && msg.content.trim())
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }))
  }

  // 设置预定义对话
  const setConversationHistory = (history: SparkChatMessage[]) => {
    messages.value = history.map((msg) => ({
      id: generateMessageId(),
      content: msg.content,
      isUser: msg.role === 'user',
      timestamp: new Date(),
      isLoading: false,
    }))

    if (sparkClient) {
      sparkClient.clearConversation()
      // 这里可以将历史对话设置到sparkClient中
    }
  }

  // 初始化默认消息
  const initWithWelcomeMessage = () => {
    addSystemMessage(
      '你好！我是小王，IMIS专业的学习助手。无论是课程问题、作业疑难，还是专业知识的答疑，我都很乐意帮助你！有什么问题可以随时问我哦~ 📚',
    )
  }

  return {
    // 状态
    messages,
    isLoading,
    generationProgress, // 进度条状态

    // 方法
    handleSendMessage,
    handleCopyMessage,
    clearMessages,
    addSystemMessage,
    setConversationHistory,
    getSparkConversation,
    initWithWelcomeMessage,

    // 内部方法（可选暴露）
    initSparkClient,
  }
}
