import { ref, computed } from 'vue'

export interface ExportFormat {
  id: string
  name: string
  extension: string
  mimeType: string
  description?: string
}

export interface ExportField {
  key: string
  label: string
  type?: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  formatter?: (value: any, item: any) => string
  required?: boolean
}

export interface ExportOptions {
  format: ExportFormat
  fields: ExportField[]
  filename?: string
  includeHeaders?: boolean
  dateFormat?: string
  encoding?: string
}

/**
 * 数据导出组合式函数
 */
export function useDataExport<T = any>() {
  const isExporting = ref(false)
  const exportProgress = ref({
    current: 0,
    total: 0,
    stage: 'preparing' as 'preparing' | 'processing' | 'generating' | 'downloading',
  })

  // 支持的导出格式
  const supportedFormats: ExportFormat[] = [
    {
      id: 'json',
      name: 'JSON',
      extension: 'json',
      mimeType: 'application/json',
      description: '结构化数据格式，适合程序处理',
    },
    {
      id: 'csv',
      name: 'CSV',
      extension: 'csv',
      mimeType: 'text/csv',
      description: '逗号分隔格式，可用Excel打开',
    },
    {
      id: 'xlsx',
      name: 'Excel',
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      description: 'Excel工作簿格式',
    },
    {
      id: 'xml',
      name: 'XML',
      extension: 'xml',
      mimeType: 'application/xml',
      description: 'XML文档格式',
    },
  ]

  // 格式化值
  const formatValue = (value: any, field: ExportField, item: T): string => {
    if (field.formatter) {
      return field.formatter(value, item)
    }

    if (value === null || value === undefined) {
      return ''
    }

    switch (field.type) {
      case 'date':
        if (value instanceof Date) {
          return value.toISOString()
        }
        if (typeof value === 'string' || typeof value === 'number') {
          return new Date(value).toISOString()
        }
        return String(value)

      case 'array':
        return Array.isArray(value) ? value.join('; ') : String(value)

      case 'object':
        return typeof value === 'object' ? JSON.stringify(value) : String(value)

      case 'boolean':
        return value ? '是' : '否'

      case 'number':
        return typeof value === 'number' ? value.toString() : String(value)

      default:
        return String(value)
    }
  }

  // 生成文件名
  const generateFilename = (options: ExportOptions, itemCount: number): string => {
    if (options.filename) {
      return `${options.filename}.${options.format.extension}`
    }

    const timestamp = new Date().toISOString().split('T')[0]
    return `export_${itemCount}items_${timestamp}.${options.format.extension}`
  }

  // JSON导出
  const exportAsJSON = (data: T[], options: ExportOptions): string => {
    const processedData = data.map((item) => {
      const result: Record<string, any> = {}

      options.fields.forEach((field) => {
        const value = getNestedValue(item, field.key)
        result[field.label || field.key] =
          field.type === 'object' ? value : formatValue(value, field, item)
      })

      return result
    })

    return JSON.stringify(processedData, null, 2)
  }

  // CSV导出
  const exportAsCSV = (data: T[], options: ExportOptions): string => {
    const lines: string[] = []

    // 添加标题行
    if (options.includeHeaders !== false) {
      const headers = options.fields.map((field) => `"${field.label || field.key}"`)
      lines.push(headers.join(','))
    }

    // 添加数据行
    data.forEach((item) => {
      const values = options.fields.map((field) => {
        const value = getNestedValue(item, field.key)
        const formatted = formatValue(value, field, item)
        return `"${formatted.replace(/"/g, '""')}"`
      })
      lines.push(values.join(','))
    })

    return lines.join('\n')
  }

  // XML导出
  const exportAsXML = (data: T[], options: ExportOptions): string => {
    const xmlEscape = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }

    const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<data>']

    data.forEach((item) => {
      lines.push('  <item>')

      options.fields.forEach((field) => {
        const value = getNestedValue(item, field.key)
        const formatted = formatValue(value, field, item)
        const tagName = (field.label || field.key).replace(/\s+/g, '_').toLowerCase()
        lines.push(`    <${tagName}>${xmlEscape(formatted)}</${tagName}>`)
      })

      lines.push('  </item>')
    })

    lines.push('</data>')
    return lines.join('\n')
  }

  // Excel导出（基础版本，实际项目中可能需要使用库如 xlsx）
  const exportAsExcel = (data: T[], options: ExportOptions): string => {
    // 这里返回CSV格式，实际项目中应该使用专门的Excel库
    return exportAsCSV(data, options)
  }

  // 获取嵌套属性值
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  // 主导出函数
  const exportData = async (
    data: T[],
    options: ExportOptions,
    onProgress?: (progress: { current: number; total: number; stage: string }) => void,
  ): Promise<void> => {
    try {
      isExporting.value = true
      exportProgress.value = {
        current: 0,
        total: data.length,
        stage: 'preparing',
      }

      onProgress?.(exportProgress.value)

      // 验证必需字段
      const missingFields = options.fields.filter(
        (field) =>
          field.required &&
          data.some((item) => {
            const value = getNestedValue(item, field.key)
            return value === null || value === undefined || value === ''
          }),
      )

      if (missingFields.length > 0) {
        throw new Error(`缺少必需字段: ${missingFields.map((f) => f.label || f.key).join(', ')}`)
      }

      exportProgress.value.stage = 'processing'
      onProgress?.(exportProgress.value)

      let content: string

      // 根据格式生成内容
      switch (options.format.id) {
        case 'json':
          content = exportAsJSON(data, options)
          break
        case 'csv':
          content = exportAsCSV(data, options)
          break
        case 'xml':
          content = exportAsXML(data, options)
          break
        case 'xlsx':
          content = exportAsExcel(data, options)
          break
        default:
          throw new Error(`不支持的导出格式: ${options.format.id}`)
      }

      exportProgress.value.stage = 'generating'
      exportProgress.value.current = data.length
      onProgress?.(exportProgress.value)

      // 创建并下载文件
      exportProgress.value.stage = 'downloading'
      onProgress?.(exportProgress.value)

      const filename = generateFilename(options, data.length)
      await downloadFile(content, filename, options.format.mimeType)
    } catch (error) {
      console.error('导出失败:', error)
      throw error
    } finally {
      isExporting.value = false
      exportProgress.value = {
        current: 0,
        total: 0,
        stage: 'preparing',
      }
    }
  }

  // 下载文件
  const downloadFile = async (
    content: string,
    filename: string,
    mimeType: string,
  ): Promise<void> => {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8' })
    const url = URL.createObjectURL(blob)

    try {
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 添加延迟以确保下载开始
      await new Promise((resolve) => setTimeout(resolve, 100))
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  // 预览导出数据
  const previewExport = (data: T[], options: ExportOptions, maxRows = 5): string => {
    const preview = data.slice(0, maxRows)

    switch (options.format.id) {
      case 'json':
        return exportAsJSON(preview, options)
      case 'csv':
        return exportAsCSV(preview, options)
      case 'xml':
        return exportAsXML(preview, options)
      default:
        return exportAsJSON(preview, options)
    }
  }

  // 验证导出选项
  const validateOptions = (options: ExportOptions): string[] => {
    const errors: string[] = []

    if (!options.format) {
      errors.push('请选择导出格式')
    }

    if (!options.fields || options.fields.length === 0) {
      errors.push('请选择要导出的字段')
    }

    const invalidFields = options.fields?.filter((field) => !field.key) || []
    if (invalidFields.length > 0) {
      errors.push('存在无效的字段配置')
    }

    return errors
  }

  // 计算属性
  const canExport = computed(() => !isExporting.value)
  const exportInfo = computed(() => ({
    isExporting: isExporting.value,
    progress: exportProgress.value,
    formats: supportedFormats,
  }))

  return {
    // 状态
    isExporting: computed(() => isExporting.value),
    exportProgress: computed(() => exportProgress.value),
    canExport,
    exportInfo,

    // 格式和字段
    supportedFormats,

    // 主要方法
    exportData,
    previewExport,
    validateOptions,

    // 工具方法
    generateFilename,
    formatValue,
    downloadFile,

    // 格式特定方法
    exportAsJSON,
    exportAsCSV,
    exportAsXML,
    exportAsExcel,
  }
}

/**
 * 创建常用的字段配置
 */
export function createCommonFields() {
  return {
    id: {
      key: 'id',
      label: 'ID',
      type: 'number' as const,
      required: true,
    },
    name: {
      key: 'name',
      label: '名称',
      type: 'string' as const,
      required: true,
    },
    title: {
      key: 'title',
      label: '标题',
      type: 'string' as const,
    },
    description: {
      key: 'description',
      label: '描述',
      type: 'string' as const,
    },
    createdAt: {
      key: 'created_at',
      label: '创建时间',
      type: 'date' as const,
      formatter: (value: any) => {
        const date = new Date(value)
        return date.toLocaleString('zh-CN')
      },
    },
    updatedAt: {
      key: 'updated_at',
      label: '更新时间',
      type: 'date' as const,
      formatter: (value: any) => {
        const date = new Date(value)
        return date.toLocaleString('zh-CN')
      },
    },
    status: {
      key: 'status',
      label: '状态',
      type: 'string' as const,
      formatter: (value: any) => {
        const statusMap: Record<string, string> = {
          active: '激活',
          inactive: '未激活',
          draft: '草稿',
          published: '已发布',
          archived: '已归档',
        }
        return statusMap[value] || value
      },
    },
    tags: {
      key: 'tags',
      label: '标签',
      type: 'array' as const,
      formatter: (value: any) => {
        if (Array.isArray(value)) {
          return value.map((tag) => (typeof tag === 'object' ? tag.name : tag)).join(', ')
        }
        return String(value)
      },
    },
  }
}
