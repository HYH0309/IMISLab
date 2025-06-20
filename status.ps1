# IMISLab Project Status Check Script
# Check if all services are running

Write-Host "IMISLab Project Status Check" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port, $ServiceName)    try {
        $tcpConnection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($tcpConnection) {
            Write-Host "[OK] $ServiceName is running on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[NO] $ServiceName is NOT running on port $Port" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "[NO] $ServiceName is NOT running on port $Port" -ForegroundColor Red
        return $false
    }
}

# Check services
$redisRunning = Test-Port -Port 6379 -ServiceName "Redis Server"
$backendRunning = Test-Port -Port 3344 -ServiceName "Backend API"
$frontendRunning = Test-Port -Port 5173 -ServiceName "Frontend Dev Server"

Write-Host ""

# Summary
if ($redisRunning -and $backendRunning -and $frontendRunning) {
    Write-Host "All services are running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:3344" -ForegroundColor White
    Write-Host "   Redis:    localhost:6379" -ForegroundColor White
} else {
    Write-Host "Some services are not running:" -ForegroundColor Yellow
    if (-not $redisRunning) { Write-Host "   - Redis Server (port 6379)" -ForegroundColor Red }
    if (-not $backendRunning) { Write-Host "   - Backend API (port 3344)" -ForegroundColor Red }
    if (-not $frontendRunning) { Write-Host "   - Frontend Dev Server (port 5173)" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Run '.\start.ps1' to start all services" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Available Commands:" -ForegroundColor Cyan
Write-Host "   .\start.ps1    - Start all services"
Write-Host "   .\stop.ps1     - Stop all services"
Write-Host "   .\status.ps1   - Check service status"
