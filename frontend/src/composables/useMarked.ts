import MarkdownIt from 'markdown-it'

// ========================
// 核心插件：直接影响 Markdown 解析流程
// ========================
import { tocPlugin } from '@mdit-vue/plugin-toc' // 自动生成目录
import anchor from 'markdown-it-anchor' // 标题锚点生成

// ========================
// 功能扩展插件：增强 Markdown 功能
// ========================
import hljsMarkdown from 'markdown-it-highlightjs'
import mermaidItMarkdown from 'mermaid-it-markdown' // Mermaid 图表支持
import { full as emojiPlugin } from 'markdown-it-emoji' // Emoji 短码转换
import { plantuml } from '@mdit/plugin-plantuml' // PlantUML 支持
import markdownCopy from 'markdown-it-code-copy'

// ========================
// 数学公式支持
// ========================
import { katex } from '@mdit/plugin-katex'

// ========================
// 配置常量（按功能模块分类）
// ========================
const MARKDOWN_IT_CONFIG = {
  /** 核心解析器配置 */
  core: {
    html: true, // 允许 HTML 标签
    linkify: true, // 自动转换 URL 为链接
    typographer: true, // 启用印刷字体替换（如引号转换）
    async: false,
    langPrefix: 'language-', // 代码块的语言类前缀
    replacements: [
      // 特殊字符保护（针对数学公式场景）
      { from: '\\$', to: '$' }, // 保护美元符号不被转换
      { from: '\\\\', to: '\\' }, // 保护反斜杠不被转义
    ],
    quotes: '“”‘’', // 智能引号替换规则
    breaks: true, // 转换换行符为 <br>
  },

  /** 目录生成配置 */
  toc: {
    containerClass: 'toc',
  },

  /** 标题锚点配置 */
  anchor: { symbol: '#' },

  /** KaTeX 数学公式配置 */
  katex: {
    throwOnError: false,
    mathFence: true, // 启用块级公式
    inlineMath: [
      // 显式声明行内公式语法
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      // 显式声明块级公式语法
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  CodeCopy: {
    onSuccess: () => {
      alert('复制成功')
    },
    onError: () => {
      alert('复制失败')
    },
    element: 'copy', // 文本型按钮
    buttonStyle: `
      position: absolute;
      top: 7.5px;
      right: 6px;
      cursor: pointer;
      outline: none;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 4px 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
      font-size: 12px;
      font-weight: 500;
      color: #333;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(2px);
    `,
    iconStyle: `
      letter-spacing: 0.5px;
      text-transform: uppercase;
    `,
  },
}

/**
 * 创建并配置 MarkdownIt 解析器实例
 * @returns 完全配置的 MarkdownIt 实例
 */
const createMarkdownParser = () => {
  // 初始化核心解析器
  const md = new MarkdownIt(MARKDOWN_IT_CONFIG.core)

  // ========================
  // 插件分类初始化（按加载顺序）
  // ========================
  const pluginModules = [
    // 可视化组件类（优先处理特殊代码块）
    { name: 'mermaid', plugin: mermaidItMarkdown },
    { name: 'plantuml', plugin: plantuml },

    // 核心结构类插件
    { name: 'anchor', plugin: anchor, config: MARKDOWN_IT_CONFIG.anchor },
    { name: 'toc', plugin: tocPlugin, config: MARKDOWN_IT_CONFIG.toc },

    // 代码高亮类（后处理常规代码块）
    { name: 'markdown-it-code-copy', plugin: markdownCopy, config: MARKDOWN_IT_CONFIG.CodeCopy },
    { name: 'hljs', plugin: hljsMarkdown },

    // 其他文本处理插件
    { name: 'emoji', plugin: emojiPlugin },

    // 数学公式类（最后加载）
    { name: 'katex', plugin: katex, config: MARKDOWN_IT_CONFIG.katex },
  ]

  // ========================
  // 安全加载插件（带错误处理）
  // ========================
  pluginModules.forEach(({ name, plugin, config }) => {
    try {
      if (config) {
        md.use(plugin, config)
      } else {
        md.use(plugin)
      }
      console.log(`✅ ${name} 插件加载成功`)
    } catch (error) {
      console.error(`[Markdown 初始化错误] ${name} 插件加载失败:`, error)
      throw new Error(`核心插件加载失败，请检查 ${name} 插件配置`)
    }
  })

  return md
}

// ========================
// 导出预配置实例
// ========================
export const md = createMarkdownParser()
