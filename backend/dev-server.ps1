# 后端热重载启动脚本
param(
    [string]$Port = "3344"
)

Write-Host "🔥 启动 Go 后端热重载服务..." -ForegroundColor Green
Write-Host "端口: $Port" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Cyan
Write-Host "=" * 50

$BackendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $BackendPath

# 初始构建
Write-Host "📦 初始构建..." -ForegroundColor Blue
go build -o tmp/main.exe .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

# 启动主进程
$job = Start-Job -ScriptBlock {
    param($path, $port)
    Set-Location $path
    $env:SERVER_PORT = $port
    & "./tmp/main.exe"
} -ArgumentList $BackendPath, $Port

Write-Host "🚀 后端服务已启动 (PID: $($job.Id))" -ForegroundColor Green

# 文件监视器
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $BackendPath
$watcher.Filter = "*.go"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# 重载函数
function Reload-Server {
    Write-Host "`n🔄 检测到文件变化，重新构建..." -ForegroundColor Yellow
    
    # 停止当前进程
    Stop-Job $job -Force
    Remove-Job $job -Force
    
    # 清理端口
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($proc in $processes) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        # 忽略错误
    }
    
    Start-Sleep -Seconds 1
    
    # 重新构建
    go build -o tmp/main.exe .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 构建失败，等待下次修改..." -ForegroundColor Red
        return
    }
    
    # 重新启动
    $script:job = Start-Job -ScriptBlock {
        param($path, $port)
        Set-Location $path
        $env:SERVER_PORT = $port
        & "./tmp/main.exe"
    } -ArgumentList $BackendPath, $Port
    
    Write-Host "✅ 服务重启成功 (PID: $($job.Id))" -ForegroundColor Green
}

# 注册事件处理器
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
    $changeType = $Event.SourceEventArgs.ChangeType
    $filePath = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    
    if ($name -match "\.go$" -and $changeType -eq "Changed") {
        Write-Host "📝 文件已修改: $name" -ForegroundColor Cyan
        Start-Sleep -Milliseconds 500  # 防抖
        Reload-Server
    }
} | Out-Null

try {
    Write-Host "👀 正在监视 .go 文件变化..." -ForegroundColor Magenta
    
    # 保持脚本运行
    while ($true) {
        Start-Sleep -Seconds 1
        
        # 检查作业状态
        if ($job.State -eq "Failed" -or $job.State -eq "Stopped") {
            Write-Host "⚠️  服务意外停止，尝试重启..." -ForegroundColor Yellow
            Reload-Server
        }
    }
}
catch {
    Write-Host "❌ 发生错误: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # 清理
    Write-Host "`n🧹 清理资源..." -ForegroundColor Yellow
    
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    
    if ($job) {
        Stop-Job $job -Force
        Remove-Job $job -Force
    }
    
    # 清理端口
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($proc in $processes) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        # 忽略错误
    }
    
    Write-Host "👋 热重载服务已停止" -ForegroundColor Green
}
