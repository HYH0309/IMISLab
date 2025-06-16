import { ref, computed, watch, onUnmounted } from 'vue'

export interface CacheConfig {
  key: string
  ttl?: number // 缓存过期时间（毫秒）
  storage?: 'memory' | 'localStorage' | 'sessionStorage'
  enablePersist?: boolean
  maxSize?: number // 最大缓存项数量
}

export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
  accessCount: number
  lastAccess: number
}

class SmartCache {
  private cache = new Map<string, CacheItem<any>>()
  private timers = new Map<string, ReturnType<typeof setTimeout>>()
  private maxSize = 100

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  set<T>(key: string, data: T, ttl = 300000): void {
    // 默认5分钟
    // 如果缓存已满，移除最老的未访问项
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed()
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
      accessCount: 0,
      lastAccess: Date.now(),
    }

    this.cache.set(key, item)
    this.setExpiration(key, ttl)

    // 持久化到localStorage（如果数据不是太大）
    this.persistToStorage(key, item)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined

    if (!item) {
      // 尝试从localStorage恢复
      const restored = this.restoreFromStorage<T>(key)
      if (restored) {
        this.cache.set(key, restored)
        return restored.data
      }
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }

    // 更新访问统计
    item.accessCount++
    item.lastAccess = Date.now()

    return item.data
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }

    this.removeFromStorage(key)
    return this.cache.delete(key)
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.timers.clear()
    this.cache.clear()

    // 清理localStorage中的缓存
    this.clearStorage()
  }

  size(): number {
    return this.cache.size
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // 获取缓存统计信息
  getStats() {
    const items = Array.from(this.cache.values())
    const now = Date.now()

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalAccessCount: items.reduce((sum, item) => sum + item.accessCount, 0),
      averageAge:
        items.length > 0
          ? items.reduce((sum, item) => sum + (now - item.timestamp), 0) / items.length / 1000
          : 0,
      expiredCount: items.filter((item) => now - item.timestamp > item.ttl).length,
    }
  }

  private setExpiration(key: string, ttl: number): void {
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)

    this.timers.set(key, timer)
  }

  private evictLeastUsed(): void {
    let leastUsedKey = ''
    let leastUsedTime = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < leastUsedTime) {
        leastUsedTime = item.lastAccess
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.delete(leastUsedKey)
    }
  }

  private persistToStorage(key: string, item: CacheItem<any>): void {
    try {
      const serialized = JSON.stringify(item)
      // 只持久化小于100KB的数据
      if (serialized.length < 100 * 1024) {
        localStorage.setItem(`cache_${key}`, serialized)
      }
    } catch (error) {
      console.warn('缓存持久化失败:', error)
    }
  }

  private restoreFromStorage<T>(key: string): CacheItem<T> | null {
    try {
      const serialized = localStorage.getItem(`cache_${key}`)
      if (!serialized) return null

      const item = JSON.parse(serialized) as CacheItem<T>

      // 检查是否过期
      if (Date.now() - item.timestamp > item.ttl) {
        this.removeFromStorage(key)
        return null
      }

      return item
    } catch (error) {
      console.warn('缓存恢复失败:', error)
      return null
    }
  }

  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(`cache_${key}`)
    } catch (error) {
      console.warn('缓存清理失败:', error)
    }
  }

  private clearStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith('cache_'))
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.warn('批量缓存清理失败:', error)
    }
  }
}

// 全局缓存实例
const globalCache = new SmartCache(200)

/**
 * 智能数据缓存组合式函数
 */
