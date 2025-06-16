#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')

// 检查package.json中的过时类型包
function checkDeprecatedTypes() {
  console.log('🔍 检查过时的类型定义包...\n')

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

  const deprecatedTypes = {
    '@types/highlight.js': 'highlight.js provides its own type definitions',
    '@types/dompurify': 'dompurify provides its own type definitions',
    '@types/jszip': 'jszip provides its own type definitions',
    '@types/codemirror': 'codemirror provides its own type definitions',
    '@types/prismjs': 'prismjs provides its own type definitions'
  }

  const foundDeprecated = []

  Object.keys(deprecatedTypes).forEach(pkg => {
    if (allDeps[pkg]) {
      foundDeprecated.push({
        package: pkg,
        reason: deprecatedTypes[pkg],
        version: allDeps[pkg]
      })
    }
  })

  if (foundDeprecated.length > 0) {
    console.log('⚠️  发现过时的类型定义包:')
    foundDeprecated.forEach(dep => {
      console.log(`  ❌ ${dep.package}@${dep.version}`)
      console.log(`     ${dep.reason}`)
    })

    console.log('\n🗑️  建议移除命令:')
    const packagesToRemove = foundDeprecated.map(dep => dep.package).join(' ')
    console.log(`npm uninstall ${packagesToRemove}`)

    return foundDeprecated.map(dep => dep.package)
  } else {
    console.log('✅ 没有发现过时的类型定义包')
    return []
  }
}

// 检查未使用的依赖
function checkUnusedDeps() {
  console.log('\n🔍 运行depcheck检查未使用的依赖...\n')

  try {
    // 运行depcheck
    const result = execSync('npx depcheck --json', { encoding: 'utf8' })
    const depcheckResult = JSON.parse(result)

    const unusedDeps = depcheckResult.dependencies || []
    const unusedDevDeps = depcheckResult.devDependencies || []

    if (unusedDeps.length > 0) {
      console.log('📦 未使用的生产依赖:')
      unusedDeps.forEach(dep => console.log(`  - ${dep}`))
    }

    if (unusedDevDeps.length > 0) {
      console.log('\n🛠️  未使用的开发依赖:')
      unusedDevDeps.forEach(dep => console.log(`  - ${dep}`))
    }

    if (unusedDeps.length === 0 && unusedDevDeps.length === 0) {
      console.log('✅ 没有发现未使用的依赖')
    }

    return [...unusedDeps, ...unusedDevDeps]
  } catch (error) {
    console.log('⚠️  无法运行depcheck，请确保已安装: npm install -g depcheck')
    return []
  }
}

// 分析包大小
function analyzePackageSizes() {
  console.log('\n📊 分析包大小...\n')

  try {
    const result = execSync('npm ls --depth=0 --json', { encoding: 'utf8' })
    const npmResult = JSON.parse(result)

    const deps = npmResult.dependencies || {}
    const depCount = Object.keys(deps).length

    console.log(`📈 依赖统计:`)
    console.log(`  总依赖数: ${depCount}`)

    // 统计各类型包数量
    const markdownPackages = Object.keys(deps).filter(pkg =>
      pkg.includes('markdown-it') || pkg.includes('marked') || pkg.includes('@mdit')
    ).length

    const typePackages = Object.keys(deps).filter(pkg =>
      pkg.startsWith('@types/')
    ).length

    console.log(`  Markdown相关: ${markdownPackages}`)
    console.log(`  类型定义包: ${typePackages}`)

  } catch (error) {
    console.log('⚠️  无法分析包大小')
  }
}

// 生成清理建议
function generateCleanupSuggestions(deprecatedTypes, unusedDeps) {
  const allToRemove = [...deprecatedTypes, ...unusedDeps]

  if (allToRemove.length > 0) {
    console.log('\n🚀 一键清理建议:')
    console.log('```bash')
    console.log(`npm uninstall ${allToRemove.join(' ')}`)
    console.log('```')

    console.log(`\n💡 预计节省: ${allToRemove.length} 个包`)
  }
}

// 主函数
function main() {
  console.log('🧹 Vue项目依赖清理工具\n')

  // 检查过时类型包
  const deprecatedTypes = checkDeprecatedTypes()

  // 检查未使用依赖
  const unusedDeps = checkUnusedDeps()

  // 分析包大小
  analyzePackageSizes()

  // 生成清理建议
  generateCleanupSuggestions(deprecatedTypes, unusedDeps)

  console.log('\n✨ 分析完成!')
}

// 运行
main()
