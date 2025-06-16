# 生产环境部署脚本
# PowerShell 脚本

Write-Host "🏭 开始生产环境构建和部署..." -ForegroundColor Green

# 获取项目根目录
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"
$DistPath = Join-Path $ProjectRoot "dist"

# 创建部署目录
if (Test-Path $DistPath) {
    Write-Host "🧹 清理旧的构建文件..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $DistPath
}
New-Item -ItemType Directory -Path $DistPath | Out-Null

Write-Host ""
Write-Host "📋 部署步骤："
Write-Host "1. 安装前端依赖"
Write-Host "2. 构建前端项目"
Write-Host "3. 构建后端可执行文件"
Write-Host "4. 整理部署文件"
Write-Host ""

# 步骤1: 安装前端依赖
Write-Host "📦 安装前端依赖..." -ForegroundColor Cyan
Set-Location $FrontendPath

if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 前端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ 前端依赖已存在" -ForegroundColor Green
}

# 步骤2: 构建前端
Write-Host ""
Write-Host "🛠️ 构建前端项目..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 前端构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 前端构建完成" -ForegroundColor Green

# 步骤3: 构建后端
Write-Host ""
Write-Host "🔨 构建后端可执行文件..." -ForegroundColor Cyan
Set-Location $BackendPath

# 检查 Go 是否安装
if (!(Get-Command "go" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Go 未安装或不在 PATH 中" -ForegroundColor Red
    exit 1
}

# 构建 Windows 版本
go build -ldflags "-s -w" -o "backend.exe" main.go
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 后端构建失败" -ForegroundColor Red
    exit 1
}

# 构建 Linux 版本
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -ldflags "-s -w" -o "backend-linux" main.go
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Linux 版本构建失败" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Linux 版本构建完成" -ForegroundColor Green
}

# 重置环境变量
$env:GOOS = ""
$env:GOARCH = ""

Write-Host "✅ 后端构建完成" -ForegroundColor Green

# 步骤4: 整理部署文件
Write-Host ""
Write-Host "📦 整理部署文件..." -ForegroundColor Cyan
Set-Location $ProjectRoot

# 复制前端构建产物
$FrontendDistPath = Join-Path $FrontendPath "dist"
if (Test-Path $FrontendDistPath) {
    Copy-Item -Recurse -Path $FrontendDistPath -Destination (Join-Path $DistPath "frontend")
    Write-Host "✅ 前端文件已复制" -ForegroundColor Green
}
else {
    Write-Host "❌ 前端构建产物不存在" -ForegroundColor Red
    exit 1
}

# 复制后端可执行文件
Copy-Item -Path (Join-Path $BackendPath "backend.exe") -Destination $DistPath
if (Test-Path (Join-Path $BackendPath "backend-linux")) {
    Copy-Item -Path (Join-Path $BackendPath "backend-linux") -Destination $DistPath
}
Write-Host "✅ 后端文件已复制" -ForegroundColor Green

# 复制配置文件和文档
$ConfigFiles = @("README.md", "一键启动指南.md")
foreach ($file in $ConfigFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $DistPath
    }
}

# 创建生产环境启动脚本
$ProductionScript = @"
@echo off
title 生产环境服务器

echo 🚀 启动生产环境服务器...
echo.

echo 📱 服务地址:
echo    前端: http://localhost:8080/static/
echo    后端: http://localhost:8080/api/
echo.

backend.exe
pause
"@

Set-Content -Path (Join-Path $DistPath "start-production.bat") -Value $ProductionScript -Encoding UTF8

# 创建部署说明
$DeploymentGuide = @"
# 🏭 生产环境部署指南

## 📦 部署文件

- \`backend.exe\` - Windows 后端可执行文件
- \`backend-linux\` - Linux 后端可执行文件
- \`frontend/\` - 前端静态文件
- \`start-production.bat\` - Windows 启动脚本

## 🚀 快速部署

### Windows 部署

1. 将所有文件上传到服务器
2. 运行 \`start-production.bat\`
3. 访问 http://localhost:8080

### Linux 部署

1. 上传文件到服务器
2. 给后端程序执行权限: \`chmod +x backend-linux\`
3. 运行: \`./backend-linux\`
4. 访问 http://localhost:8080

## ⚙️ 配置

### 环境变量

在后端目录创建 \`.env\` 文件:

\`\`\`
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=learning_platform
\`\`\`

### 反向代理 (Nginx)

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend;
        try_files \$uri \$uri/ /index.html;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
\`\`\`

## 📋 系统要求

- **Windows**: Windows Server 2016+ 或 Windows 10+
- **Linux**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **内存**: 建议 2GB+
- **存储**: 建议 10GB+
- **数据库**: MySQL 5.7+ 或 MariaDB 10.3+
"@

Set-Content -Path (Join-Path $DistPath "DEPLOYMENT.md") -Value $DeploymentGuide -Encoding UTF8

Write-Host "✅ 部署文件整理完成" -ForegroundColor Green

# 显示结果
Write-Host ""
Write-Host "🎉 生产环境构建完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📁 部署文件位置: $DistPath"
Write-Host ""
Write-Host "📋 部署文件列表:"
Get-ChildItem -Path $DistPath -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace($DistPath, "").TrimStart("\")
    if ($_.PSIsContainer) {
        Write-Host "   📁 $relativePath/" -ForegroundColor Cyan
    }
    else {
        $size = [math]::Round($_.Length / 1MB, 2)
        Write-Host "   📄 $relativePath ($size MB)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "🚀 下一步:"
Write-Host "   1. 配置数据库连接"
Write-Host "   2. 上传文件到服务器"
Write-Host "   3. 运行 start-production.bat (Windows) 或 ./backend-linux (Linux)"
Write-Host ""
Write-Host "📚 详细部署说明请查看: $DistPath\DEPLOYMENT.md"

# 询问是否打开部署目录
$OpenFolder = Read-Host "是否打开部署目录? (y/n)"
if ($OpenFolder -eq "y" -or $OpenFolder -eq "Y") {
    Invoke-Item $DistPath
}
