/**
 * OJ 管理相关的 TypeScript 类型定义
 * 基于最新的后端接口设计
 */

import type { Component } from 'vue'

// 基础 OJ 题目接口 (匹配后端 OJProblemResponse)
export interface OJProblem {
  id: number
  title: string
  description: string // 修正：content -> description
  difficulty: string // 新增：难度级别
  timeLimit: number // 新增：时间限制(ms)
  memoryLimit: number // 新增：内存限制(MB)
  createdAt: string // 新增：创建时间
  updatedAt: string // 新增：更新时间
}

// OJ 题目创建请求接口 (匹配后端 OJProblemCreateRequest)
export interface OJProblemCreateRequest {
  title: string
  description: string
  difficulty: string
  timeLimit?: number
  memoryLimit?: number
}

// 测试用例接口 (匹配后端 OJTestcaseResponse)
export interface OJTestCase {
  id?: number // 新增：测试用例ID
  problemId?: number // 新增：关联的问题ID
  input: string
  output: string
  createdAt?: string // 新增：创建时间
}

// 测试用例创建请求接口 (匹配后端 OJTestcaseCreateRequest)
export interface OJTestCaseCreateRequest {
  problemId: number
  input: string
  output: string
}

// 判题结果接口 (匹配前端 JudgeResult)
export interface JudgeResult {
  id: number
  problemId: number
  code: string
  language: string
  status: string
  isCompleted: boolean
  executeTime: number
  memoryUsage: number
  submitTime: string
  judgeToken: string
}

// 代码提交请求接口 (匹配后端 CodeSubmitRequest)
export interface CodeSubmitRequest {
  tid: number // 题目ID
  sourceCode: string // 源代码
  languageId: number // 语言ID
}

// 文件映射接口 (保持不变，用于文件上传处理)
export interface FileMapEntry {
  input?: string
  output?: string
}

// 难度级别枚举
export enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

// 判题状态枚举
export enum JudgeStatus {
  PENDING = 'PENDING',
  IN_QUEUE = 'IN_QUEUE',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
}

// 编程语言配置
export interface LanguageConfig {
  id: number
  name: string
  value: string
  icon: string
  template: string
}

// 按钮操作类型
export type OJActionType = 'add' | 'preview' | 'view' | 'delete' | 'edit' | 'test'

// 按钮配置接口
export interface OJActionButton {
  type: OJActionType
  icon: Component
  title: string
  bgColor: string
  textColor: string
  hoverBg: string
  handler: string
  disabled?: boolean
}

// OJ 配置接口
export interface OJConfig {
  filePattern: RegExp
  maxFileSize: number
  supportedExtensions: string[]
  defaultTestCase: Omit<OJTestCase, 'id' | 'problemId' | 'createdAt'>
  defaultProblem: Omit<OJProblemCreateRequest, 'title' | 'description'>
  difficulties: DifficultyLevel[]
  languages: LanguageConfig[]
}

// 表格列配置
export interface OJTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
}

// 分页配置
export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
}

// 搜索过滤配置
export interface SearchFilters {
  keyword?: string
  difficulty?: DifficultyLevel
  sortBy?: 'id' | 'title' | 'difficulty' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// API 响应通用格式
export interface ApiResponse<T = unknown> {
  status: boolean
  msg: string
  data?: T
}

// 导出类型
export type {
  OJProblem as Problem,
  OJProblemCreateRequest as ProblemCreateRequest,
  OJTestCase as TestCase,
  OJTestCaseCreateRequest as TestCaseCreateRequest,
  JudgeResult,
  CodeSubmitRequest,
  FileMapEntry,
  OJActionType as ActionType,
  OJActionButton as ActionButton,
  OJConfig as Config,
  OJTableColumn as TableColumn,
  PaginationConfig,
  SearchFilters,
  ApiResponse,
  LanguageConfig,
}
