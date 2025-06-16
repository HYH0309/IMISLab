# Frontend and Backend Project Startup Script
# PowerShell Script

Write-Host "Starting Frontend and Backend Project..." -ForegroundColor Green

# Get project root directory
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"

# Check if paths exist
if (!(Test-Path $BackendPath)) {
    Write-Host "Backend directory does not exist: $BackendPath" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $FrontendPath)) {
    Write-Host "Frontend directory does not exist: $FrontendPath" -ForegroundColor Red
    exit 1
}

# Function: Check if port is in use
function Test-Port {
    param($Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet
        return $connection
    }
    catch {
        return $false
    }
}

# Check common ports
$BackendPort = 3344
$FrontendPort = 5173

if (Test-Port $BackendPort) {
    Write-Host "Port $BackendPort is already in use, backend may not start" -ForegroundColor Yellow
}

if (Test-Port $FrontendPort) {
    Write-Host "Port $FrontendPort is already in use, frontend may not start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Startup Steps:"
Write-Host "1. Check and install frontend dependencies"
Write-Host "2. Start backend service (Go)"
Write-Host "3. Start frontend development server (Vite)"
Write-Host ""

# Step 1: Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Cyan
Set-Location $FrontendPath

if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend dependency installation failed" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "Frontend dependencies already exist, verifying..." -ForegroundColor Green
    # Check if vite is properly installed
    if (!(Test-Path "node_modules\vite")) {
        Write-Host "Vite not found, reinstalling dependencies..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Frontend dependency installation failed" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "Dependencies verified successfully" -ForegroundColor Green
    }
}

# Step 2: Start backend
Write-Host ""
Write-Host "Starting backend service..." -ForegroundColor Cyan
Set-Location $BackendPath

if (!(Get-Command "go" -ErrorAction SilentlyContinue)) {
    Write-Host "Go is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

$BackendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host 'Starting backend server...' -ForegroundColor Green; go run main.go" -PassThru
Write-Host "Backend server starting... (PID: $($BackendJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# Step 3: Start frontend
Write-Host ""
Write-Host "Starting frontend development server..." -ForegroundColor Cyan
Set-Location $FrontendPath

if (!(Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js/npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

$FrontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host 'Starting frontend development server...' -ForegroundColor Green; npm run dev" -PassThru
Write-Host "Frontend development server starting... (PID: $($FrontendJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Project startup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access URLs:"
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:3344" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop services:"
Write-Host "   Press Ctrl+C in each terminal window"
Write-Host ""
Write-Host "Note: This script will open two new PowerShell windows to run frontend and backend services"

Set-Location $ProjectRoot

$OpenBrowser = Read-Host "Open browser automatically? (y/n)"
if ($OpenBrowser -eq "y" -or $OpenBrowser -eq "Y") {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:5173"
}
