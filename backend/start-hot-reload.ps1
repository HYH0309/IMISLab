# Go 后端热重载启动脚本 - 简化版本
Write-Host "🔥 启动 Go 后端热重载..." -ForegroundColor Green

# 设置环境变量
$env:GOROOT = "E:\GO"
$env:PATH = $env:PATH + ";E:\GO\bin;E:\GO\go\workspace\bin"

# 进入后端目录
Set-Location "E:\IDEPLAYTEST\IMISLab\backend"

# 确保tmp目录存在
if (-not (Test-Path "tmp")) {
    New-Item -ItemType Directory -Path "tmp" -Force | Out-Null
}

# 启动 Air
Write-Host "启动 Air..." -ForegroundColor Cyan
& air

Write-Host "Air 已停止" -ForegroundColor Yellow
