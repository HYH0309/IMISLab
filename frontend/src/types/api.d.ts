export interface Result<T = unknown> {
  status: boolean
  msg: string
  data?: T
}

export interface ArticleContent {
  id: number
  title: string
  content: string
  summary?: string
  tagIds: number[]
  coverUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ArticleSummary {
  id: number
  title: string
  summary: string
  tagIds: number[]
  createdAt: string
  coverUrl?: string
}

export interface Tag {
  id: number
  name: string
}

export interface Comment {
  id?: number
  articleId: number
  content: string
  author: string
  createdAt?: string
  updatedAt?: string
}

export interface ArticleRequest {
  title: string
  content: string
  summary?: string
  tagIds: number[]
  coverUrl?: string
}

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

export interface OJTestCase {
  id: number // 新增：测试用例ID
  problemId: number // 新增：关联的问题ID
  input: string
  output: string
  createdAt: string // 新增：创建时间
}

export interface OJRequest {
  title: string
  description: string // 修正：content -> description
  difficulty: string // 新增：难度级别
  timeLimit?: number // 新增：时间限制
  memoryLimit?: number // 新增：内存限制
}

export interface JudgeRequest {
  tid: number // 修正：problemId -> tid (匹配后端期望)
  sourceCode: string // 修正：code -> sourceCode (匹配后端期望)
  languageId: number // 修正：string -> number (匹配后端期望)
}

export interface SubmitResponse {
  token: string // 修正：后端返回单个token，不是tokens数组
}

export interface JudgeResult {
  id: number
  problemId: number
  code: string
  language: string
  status: string // 判题状态（如：ACCEPTED, WRONG_ANSWER等）
  isCompleted: boolean // 是否判题完成
  executeTime: number // 执行时间
  memoryUsage: number // 内存使用
  submitTime: string // 提交时间
  judgeToken: string // 判题token
}

export interface MultiJudgeResult {
  results: JudgeResult[]
}

export type JudgeStatusMsg = JudgeResult['msg']
