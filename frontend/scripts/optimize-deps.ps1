#!/usr/bin/env powershell

# Vue项目依赖优化脚本
# 基于 depcheck 分析结果

Write-Host "🚀 开始Vue项目依赖优化..." -ForegroundColor Green

# 第一阶段：移除完全未使用的依赖（安全）
Write-Host "`n📦 第一阶段：移除完全未使用的依赖" -ForegroundColor Yellow

$unused_deps = @(
    "anchor",
    "css-tree", 
    "i",
    "@mdit/plugin-mathjax",
    "@mdit/plugin-tab",
    "markdown-it-diagram",
    "markdown-it-expandable", 
    "markdown-it-katex",
    "markdown-it-mathjax3",
    "markdown-it-prism",
    "markdown-it-task-lists",
    "markdown-it-toc-done-right",
    "tsparticles-engine"
)

foreach ($dep in $unused_deps) {
    Write-Host "  移除: $dep" -ForegroundColor Red
}

# 第二阶段：移除重复功能的依赖
Write-Host "`n🔄 第二阶段：移除重复功能的依赖" -ForegroundColor Yellow

$duplicate_deps = @(
    # Markdown解析器重复 - 移除marked系列
    "marked",
    "marked-alert", 
    "marked-base-url",
    "marked-code-format",
    "marked-code-preview",
    "marked-extended-tables", 
    "marked-highlight",
    
    # 图标库重复 - 移除非主要的
    "@iconify/vue",
    "lucide-vue-next",
    
    # 代码高亮重复 - 移除多余的
    "highlight",
    "prismjs",
    
    # 动画库重复 - 移除gsap
    "gsap",
    
    # 编辑器重复 - 移除Monaco
    "monaco-editor",
    "monaco-editor-vue3", 
    "vite-plugin-monaco-editor",
    
    # 粒子效果重复
    "@tsparticles/slim",
    "@tsparticles/vue3"
)

foreach ($dep in $duplicate_deps) {
    Write-Host "  移除重复: $dep" -ForegroundColor Orange
}

# 第三阶段：移除开发环境未使用的依赖
Write-Host "`n🛠️ 第三阶段：移除开发环境未使用的依赖" -ForegroundColor Yellow

$unused_dev_deps = @(
    "@iconify/json",
    "@types/codemirror",
    "@types/prismjs", 
    "@unocss/preset-icons",
    "@unocss/preset-wind4",
    "@unocss/transformer-directives",
    "@vue/test-utils",
    "unplugin-starter"
)

foreach ($dep in $unused_dev_deps) {
    Write-Host "  移除开发依赖: $dep" -ForegroundColor Magenta
}

# 可能需要保留的依赖（需要手动确认）
Write-Host "`n⚠️ 需要手动确认的依赖：" -ForegroundColor Cyan
$manual_check = @(
    "@types/dompurify",
    "@vscode/markdown-it-katex", 
    "dompurify",
    "vue-draggable-plus",
    "zod"
)

foreach ($dep in $manual_check) {
    Write-Host "  需要确认: $dep - 可能在动态导入或配置中使用" -ForegroundColor Cyan
}

Write-Host "`n📊 优化统计：" -ForegroundColor Green
Write-Host "  - 生产依赖可移除: $($unused_deps.Count + $duplicate_deps.Count + $manual_check.Count)" 
Write-Host "  - 开发依赖可移除: $($unused_dev_deps.Count)"
Write-Host "  - 总计可移除: $($unused_deps.Count + $duplicate_deps.Count + $manual_check.Count + $unused_dev_deps.Count)"

# 执行移除（取消注释以执行）
$confirm = Read-Host "`n是否执行依赖移除？(y/N)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host "`n🗑️ 开始移除依赖..." -ForegroundColor Red
    
    # 合并所有要移除的依赖
    $all_deps_to_remove = $unused_deps + $duplicate_deps + $unused_dev_deps
    
    if ($all_deps_to_remove.Count -gt 0) {
        $deps_string = $all_deps_to_remove -join " "
        Write-Host "执行: npm uninstall $deps_string"
        npm uninstall $deps_string
        
        Write-Host "`n✅ 依赖移除完成！" -ForegroundColor Green
        Write-Host "请运行以下命令验证项目：" -ForegroundColor Yellow
        Write-Host "  npm run build"
        Write-Host "  npm run test:unit"
        Write-Host "  npm run dev"
    }
} else {
    Write-Host "`n取消操作。您可以手动移除依赖。" -ForegroundColor Yellow
}
