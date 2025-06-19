# Redis 启动脚本 (Windows PowerShell)

Write-Host "🔄 启动 Redis 服务..." -ForegroundColor Blue

# 检查 Docker 是否运行
try {
    docker info | Out-Null
}
catch {
    Write-Host "❌ 错误: Docker 未运行，请先启动 Docker" -ForegroundColor Red
    exit 1
}

# 启动 Redis 服务
Write-Host "🚀 启动 Docker Compose..." -ForegroundColor Yellow
docker-compose up -d redis

# 等待 Redis 启动
Write-Host "⏳ 等待 Redis 服务启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 检查 Redis 连接
try {
    $pingResult = docker-compose exec redis redis-cli ping
    if ($pingResult -match "PONG") {
        Write-Host "✅ Redis 服务启动成功！" -ForegroundColor Green
        Write-Host "📊 Redis 管理界面: http://localhost:8081" -ForegroundColor Cyan
        Write-Host "🔌 Redis 连接地址: localhost:6379" -ForegroundColor Cyan
    }
    else {
        throw "Ping failed"
    }
}
catch {
    Write-Host "❌ Redis 服务启动失败" -ForegroundColor Red
    docker-compose logs redis
    exit 1
}
