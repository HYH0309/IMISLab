import axios from 'axios'
import type {
  ArticleContent,
  ArticleSummary,
  Tag,
  Comment,
  Result,
  ArticleRequest,
  OJProblem,
  OJTestCase,
  OJRequest,
  SubmitResponse,
  JudgeResult,
  JudgeRequest,
} from '@/types/api'
import { http } from './http.ts'
import type { AxiosResponse, AxiosError } from 'axios'

async function request<T>(promise: Promise<AxiosResponse<Result<T>>>): Promise<Result<T>> {
  try {
    const response = await promise
    return response.data as Result<T>
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<Result<T>>
      return (
        err.response?.data || {
          status: false,
          msg: '前端的bug',
        }
      )
    }
    return {
      status: false,
      msg: error instanceof Error ? error.message : '未知错误',
    }
  }
}

export const api = {
  // ===================== 标签(Tag)相关API =====================
  /**
   * 创建新标签
   * @param name 标签名称
   * @returns Promise<null> 创建成功返回null
   */
  createTag: (name: string) => request<null>(http.post(`/tags`, { name })),

  /**
   * 获取所有标签列表
   * @returns Promise<Tag[]> 返回标签数组
   */
  getTags: () => request<Tag[]>(http.get('/tags')),

  /**
   * 更新标签信息
   * @param id 要更新的标签ID
   * @param tag 包含新标签名称的对象 { name: string }
   * @returns Promise<null> 更新成功返回null
   */
  updateTag: (id: number, tag: { name: string }) => request<null>(http.put(`/tags/${id}`, tag)),

  /**
   * 删除标签
   * @param id 要删除的标签ID
   * @returns Promise<null> 删除成功返回null
   */
  deleteTag: (id: number) => request<null>(http.delete(`/tags/${id}`)),

  // ===================== 文章(Article)相关API =====================
  /**
   * 创建新文章
   * @param article 文章内容对象(ArticleRequest类型)
   * @returns Promise<null> 创建成功返回null
   */
  createArticle: (article: ArticleRequest) => request<null>(http.post(`/articles`, article)),

  /**
   * 删除文章
   * @param id 要删除的文章ID
   * @returns Promise<null> 删除成功返回null
   */
  deleteArticle: (id: number) => request<null>(http.delete(`/articles/${id}`)),

  /**
   * 获取文章摘要列表 (支持分页)
   * @param page 页码，默认为1
   * @param pageSize 每页大小，默认为10
   * @returns Promise<ArticleSummary[]> 返回文章摘要数组
   */
  getArticles: (page: number = 1, pageSize: number = 10) =>
    request<ArticleSummary[]>(http.get(`/articles?page=${page}&pageSize=${pageSize}`)),

  /**
   * 更新文章
   * @param id 文章ID
   * @param article 文章内容对象(ArticleRequest类型)
   * @returns Promise<null> 更新成功返回null
   */
  updateArticle: (id: number, article: ArticleRequest) =>
    request<null>(http.put(`/articles/${id}`, article)),

  /**
   * 根据ID获取文章完整内容
   * @param id 文章ID
   * @returns Promise<ArticleContent> 返回文章完整内容对象
   */
  getArticleById: (id: number) => request<ArticleContent>(http.get(`/articles/${id}`)),

  // ===================== 评论(Comment)相关API =====================
  /**
   * 获取指定文章的所有评论
   * @param id 文章ID
   * @returns Promise<Comment[]> 返回评论对象数组
   */
  getCommentsByArticleId: (id: number) => request<Comment[]>(http.get(`/comments/${id}`)),

  /**
   * 提交新评论
   * @param comment 评论对象(Comment类型)
   * @returns Promise<Comment> 返回创建的评论对象
   */
  postComment: (comment: Comment) => request<Comment>(http.post(`/comments`, comment)),

  // ===================== 在线评测(OJ)相关API =====================
  /**
   * 创建新OJ题目
   * @param problem 题目内容对象(OJRequest类型)
   * @returns Promise<number> 返回新创建的题目ID
   */
  postOJProblem: (problem: OJRequest) => request<number>(http.post(`/oj/problem`, problem)),

  /**
   * 获取所有OJ题目列表
   * @returns Promise<OJProblem[]> 返回题目数组
   */
  getOJProblems: () => request<OJProblem[]>(http.get(`/oj/problems`)),
  getOJProblemById: (id: number) => request<OJProblem>(http.get(`/oj/problems/${id}`)),

  /**
   * 删除OJ题目
   * @param id 要删除的题目ID
   * @returns Promise<null> 删除成功返回null
   */
  deleteOJProblem: (id: number) => request<null>(http.delete(`/oj/problem/${id}`)),

  /**
   * 为指定题目添加测试用例
   * @param problemTests 测试用例数组(OJTestCase[])
   * @param problem_id 题目ID
   * @returns Promise<null> 添加成功返回null
   */
  postOJTestCase: (problemTests: OJTestCase[], problem_id: number) =>
    request<null>(http.post(`/oj/testcase/${problem_id}`, problemTests)),

  /**
   * 获取指定题目的所有测试用例
   * @param problemId 题目ID
   * @returns Promise<OJTestCase[]> 返回测试用例数组
   */
  getOJTestCases: (problemId: number) =>
    request<OJTestCase[]>(http.get(`/oj/testcase/${problemId}`)),

  // 提交代码
  submitCode: (data: JudgeRequest) => request<SubmitResponse>(http.post('/oj/judge', data)),

  // 获取判题结果
  getJudgeResult: (token: string) => request<JudgeResult>(http.get(`/oj/judge?token=${token}`)),

  // ===================== 文件上传相关API =====================
  /**
   * 上传图片
   * @param file 图片文件
   * @returns Promise<string> 返回图片URL
   */
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<string>(
      http.post('/img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    )
  },
}
