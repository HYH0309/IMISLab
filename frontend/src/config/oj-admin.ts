/**
 * OJ 管理页面配置数据
 * 基于最新的后端接口设计
 */

import {
  PlusIcon,
  EyeIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
} from '@heroicons/vue/24/outline'
import type { OJActionButton, OJConfig, OJTableColumn, LanguageConfig } from '@/types/oj-admin'

// 本地枚举定义，避免导入问题
enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

/**
 * 表格列配置
 */
export const OJ_TABLE_COLUMNS: OJTableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 'w-20',
    align: 'left',
    sortable: true,
  },
  {
    key: 'title',
    label: '标题',
    align: 'left',
    sortable: true,
    filterable: true,
  },
  {
    key: 'difficulty',
    label: '难度',
    width: 'w-24',
    align: 'center',
    sortable: true,
    filterable: true,
  },
  {
    key: 'timeLimit',
    label: '时间限制',
    width: 'w-24',
    align: 'center',
  },
  {
    key: 'memoryLimit',
    label: '内存限制',
    width: 'w-24',
    align: 'center',
  },
  {
    key: 'createdAt',
    label: '创建时间',
    width: 'w-32',
    align: 'center',
    sortable: true,
  },
  {
    key: 'actions',
    label: '操作',
    width: 'w-64',
    align: 'right',
  },
]

/**
 * 操作按钮配置
 */
export const OJ_ACTION_BUTTONS: OJActionButton[] = [
  {
    type: 'add',
    icon: PlusIcon,
    title: '添加测试用例',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    hoverBg: 'hover:bg-green-100',
    handler: 'handleAddTestCase',
  },
  {
    type: 'edit',
    icon: PencilIcon,
    title: '编辑题目',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-100',
    handler: 'handleEditProblem',
  },
  {
    type: 'preview',
    icon: EyeIcon,
    title: '预览题目内容',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    hoverBg: 'hover:bg-purple-100',
    handler: 'handlePreview',
  },
  {
    type: 'view',
    icon: DocumentTextIcon,
    title: '查看测试用例',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-100',
    handler: 'handleViewTestCases',
  },
  {
    type: 'delete',
    icon: TrashIcon,
    title: '删除题目',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    hoverBg: 'hover:bg-red-100',
    handler: 'handleDelete',
  },
]

/**
 * OJ 系统配置
 */
export const OJ_CONFIG: OJConfig = {
  filePattern: /^(\d+)\.(in|out)$/,
  maxFileSize: 1024 * 1024, // 1MB
  supportedExtensions: ['.in', '.out'],
  defaultTestCase: {
    input: '',
    output: '',
  },
  defaultProblem: {
    difficulty: 'Easy',
    timeLimit: 1000,
    memoryLimit: 128,
  },
  difficulties: [DifficultyLevel.Easy, DifficultyLevel.Medium, DifficultyLevel.Hard],
  languages: [
    {
      id: 71,
      name: 'Python',
      value: 'python3',
      icon: '🐍',
      template: '# Python 3\n\ndef solution():\n    pass\n\nsolution()',
    },
    {
      id: 62,
      name: 'Java',
      value: 'java',
      icon: '☕',
      template:
        'public class Main {\n    public static void main(String[] args) {\n        // Java code here\n    }\n}',
    },
    {
      id: 63,
      name: 'JavaScript',
      value: 'javascript',
      icon: '🟨',
      template: '// JavaScript\n\nfunction solution() {\n    // Your code here\n}\n\nsolution();',
    },
    {
      id: 54,
      name: 'C++',
      value: 'cpp',
      icon: '⚡',
      template:
        '#include <iostream>\nusing namespace std;\n\nint main() {\n    // C++ code here\n    return 0;\n}',
    },
  ],
}

/**
 * 默认题目模板
 */
export const DEFAULT_PROBLEM_TEMPLATE = {
  title: '',
  content: '',
}

/**
 * 基础样式类
 */
export const OJ_BASE_CLASSES = {
  button:
    'p-2 rounded-md hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu',
  card: 'bg-white rounded-lg shadow-md overflow-hidden',
  table: 'min-w-full divide-y divide-gray-200',
  tableHeader: 'bg-gray-50',
  tableRow: 'bg-white divide-y divide-gray-200',
  input: 'input w-full',
  textarea: 'textarea w-full',
  modal: 'space-y-4',
}

/**
 * 操作提示文本
 */
export const OJ_MESSAGES = {
  success: {
    created: '题目创建成功',
    deleted: '题目删除成功',
    testCaseAdded: '测试用例添加成功',
    fileUploaded: '文件上传成功',
  },
  error: {
    createFailed: '题目创建失败',
    deleteFailed: '题目删除失败',
    fileReadFailed: '文件读取失败，请检查文件格式',
    noValidFiles: '未找到有效的测试用例文件',
    missingFiles: '测试用例缺少输入或输出文件',
    selectProblem: '请先选择题目',
    noTestCases: '请至少添加一个测试用例',
  },
  confirm: {
    deleteProblem: '确定要删除这个题目吗？',
    clearTestCases: '确定要清空所有测试用例吗？',
  },
}