export function useSmartCache<T = any>(config: CacheConfig) {
  const {
    key,
    ttl = 300000, // 5分钟默认TTL
    storage = 'memory',
    enablePersist = true,
    maxSize = 100,
  } = config

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // 缓存键前缀
  const cacheKey = `${key}_${storage}`

  // 获取缓存数据
  const getCached = (): T | null => {
    return globalCache.get<T>(cacheKey)
  }

  // 设置缓存数据
  const setCached = (data: T): void => {
    globalCache.set(cacheKey, data, ttl)
    lastUpdated.value = new Date()
  }

  // 检查缓存是否存在且有效
  const isCached = computed(() => globalCache.has(cacheKey))

  // 缓存状态信息
  const cacheInfo = computed(() => {
    const item = globalCache.get(cacheKey)
    if (!item) return null

    const age = Date.now() - (item as any).timestamp
    const remaining = ttl - age

    return {
      age: Math.round(age / 1000), // 秒
      remaining: Math.round(remaining / 1000), // 秒
      accessCount: (item as any).accessCount || 0,
      isExpired: remaining <= 0,
    }
  })

  // 异步数据获取函数包装器
  const fetchWithCache = async <R = T>(
    fetcher: () => Promise<R>,
    options: {
      forceRefresh?: boolean
      backgroundRefresh?: boolean
      onError?: (error: Error) => void
    } = {},
  ): Promise<R> => {
    const { forceRefresh = false, backgroundRefresh = false, onError } = options

    // 如果有缓存且不强制刷新，直接返回缓存
    if (!forceRefresh && isCached.value) {
      const cached = getCached() as R

      // 后台刷新模式：返回缓存数据的同时在后台更新
      if (backgroundRefresh) {
        fetcher()
          .then((data) => setCached(data as unknown as T))
          .catch((err) => onError?.(err))
      }

      return cached
    }

    // 开始加载
    isLoading.value = true
    error.value = null

    try {
      const data = await fetcher()
      setCached(data as unknown as T)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '数据获取失败'
      error.value = errorMessage
      onError?.(err as Error)

      // 如果有缓存，在错误时返回缓存数据
      const cached = getCached()
      if (cached) {
        console.warn('数据获取失败，返回缓存数据:', errorMessage)
        return cached as R
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 手动刷新缓存
  const refresh = async <R = T>(fetcher: () => Promise<R>): Promise<R> => {
    return fetchWithCache(fetcher, { forceRefresh: true })
  }

  // 清除缓存
  const clearCache = (): void => {
    globalCache.delete(cacheKey)
    lastUpdated.value = null
  }

  // 预加载数据
  const preload = async <R = T>(fetcher: () => Promise<R>): Promise<void> => {
    if (!isCached.value) {
      try {
        await fetchWithCache(fetcher)
      } catch (error) {
        console.warn('数据预加载失败:', error)
      }
    }
  }

  // 缓存统计信息
  const stats = computed(() => globalCache.getStats())

  // 组件卸载时的清理
  onUnmounted(() => {
    // 可选：清理特定缓存
    // clearCache()
  })

  return {
    // 状态
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isCached,
    lastUpdated: computed(() => lastUpdated.value),
    cacheInfo,
    stats,

    // 方法
    getCached,
    setCached,
    fetchWithCache,
    refresh,
    clearCache,
    preload,

    // 工具方法
    invalidate: clearCache, // 别名
    warmup: preload, // 别名
  }
}

/**
 * 创建缓存管理器
 */
export function createCacheManager() {
  return {
    // 全局缓存操作
    clear: () => globalCache.clear(),
    size: () => globalCache.size(),
    keys: () => globalCache.keys(),
    stats: () => globalCache.getStats(),

    // 批量操作
    clearByPattern: (pattern: string) => {
      const keys = globalCache.keys().filter((key) => key.includes(pattern))
      keys.forEach((key) => globalCache.delete(key))
      return keys.length
    },

    // 清理过期缓存
    cleanup: () => {
      const keys = globalCache.keys()
      let cleaned = 0

      keys.forEach((key) => {
        if (!globalCache.has(key)) {
          cleaned++
        }
      })

      return cleaned
    },
  }
}

// 导出缓存管理器实例
export const cacheManager = createCacheManager()

// 开发环境下暴露到window对象方便调试
if (import.meta.env.DEV) {
  ;(window as any).__cache__ = {
    globalCache,
    manager: cacheManager,
  }
}
