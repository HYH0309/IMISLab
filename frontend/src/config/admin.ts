import { DocumentTextIcon, TagIcon, CodeBracketIcon } from '@heroicons/vue/24/outline'
import {
  DocumentTextIcon as DocumentTextSolidIcon,
  TagIcon as TagSolidIcon,
  CodeBracketIcon as CodeBracketSolidIcon,
} from '@heroicons/vue/24/solid'
import ArticleAdminView from '@/views/admin/ArticleAdminView.vue'
import TagAdminView from '@/views/admin/TagAdminView.vue'
import OJAdminView from '@/views/admin/OJAdminView.vue'
import type { TabConfig, StatConfig, ColorStylesMap, BaseClassConfig } from '@/types/admin'

// 颜色样式映射 - 简化版本
export const COLOR_STYLES: ColorStylesMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    active: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    indicator: 'bg-blue-600 dark:bg-blue-400',
    ring: 'ring-blue-400 dark:ring-blue-600',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    active: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    indicator: 'bg-green-600 dark:bg-green-400',
    ring: 'ring-green-400 dark:ring-green-600',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    active: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indicator: 'bg-purple-600 dark:bg-purple-400',
    ring: 'ring-purple-400 dark:ring-purple-600',
  },
}

// 简化的基础样式类
export const BASE_CLASSES: BaseClassConfig = {
  card: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
  button: 'transition-all duration-200',
  heading: 'text-gray-900 dark:text-white',
  subtext: 'text-gray-500 dark:text-gray-400',
  badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  input:
    'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
}

// 标签页配置
export const ADMIN_TABS: TabConfig[] = [
  {
    id: 'articles',
    name: '文章管理',
    component: ArticleAdminView,
    icon: DocumentTextIcon,
    activeIcon: DocumentTextSolidIcon,
    description: '管理博客文章、编辑内容',
    color: 'blue',
  },
  {
    id: 'tags',
    name: '标签管理',
    component: TagAdminView,
    icon: TagIcon,
    activeIcon: TagSolidIcon,
    description: '管理文章标签、分类',
    color: 'green',
  },
  {
    id: 'oj',
    name: 'OJ管理',
    component: OJAdminView,
    icon: CodeBracketIcon,
    activeIcon: CodeBracketSolidIcon,
    description: '管理编程题目、测试用例',
    color: 'purple',
  },
]

// 统计数据配置 - 精简为三个主要项
export const ADMIN_STATS: StatConfig[] = [
  { label: '总文章数', value: 24, icon: DocumentTextIcon, color: 'blue' },
  { label: '总标签数', value: 12, icon: TagIcon, color: 'green' },
  { label: 'OJ题目数', value: 38, icon: CodeBracketIcon, color: 'purple' },
]
