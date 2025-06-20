# IMISLab Project Unified Startup Script
# Starts Redis, Backend, and Frontend in sequence

param(
    [switch]$SkipRedis = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "IMISLab Project Startup Script" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\start.ps1           # Start all services"
    Write-Host "  .\start.ps1 -SkipRedis # Skip Redis startup"
    Write-Host "  .\start.ps1 -Help     # Show this help"
    Write-Host ""
    Write-Host "Services:"
    Write-Host "  1. Redis Server (port 6379)"
    Write-Host "  2. Backend API (port 3344)"
    Write-Host "  3. Frontend Dev (port 5173)"
    exit 0
}

Write-Host "Starting IMISLab Project..." -ForegroundColor Green
Write-Host ""

# Get project paths
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"

# Check if Redis is needed and available
if (-not $SkipRedis) {
    Write-Host "1. Starting Redis Server..." -ForegroundColor Yellow
    
    # Check if Redis is available
    try {
        $redisTest = Get-Command redis-server -ErrorAction Stop
        Write-Host "   Redis found at: $($redisTest.Source)" -ForegroundColor Green
        
        # Start Redis in background
        Start-Process -NoNewWindow -FilePath "redis-server" -ArgumentList "--port 6379"
        Write-Host "   Redis server starting on port 6379..." -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
    catch {
        Write-Host "   Redis not found in PATH" -ForegroundColor Yellow
        Write-Host "   Please install Redis or use -SkipRedis flag" -ForegroundColor Cyan
        Write-Host "   Install with: choco install redis-64" -ForegroundColor Cyan
        $continue = Read-Host "   Continue without Redis? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 1
        }
    }
}
else {
    Write-Host "1. Skipping Redis startup (as requested)" -ForegroundColor Yellow
}

Write-Host ""

# Start Backend
Write-Host "2. Starting Backend Service..." -ForegroundColor Yellow

if (!(Test-Path $BackendPath)) {
    Write-Host "   Backend directory not found: $BackendPath" -ForegroundColor Red
    exit 1
}

Set-Location $BackendPath

# Check if backend binary exists
$backendBinary = ".\backend.exe"
if (Test-Path $backendBinary) {
    Write-Host "   Found backend binary: $backendBinary" -ForegroundColor Green
    Write-Host "   Starting backend server on port 3344..." -ForegroundColor Green
    Start-Process -NoNewWindow -FilePath $backendBinary
}
else {
    Write-Host "   Backend binary not found, checking for Go..." -ForegroundColor Yellow
    
    # Check if Go is available
    try {
        Get-Command go -ErrorAction Stop
        Write-Host "   Go found, starting with 'go run main.go'..." -ForegroundColor Green
        Start-Process -NoNewWindow -FilePath "go" -ArgumentList "run", "main.go"
    }
    catch {
        Write-Host "   Go not found in PATH" -ForegroundColor Red
        Write-Host "   Please install Go or build the backend binary" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host "   Backend starting on http://localhost:3344" -ForegroundColor Green

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host ""

# Start Frontend
Write-Host "3. Starting Frontend Development Server..." -ForegroundColor Yellow

Set-Location $FrontendPath

if (!(Test-Path $FrontendPath)) {
    Write-Host "   Frontend directory not found: $FrontendPath" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeTest = Get-Command npm -ErrorAction Stop
    Write-Host "   npm found at: $($nodeTest.Source)" -ForegroundColor Green
}
catch {
    Write-Host "   npm not found in PATH" -ForegroundColor Red
    Write-Host "   Please install Node.js" -ForegroundColor Cyan
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "   Dependencies installed successfully" -ForegroundColor Green
}

Write-Host "   Starting frontend dev server..." -ForegroundColor Green
Write-Host "   Frontend will be available at http://localhost:5173" -ForegroundColor Green

# Start frontend (this will block the terminal)
npm run dev

Write-Host ""
Write-Host "Frontend development server stopped." -ForegroundColor Yellow
Write-Host "Backend and Redis may still be running in background." -ForegroundColor Cyan
