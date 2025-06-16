#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 需要分析的依赖包
const targetPackages = {
  // Markdown处理器
  'markdown-it': [],
  'marked': [],

  // Markdown-it插件
  'markdown-it-anchor': [],
  'markdown-it-code-copy': [],
  'markdown-it-emoji': [],
  'markdown-it-highlightjs': [],
  'markdown-it-katex': [],
  'markdown-it-multimd-table': [],
  'markdown-it-task-lists': [],
  'markdown-it-toc-done-right': [],
  'markdown-it-diagram': [],
  'markdown-it-expandable': [],
  'markdown-it-mathjax3': [],
  'markdown-it-prism': [],

  // Marked插件
  'marked-alert': [],
  'marked-base-url': [],
  'marked-code-format': [],
  'marked-code-preview': [],
  'marked-extended-tables': [],
  'marked-highlight': [],

  // 其他可疑包
  'mermaid-it-markdown': [],
  '@vscode/markdown-it-katex': [],
  '@mdit/plugin-katex': [],
  '@mdit/plugin-mathjax': [],
  '@mdit/plugin-plantuml': [],
  '@mdit/plugin-tab': [],

  // 图标库
  '@heroicons/vue': [],
  '@iconify/vue': [],
  'lucide-vue-next': [],

  // 动画库
  'motion-v': [],
  '@vueuse/motion': [],
  'gsap': [],

  // 编辑器
  'codemirror': [],
  'monaco-editor': [],
  'monaco-editor-vue3': [],

  // 其他
  'dompurify': [],
  'zod': [],
  'vue-draggable-plus': [],
  'anchor': [],
  'css-tree': [],
  'highlight': [],
  'highlight.js': [],
  'prismjs': []
}

// 过时的类型定义包（这些库现在自带类型）
const deprecatedTypes = {
  '@types/highlight.js': 'highlight.js provides its own type definitions',
  '@types/dompurify': 'dompurify provides its own type definitions',
  '@types/jszip': 'jszip provides its own type definitions',
  '@types/codemirror': 'codemirror provides its own type definitions',
  '@types/prismjs': 'prismjs provides its own type definitions'
}

// 文件扩展名
const fileExtensions = ['.js', '.ts', '.vue', '.md', '.json']

// 搜索目录
const searchDirectories = [
  'src',
  'docs',
  'vite.config.ts',
  'uno.config.ts',
  'eslint.config.ts',
  'vitest.config.ts',
  'playwright.config.ts'
]

function searchInFile(filePath, content) {
  const results = []

  // 检查每个目标包
  Object.keys(targetPackages).forEach(packageName => {
    const patterns = [
      // import语句
      new RegExp(`import.*?['"\`]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g'),
      // require语句
      new RegExp(`require\\(['"\`]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]\\)`, 'g'),
      // from语句
      new RegExp(`from ['"\`]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g'),
      // 动态import
      new RegExp(`import\\(['"\`]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]\\)`, 'g'),
      // 配置中的引用
      new RegExp(`['"\`]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g')
    ]

    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          results.push({
            package: packageName,
            match: match.trim(),
            type: ['import', 'require', 'from', 'dynamic-import', 'reference'][index],
            file: filePath
          })
        })
      }
    })
  })

  return results
}

function scanDirectory(dir, baseDir = '') {
  const results = []

  try {
    const entries = fs.readdirSync(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const relativePath = path.join(baseDir, entry)

      // 跳过node_modules和.git等目录
      if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist') {
        continue
      }

      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath, relativePath))
      } else if (fileExtensions.some(ext => entry.endsWith(ext))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8')
          const fileResults = searchInFile(relativePath, content)
          results.push(...fileResults)
        } catch (error) {
          console.warn(`Warning: Could not read file ${relativePath}:`, error.message)
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dir}:`, error.message)
  }

  return results
}

function analyzeProject() {
  console.log('🔍 分析项目依赖使用情况...\n')

  let allResults = []

  // 扫描指定目录和文件
  searchDirectories.forEach(item => {
    if (fs.existsSync(item)) {
      const stat = fs.statSync(item)
      if (stat.isDirectory()) {
        allResults.push(...scanDirectory(item))
      } else {
        // 单个文件
        try {
          const content = fs.readFileSync(item, 'utf8')
          const fileResults = searchInFile(item, content)
          allResults.push(...fileResults)
        } catch (error) {
          console.warn(`Warning: Could not read file ${item}:`, error.message)
        }
      }
    }
  })

  // 按包名分组结果
  const groupedResults = {}
  allResults.forEach(result => {
    if (!groupedResults[result.package]) {
      groupedResults[result.package] = []
    }
    groupedResults[result.package].push(result)
  })

  // 输出结果
  console.log('📊 依赖使用分析结果:\n')

  // 1. 被使用的包
  const usedPackages = Object.keys(groupedResults).sort()
  if (usedPackages.length > 0) {
    console.log('✅ 正在使用的包:')
    usedPackages.forEach(pkg => {
      console.log(`\n📦 ${pkg}:`)
      const uses = groupedResults[pkg]

      // 按文件分组
      const fileGroups = {}
      uses.forEach(use => {
        if (!fileGroups[use.file]) {
          fileGroups[use.file] = []
        }
        fileGroups[use.file].push(use)
      })

      Object.keys(fileGroups).forEach(file => {
        console.log(`  📄 ${file}:`)
        fileGroups[file].forEach(use => {
          console.log(`    ${use.type}: ${use.match}`)
        })
      })
    })
  }

  // 2. 未使用的包
  const unusedPackages = Object.keys(targetPackages).filter(pkg => !groupedResults[pkg])
  if (unusedPackages.length > 0) {
    console.log('\n\n❌ 未发现使用的包:')
    unusedPackages.forEach(pkg => {
      console.log(`  - ${pkg}`)
    })
  }

  // 3. 特别关注markdown相关包
  console.log('\n\n🎯 Markdown处理器使用情况:')
  const markdownPackages = usedPackages.filter(pkg =>
    pkg.includes('markdown-it') || pkg.includes('marked') || pkg.includes('@mdit')
  )

  if (markdownPackages.length > 0) {
    console.log('  使用中的Markdown包:')
    markdownPackages.forEach(pkg => {
      console.log(`    ✓ ${pkg}`)
    })
  }

  const unusedMarkdownPackages = unusedPackages.filter(pkg =>
    pkg.includes('markdown-it') || pkg.includes('marked') || pkg.includes('@mdit')
  )

  if (unusedMarkdownPackages.length > 0) {
    console.log('\n  未使用的Markdown包:')
    unusedMarkdownPackages.forEach(pkg => {
      console.log(`    ✗ ${pkg}`)
    })
  }

  // 4. 生成移除建议
  if (unusedPackages.length > 0) {
    console.log('\n\n🗑️ 建议移除的包:')
    console.log('npm uninstall \\')
    unusedPackages.forEach((pkg, index) => {
      const isLast = index === unusedPackages.length - 1
      console.log(`  ${pkg}${isLast ? '' : ' \\'}`)
    })
  }

  // 5. 统计信息
  console.log('\n\n📈 统计信息:')
  console.log(`  总检查包数: ${Object.keys(targetPackages).length}`)
  console.log(`  使用中的包: ${usedPackages.length}`)
  console.log(`  未使用的包: ${unusedPackages.length}`)
  console.log(`  可节省比例: ${((unusedPackages.length / Object.keys(targetPackages).length) * 100).toFixed(1)}%`)
}

// 运行分析
analyzeProject()
