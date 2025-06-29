import CryptoJS from 'crypto-js'

// 类型定义
export interface SparkConfig {
  appId: string
  apiKey: string
  apiSecret: string
  version?: 'v1.1' | 'v2.1' | 'v3.1' | 'v3.5'
  domain?: string
  temperature?: number
  maxTokens?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface SparkResponse {
  header: {
    code: number
    message: string
    status: number
    sid: string
  }
  payload: {
    choices: {
      text: Array<{
        content: string
        role: string
        index: number
      }>
    }
  }
}

export interface SparkCallbacks {
  onMessage?: (content: string, fullResponse: SparkResponse) => void
  onComplete?: (fullContent: string, conversation: ChatMessage[]) => void
  onError?: (error: Error | string) => void
  onConnect?: () => void
  onClose?: () => void
  onStatusChange?: (
    status: 'init' | 'connecting' | 'connected' | 'streaming' | 'completed' | 'error',
  ) => void
}

export class SparkAIClient {
  private config: Required<SparkConfig>
  private ws: WebSocket | null = null
  private status: 'init' | 'connecting' | 'connected' | 'streaming' | 'completed' | 'error' = 'init'
  private currentContent = ''
  private conversation: ChatMessage[] = []
  private callbacks: SparkCallbacks

  constructor(config: SparkConfig, callbacks: SparkCallbacks = {}) {
    this.config = {
      appId: config.appId,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      version: config.version || 'v1.1',
      domain: config.domain || this.getDomainByVersion(config.version || 'v1.1'),
      temperature: config.temperature || 0.5,
      maxTokens: config.maxTokens || 1024,
    }
    this.callbacks = callbacks
  }

  private getDomainByVersion(version: string): string {
    const domainMap: Record<string, string> = {
      'v1.1': 'lite',
    }
    return domainMap[version] || 'lite'
  }

  private setStatus(status: typeof this.status) {
    this.status = status
    this.callbacks.onStatusChange?.(status)
  }

  private async getWebSocketUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const { apiKey, apiSecret, version } = this.config
        const url = `wss://spark-api.xf-yun.com/${version}/chat`
        const host = 'spark-api.xf-yun.com'
        const date = new Date().toUTCString()
        const algorithm = 'hmac-sha256'
        const headers = 'host date request-line'
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /${version}/chat HTTP/1.1`
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        const authorization = btoa(authorizationOrigin)
        const finalUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`

        resolve(finalUrl)
      } catch (error) {
        reject(error)
      }
    })
  }

  private connectWebSocket(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.setStatus('connecting')
        const url = await this.getWebSocketUrl()

        if (!('WebSocket' in window)) {
          throw new Error('浏览器不支持WebSocket')
        }

        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
          this.setStatus('connected')
          this.callbacks.onConnect?.()
          this.sendMessage()
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onerror = () => {
          this.setStatus('error')
          const errorMsg = `WebSocket连接错误: ${url.replace('wss:', 'https:')}`
          this.callbacks.onError?.(errorMsg)
          reject(new Error(errorMsg))
        }

        this.ws.onclose = () => {
          this.callbacks.onClose?.()
          this.ws = null
        }
      } catch (error) {
        this.setStatus('error')
        this.callbacks.onError?.(error as Error)
        reject(error)
      }
    })
  }

  private sendMessage() {
    if (!this.ws) return

    const params = {
      header: {
        app_id: this.config.appId,
        uid: `user_${Date.now()}`,
      },
      parameter: {
        chat: {
          domain: this.config.domain,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        },
      },
      payload: {
        message: {
          text: this.conversation,
        },
      },
    }

    console.log('发送参数:', JSON.stringify(params, null, 2))
    this.ws.send(JSON.stringify(params))
  }

  private handleMessage(data: string) {
    try {
      const response: SparkResponse = JSON.parse(data)

      // 检查错误
      if (response.header.code !== 0) {
        this.setStatus('error')
        const errorMsg = `API错误: ${response.header.code} - ${response.header.message}`
        this.callbacks.onError?.(errorMsg)
        return
      }

      // 处理流式数据
      if (response.payload?.choices?.text?.[0]?.content) {
        const content = response.payload.choices.text[0].content
        this.currentContent += content
        this.setStatus('streaming')
        this.callbacks.onMessage?.(content, response)
      }

      // 检查是否完成
      if (response.header.status === 2) {
        this.setStatus('completed')

        // 添加AI回复到对话历史
        if (this.currentContent) {
          this.conversation.push({
            role: 'assistant',
            content: this.currentContent,
          })
        }

        this.callbacks.onComplete?.(this.currentContent, [...this.conversation])
        this.close()
      }
    } catch (error) {
      this.setStatus('error')
      this.callbacks.onError?.(error as Error)
    }
  }

  // 发送单个消息
  async sendUserMessage(content: string): Promise<void> {
    this.currentContent = ''

    // 添加用户消息到对话历史
    this.conversation.push({
      role: 'user',
      content,
    })

    await this.connectWebSocket()
  }

  // 发送多轮对话
  async sendConversation(messages: ChatMessage[]): Promise<void> {
    this.currentContent = ''
    this.conversation = [...messages]
    await this.connectWebSocket()
  }

  // 清空对话历史
  clearConversation() {
    this.conversation = []
    this.currentContent = ''
  }

  // 关闭连接
  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.setStatus('init')
  }

  // 获取当前状态
  getStatus() {
    return this.status
  }

  // 获取对话历史
  getConversation() {
    return [...this.conversation]
  }

  // 获取当前回复内容
  getCurrentContent() {
    return this.currentContent
  }
}

// 便捷函数：单次对话
export async function chatWithSpark(
  config: SparkConfig,
  message: string,
  callbacks?: SparkCallbacks,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new SparkAIClient(config, {
      ...callbacks,
      onComplete: (content) => {
        callbacks?.onComplete?.(content, client.getConversation())
        resolve(content)
      },
      onError: (error) => {
        callbacks?.onError?.(error)
        reject(error)
      },
    })

    client.sendUserMessage(message).catch(reject)
  })
}

// 便捷函数：多轮对话
export async function chatConversationWithSpark(
  config: SparkConfig,
  messages: ChatMessage[],
  callbacks?: SparkCallbacks,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new SparkAIClient(config, {
      ...callbacks,
      onComplete: (content) => {
        callbacks?.onComplete?.(content, client.getConversation())
        resolve(content)
      },
      onError: (error) => {
        callbacks?.onError?.(error)
        reject(error)
      },
    })

    client.sendConversation(messages).catch(reject)
  })
}
