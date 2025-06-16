/**
 * OJ 管理页面工具函数
 * 与后端接口完全对齐
 */

import { api } from '@/api'
import { http } from '@/api/http'
import type { Result, OJTestCase } from '@/types/api'
import type {
  OJTestCaseCreateRequest,
  OJProblem,
  OJProblemCreateRequest,
  FileMapEntry,
  JudgeResult,
  CodeSubmitRequest,
  ApiResponse,
} from '@/types/oj-admin'
import { OJ_CONFIG, OJ_MESSAGES } from '@/config/oj-admin'

/**
 * 文件处理工具函数
 */
export class FileHandler {
  /**
   * 处理上传的文件并转换为测试用例
   */
  static async processUploadedFiles(files: File[]): Promise<{
    testCases: OJTestCase[]
    error?: string
  }> {
    const fileMap = new Map<string, FileMapEntry>()

    try {
      await Promise.all(
        files.map(async (file) => {
          const content = await file.text()
          const match = file.name.match(OJ_CONFIG.filePattern)

          if (!match) return

          const [, index, type] = match
          if (!fileMap.has(index)) {
            fileMap.set(index, {})
          }

          const entry = fileMap.get(index)!
          if (type === 'in') {
            entry.input = content
          } else {
            entry.output = content
          }
        }),
      )

      const testCases = Array.from(fileMap.entries())
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([, { input, output }]) => {
          if (!input || !output) {
            return null
          }
          return { input, output }
        })
        .filter(Boolean) as OJTestCase[]

      if (testCases.length === 0) {
        return {
          testCases: [],
          error: OJ_MESSAGES.error.noValidFiles,
        }
      }

      return { testCases }
    } catch {
      return {
        testCases: [],
        error: OJ_MESSAGES.error.fileReadFailed,
      }
    }
  }

  /**
   * 验证文件类型
   */
  static validateFileType(fileName: string): boolean {
    return OJ_CONFIG.supportedExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
  }

  /**
   * 验证文件大小
   */
  static validateFileSize(fileSize: number): boolean {
    return fileSize <= OJ_CONFIG.maxFileSize
  }
}

/**
 * 测试用例工具函数
 */
export class TestCaseUtils {
  /**
   * 创建新的测试用例
   */
  static createEmpty(): OJTestCase {
    return {
      id: 0,
      problemId: 0,
      createdAt: new Date().toISOString(),
      ...OJ_CONFIG.defaultTestCase,
    }
  }

  /**
   * 验证测试用例
   */
  static validate(testCase: OJTestCase): boolean {
    return testCase.input.trim() !== '' && testCase.output.trim() !== ''
  }

  /**
   * 批量验证测试用例
   */
  static validateBatch(testCases: OJTestCase[]): {
    valid: boolean
    invalidIndices: number[]
  } {
    const invalidIndices: number[] = []

    testCases.forEach((testCase, index) => {
      if (!this.validate(testCase)) {
        invalidIndices.push(index)
      }
    })

    return {
      valid: invalidIndices.length === 0,
      invalidIndices,
    }
  }

  /**
   * 转换为 JSON 格式
   */
  static toJSON(testCases: OJTestCase[]): string {
    return JSON.stringify(testCases, null, 2)
  }

  /**
   * 从 JSON 解析
   */
  static fromJSON(json: string): OJTestCase[] {
    try {
      const parsed = JSON.parse(json)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  /**
   * 批量创建测试用例（与后端对接）
   */
  static async batchCreate(
    problemId: number,
    testCases: OJTestCase[],
  ): Promise<{
    success: boolean
    created: OJTestCase[]
    errors: string[]
  }> {
    const results: OJTestCase[] = []
    const errors: string[] = []

    for (const testCase of testCases) {
      if (!this.validate(testCase)) {
        errors.push('测试用例输入输出不能为空')
        continue
      }

      try {
        const createRequest: OJTestCaseCreateRequest = {
          problemId,
          input: testCase.input,
          output: testCase.output,
        }

        const response = await http.post<Result<OJTestCase>>('/oj/testcase', createRequest)
        if (response.data.status && response.data.data) {
          results.push(response.data.data as unknown as OJTestCase)
        }
      } catch (error) {
        errors.push(`创建测试用例失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }

    return {
      success: errors.length === 0,
      created: results,
      errors,
    }
  }

  /**
   * 获取题目的所有测试用例
   */
  static async getByProblemId(problemId: number): Promise<OJTestCase[]> {
    try {
      const response = await http.get<Result<OJTestCase[]>>(`/oj/problem/${problemId}/testcases`)
      return response.data.status && response.data.data
        ? (response.data.data as unknown as OJTestCase[])
        : []
    } catch (error) {
      console.error('获取测试用例失败:', error)
      return []
    }
  }
}

/**
 * ZIP 文件导出工具
 */
export class ZipExporter {
  /**
   * 导出测试用例为 ZIP 文件
   */
  static async exportTestCases(testCases: OJTestCase[]): Promise<void> {
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      testCases.forEach((testCase, index) => {
        zip.file(`${index + 1}.in`, testCase.input)
        zip.file(`${index + 1}.out`, testCase.output)
      })

      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `testcases-${Date.now()}.zip`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      throw new Error('导出文件失败，请重试')
    }
  }
}

/**
 * 样式工具函数
 */
export class StyleUtils {
  /**
   * 获取按钮样式类
   */
  static getButtonClasses(bgColor: string, textColor: string, hoverBg: string): string {
    return `p-2 ${bgColor} rounded-md ${textColor} ${hoverBg} hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu`
  }

  /**
   * 获取表格行样式
   */
  static getTableRowClasses(isEven: boolean): string {
    return isEven ? 'bg-gray-50' : 'bg-white'
  }

  /**
   * 获取加载状态样式
   */
  static getLoadingClasses(): string {
    return 'h-12 bg-gray-100 animate-pulse rounded'
  }
}

/**
 * 表单验证工具
 */
export class FormValidator {
  /**
   * 验证题目标题
   */
  static validateTitle(title: string): {
    valid: boolean
    message?: string
  } {
    if (!title.trim()) {
      return {
        valid: false,
        message: '请输入题目标题',
      }
    }

    if (title.length > 100) {
      return {
        valid: false,
        message: '标题长度不能超过100个字符',
      }
    }

    return { valid: true }
  }

  /**
   * 验证题目内容
   */
  static validateContent(content: string): {
    valid: boolean
    message?: string
  } {
    if (!content.trim()) {
      return {
        valid: false,
        message: '请输入题目内容',
      }
    }

    return { valid: true }
  }
}
