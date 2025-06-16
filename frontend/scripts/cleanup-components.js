#!/usr/bin/env node
// 自动生成的组件清理脚本
const fs = require('fs')

const unusedComponents = [
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\article\ArticleTableRow.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\common\UnifiedModal.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\common\VisualizerControl.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\common\VisualizerStatus.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\composable\BaseEditorNew.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\oj\OJPagination.vue',
  'E:\IDEPLAYTEST\IMISLab\frontend\src\components\oj\OJProblemDetail.vue'
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

console.log('\n🎉 清理完成!')
