# Redis 本地启动脚本
# 使用方法: .\start-redis-local.ps1

Write-Host "=== Redis 本地启动脚本 ===" -ForegroundColor Cyan

# 检查Redis是否已安装
if (-not (Get-Command redis-server -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Redis未安装" -ForegroundColor Red
    Write-Host "请选择安装方式:" -ForegroundColor Yellow
    Write-Host "1. Chocolatey: choco install redis-64" -ForegroundColor White
    Write-Host "2. 手动下载: https://github.com/microsoftarchive/redis/releases" -ForegroundColor White
    Write-Host "3. WSL2: sudo apt install redis-server" -ForegroundColor White
    exit 1
}

# 检查Redis是否已在运行
$redisProcess = Get-Process redis-server -ErrorAction SilentlyContinue
if ($redisProcess) {
    Write-Host "⚠️  Redis已在运行 (PID: $($redisProcess.Id))" -ForegroundColor Yellow
    $choice = Read-Host "是否重启Redis? (y/N)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Stop-Process -Name redis-server -Force
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host "✅ 使用现有Redis服务" -ForegroundColor Green
        exit 0
    }
}

# 启动Redis服务器
Write-Host "🚀 启动Redis服务器..." -ForegroundColor Green
Write-Host "配置: 端口6379, 最大内存1GB, 持久化每5分钟" -ForegroundColor Gray

try {
    # 启动Redis (后台运行)
    Start-Process -FilePath "redis-server" -ArgumentList @(
        "--port", "6379",
        "--maxmemory", "1gb", 
        "--maxmemory-policy", "allkeys-lru",
        "--save", "300", "1",
        "--daemonize", "no"
    ) -NoNewWindow -PassThru
    
    # 等待Redis启动
    Start-Sleep -Seconds 3
    
    # 测试连接
    $pingResult = redis-cli ping 2>$null
    if ($pingResult -eq "PONG") {
        Write-Host "✅ Redis启动成功!" -ForegroundColor Green
        Write-Host "🔗 连接信息: localhost:6379" -ForegroundColor Cyan
        Write-Host "📊 Redis状态:" -ForegroundColor Cyan
        redis-cli info server | Select-String "redis_version|uptime_in_seconds|used_memory_human"
    }
    else {
        Write-Host "❌ Redis启动失败" -ForegroundColor Red
    }
    
}
catch {
    Write-Host "❌ 启动Redis时发生错误: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n💡 提示:" -ForegroundColor Yellow
Write-Host "- 停止Redis: Ctrl+C 或关闭窗口" -ForegroundColor White
Write-Host "- 测试连接: redis-cli ping" -ForegroundColor White
Write-Host "- 查看状态: redis-cli info" -ForegroundColor White
