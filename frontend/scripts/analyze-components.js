#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 分析项目组件使用情况...\n')

// 需要分析的组件目录
const componentsDir = path.join(process.cwd(), 'src/components')
const viewsDir = path.join(process.cwd(), 'src/views')

// 获取所有组件文件
function getAllComponents(dir, prefix = '') {
  const components = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      components.push(...getAllComponents(fullPath, prefix + item + '/'))
    } else if (item.endsWith('.vue')) {
      components.push({
        name: item.replace('.vue', ''),
        path: fullPath,
        relativePath: prefix + item
      })
    }
  }

  return components
}

// 搜索文件中的组件使用
function findComponentUsage(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const importRegex = new RegExp(`import\\s+.*${componentName}.*from`, 'g')
    const usageRegex = new RegExp(`<${componentName}|${componentName}\\.`, 'g')

    const importMatches = content.match(importRegex) || []
    const usageMatches = content.match(usageRegex) || []

    return importMatches.length > 0 || usageMatches.length > 0
  } catch (error) {
    return false
  }
}

// 获取所有Vue文件
function getAllVueFiles(dir) {
  const files = []

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir)

    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath)
      } else if (item.endsWith('.vue') || item.endsWith('.ts') || item.endsWith('.js')) {
        files.push(fullPath)
      }
    }
  }

  scan(dir)
  return files
}

// 主分析逻辑
const components = getAllComponents(componentsDir)
const allFiles = getAllVueFiles(path.join(process.cwd(), 'src'))

console.log(`📊 发现 ${components.length} 个组件，${allFiles.length} 个文件`)
console.log('='.repeat(60))

// 分析每个组件的使用情况
const unusedComponents = []
const duplicatePatterns = []

for (const component of components) {
  let usageCount = 0
  const usedInFiles = []

  for (const file of allFiles) {
    if (file !== component.path && findComponentUsage(file, component.name)) {
      usageCount++
      usedInFiles.push(path.relative(process.cwd(), file))
    }
  }

  if (usageCount === 0) {
    unusedComponents.push(component)
  }

  console.log(`📁 ${component.relativePath}`)
  console.log(`   使用次数: ${usageCount}`)
  if (usedInFiles.length > 0) {
    console.log(`   使用文件: ${usedInFiles.slice(0, 3).join(', ')}${usedInFiles.length > 3 ? '...' : ''}`)
  }
  console.log()
}

// 检测可能重复的组件模式
console.log('\n🔍 可能的重复组件模式:')
console.log('='.repeat(60))

const patterns = [
  { pattern: /Modal/i, description: 'Modal 相关组件' },
  { pattern: /ControlPanel/i, description: 'ControlPanel 相关组件' },
  { pattern: /Status/i, description: 'Status 相关组件' },
  { pattern: /Card/i, description: 'Card 相关组件' },
  { pattern: /Button/i, description: 'Button 相关组件' }
]

for (const { pattern, description } of patterns) {
  const matchingComponents = components.filter(c => pattern.test(c.name))
  if (matchingComponents.length > 1) {
    console.log(`🔄 ${description}:`)
    matchingComponents.forEach(c => console.log(`   - ${c.relativePath}`))
    console.log()
  }
}

// 输出未使用的组件
if (unusedComponents.length > 0) {
  console.log('\n❌ 未使用的组件:')
  console.log('='.repeat(60))
  unusedComponents.forEach(component => {
    console.log(`🗑️  ${component.relativePath}`)
  })

  console.log(`\n💡 建议删除 ${unusedComponents.length} 个未使用的组件`)
} else {
  console.log('\n✅ 所有组件都在使用中')
}

// 生成清理建议
console.log('\n📋 优化建议:')
console.log('='.repeat(60))
console.log('1. 合并相似功能的 Modal 组件')
console.log('2. 统一 ControlPanel 和 Status 组件的实现')
console.log('3. 删除未使用的组件文件')
console.log('4. 考虑将常用组件提取到 common 目录')

if (unusedComponents.length > 0) {
  console.log('\n💾 生成清理脚本...')

  const cleanupScript = `#!/usr/bin/env node
// 自动生成的组件清理脚本
const fs = require('fs')

const unusedComponents = [
${unusedComponents.map(c => `  '${c.path}'`).join(',\n')}
]

console.log('🧹 开始清理未使用的组件...')

for (const componentPath of unusedComponents) {
  try {
    if (fs.existsSync(componentPath)) {
      fs.unlinkSync(componentPath)
      console.log('✅ 已删除:', componentPath)
    }
  } catch (error) {
    console.error('❌ 删除失败:', componentPath, error.message)
  }
}

console.log('\\n🎉 清理完成!')
`

  fs.writeFileSync(path.join(process.cwd(), 'scripts/cleanup-components.js'), cleanupScript)
  console.log('📁 清理脚本已生成: scripts/cleanup-components.js')
  console.log('🚀 运行: node scripts/cleanup-components.js')
}

console.log('\n🎉 分析完成!')
