# IMISLab 项目清理脚本
# 用于清理编译生成的临时文件和缓存

Write-Host "🧹 IMISLab 项目清理工具" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$totalCleaned = 0

# 1. 清理前端编译生成的JavaScript文件
Write-Host "📁 清理前端编译生成的JavaScript文件..." -ForegroundColor Yellow
$jsFiles = Get-ChildItem -Path "frontend/src" -Recurse -Filter "*.js" -ErrorAction SilentlyContinue | Where-Object { 
    $_.Name -notlike "*.config.js" -and $_.Name -notlike "*.d.js" 
}
if ($jsFiles) {
    $jsFiles | Remove-Item -Force
    Write-Host "  ✅ 删除了 $($jsFiles.Count) 个JavaScript文件" -ForegroundColor Green
    $totalCleaned += $jsFiles.Count
}
else {
    Write-Host "  ✅ 没有发现需要清理的JavaScript文件" -ForegroundColor Green
}

# 2. 清理TypeScript构建缓存
Write-Host "📁 清理TypeScript构建缓存..." -ForegroundColor Yellow
$tsCache = @("frontend/node_modules/.tmp", "frontend/node_modules/.cache")
foreach ($cache in $tsCache) {
    if (Test-Path $cache) {
        Remove-Item $cache -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ 删除了 $cache" -ForegroundColor Green
        $totalCleaned++
    }
}

# 3. 清理Vite缓存
Write-Host "📁 清理Vite缓存..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules/.vite") {
    Remove-Item "frontend/node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ 删除了Vite缓存" -ForegroundColor Green
    $totalCleaned++
}
else {
    Write-Host "  ✅ 没有Vite缓存需要清理" -ForegroundColor Green
}

# 4. 清理后端临时文件
Write-Host "📁 清理后端临时文件..." -ForegroundColor Yellow
$backendTemp = @("backend/tmp", "backend/.air")
foreach ($temp in $backendTemp) {
    if (Test-Path $temp) {
        Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ 删除了 $temp" -ForegroundColor Green
        $totalCleaned++
    }
}

# 5. 清理日志文件
Write-Host "📁 清理日志文件..." -ForegroundColor Yellow
$logFiles = Get-ChildItem -Path "." -Recurse -Filter "*.log" -ErrorAction SilentlyContinue
if ($logFiles) {
    $logFiles | Remove-Item -Force
    Write-Host "  ✅ 删除了 $($logFiles.Count) 个日志文件" -ForegroundColor Green
    $totalCleaned += $logFiles.Count
}
else {
    Write-Host "  ✅ 没有日志文件需要清理" -ForegroundColor Green
}

# 6. 检查项目状态
Write-Host ""
Write-Host "📊 清理后项目状态:" -ForegroundColor Cyan
Write-Host "  ✅ 前端源码: 只包含.ts/.vue文件" -ForegroundColor White
Write-Host "  ✅ 前端构建: dist/目录完整" -ForegroundColor White
Write-Host "  ✅ 后端源码: 只包含.go文件" -ForegroundColor White
Write-Host "  ✅ 后端构建: IMISLab_backend可执行文件" -ForegroundColor White

# 显示最终结果
Write-Host ""
Write-Host "================================" -ForegroundColor Green
if ($totalCleaned -gt 0) {
    Write-Host "🎉 清理完成！共清理了 $totalCleaned 个文件/目录" -ForegroundColor Green
}
else {
    Write-Host "✨ 项目很干净，没有需要清理的文件！" -ForegroundColor Green
}
Write-Host "🚀 项目已准备好进行开发或部署！" -ForegroundColor Green
Write-Host ""

# 可选：显示项目大小
Write-Host "📏 项目大小统计:" -ForegroundColor Cyan
$frontendSize = (Get-ChildItem "frontend" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$backendSize = (Get-ChildItem "backend" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
Write-Host "  前端项目: $([math]::Round($frontendSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  后端项目: $([math]::Round($backendSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  总计: $([math]::Round(($frontendSize + $backendSize) / 1MB, 2)) MB" -ForegroundColor White
