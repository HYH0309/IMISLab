# Redis 本地安装指南 (Windows)

## 方法1: 使用 Chocolatey 安装 (推荐)

```powershell
# 安装 Chocolatey (如果还没有)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 安装 Redis
choco install redis-64

# 启动 Redis 服务
redis-server
```

## 方法2: 手动下载安装

1. 下载 Redis for Windows: <https://github.com/microsoftarchive/redis/releases>
2. 解压到 `C:\Redis\` 目录
3. 将 `C:\Redis\` 添加到系统PATH环境变量

## 方法3: 使用 WSL2 (Linux子系统)

```bash
# 在WSL2中安装Redis
sudo apt update
sudo apt install redis-server

# 启动Redis
sudo service redis-server start

# 测试连接
redis-cli ping
```

## 快速启动脚本

创建 `start-redis-local.ps1`:

```powershell
# 检查Redis是否已安装
if (Get-Command redis-server -ErrorAction SilentlyContinue) {
    Write-Host "启动本地Redis服务器..." -ForegroundColor Green
    redis-server --port 6379 --maxmemory 1gb --maxmemory-policy allkeys-lru --save 300 1
} else {
    Write-Host "Redis未安装，请先安装Redis" -ForegroundColor Red
    Write-Host "可以使用: choco install redis-64" -ForegroundColor Yellow
}
```

## 验证安装

```powershell
# 测试Redis连接
redis-cli ping
# 应该返回 PONG

# 查看Redis信息
redis-cli info server
```
