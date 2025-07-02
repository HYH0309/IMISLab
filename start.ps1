# IMISLab Project Unified Startup Script
# Starts Redis, Backend, and Frontend in sequence

param(
    [switch]$SkipRedis = $false,
    [switch]$Help = $false,
    [switch]$Stop = $false,
    [switch]$Status = $false,
    [switch]$NoInteractive = $false
)

# Helper Functions
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        "INFO" { "Cyan" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Stop-ProjectServices {
    Write-Log "Stopping IMISLab services..." "INFO"
    
    # Stop processes by name
    $processes = @("redis-server", "backend", "main", "node")
    foreach ($processName in $processes) {
        $runningProcesses = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($runningProcesses) {
            Write-Log "Stopping $processName processes..." "WARN"
            $runningProcesses | Stop-Process -Force
        }
    }
    
    # Stop processes by port
    $ports = @(6379, 3344, 5173)
    foreach ($port in $ports) {
        $netstat = netstat -ano | Select-String ":$port "
        if ($netstat) {
            $processId = ($netstat -split '\s+')[-1]
            if ($processId -and $processId -ne "0") {
                Write-Log "Stopping process on port $port (PID: $processId)" "WARN"
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
    
    Write-Log "All services stopped." "SUCCESS"
    exit 0
}

function Show-Status {
    Write-Log "IMISLab Services Status:" "INFO"
    
    $services = @(
        @{Name = "Redis"; Port = 6379 },
        @{Name = "Backend"; Port = 3344 },
        @{Name = "Frontend"; Port = 5173 }
    )
    
    foreach ($service in $services) {
        $status = if (Test-Port $service.Port) { "RUNNING" } else { "STOPPED" }
        $color = if ($status -eq "RUNNING") { "Green" } else { "Red" }
        Write-Host "  $($service.Name) (port $($service.Port)): " -NoNewline
        Write-Host $status -ForegroundColor $color
    }
    exit 0
}

if ($Stop) { Stop-ProjectServices }
if ($Status) { Show-Status }

if ($Help) {
    Write-Host "IMISLab Project Startup Script" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\start.ps1           # Start all services"
    Write-Host "  .\start.ps1 -SkipRedis # Skip Redis startup"
    Write-Host "  .\start.ps1 -Stop     # Stop all services"
    Write-Host "  .\start.ps1 -Status   # Show services status"
    Write-Host "  .\start.ps1 -Help     # Show this help"
    Write-Host ""
    Write-Host "Services:"
    Write-Host "  1. Redis Server (port 6379)"
    Write-Host "  2. Backend API (port 3344)"
    Write-Host "  3. Frontend Dev (port 5173)"
    exit 0
}

Write-Log "Starting IMISLab Project..." "SUCCESS"

# Get project paths
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"
$RedisPath = Join-Path $ProjectRoot "redis"

# Validate all required paths exist
if (!(Test-Path $BackendPath)) {
    Write-Log "Backend directory not found: $BackendPath" "ERROR"
    exit 1
}
if (!(Test-Path $FrontendPath)) {
    Write-Log "Frontend directory not found: $FrontendPath" "ERROR"
    exit 1
}
if (-not $SkipRedis -and !(Test-Path $RedisPath)) {
    Write-Log "Redis directory not found: $RedisPath" "ERROR"
    exit 1
}

# Check for port conflicts
$conflictPorts = @()
if (-not $SkipRedis -and (Test-Port 6379)) { $conflictPorts += "6379 (Redis)" }
if (Test-Port 3344) { $conflictPorts += "3344 (Backend)" }
if (Test-Port 5173) { $conflictPorts += "5173 (Frontend)" }

if ($conflictPorts.Count -gt 0) {
    Write-Log "Port conflicts detected:" "WARN"
    foreach ($port in $conflictPorts) {
        Write-Log "  Port $port is already in use" "WARN"
    }
    if (-not $NoInteractive) {
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Log "Use '.\start.ps1 -Stop' to stop existing services" "INFO"
            exit 1
        }
    }
    else {
        Write-Log "Non-interactive mode: Stopping conflicting services..." "INFO"
        Stop-ProjectServices
        Start-Sleep -Seconds 2
    }
}

# Check if Redis is needed and available
if (-not $SkipRedis) {
    Write-Log "Starting Redis Server..." "INFO"
    
    # Use local Redis from project folder
    $redisServer = Join-Path $RedisPath "redis-server.exe"
    $redisConfig = Join-Path $RedisPath "redis.windows.conf"
    
    if (Test-Path $redisServer) {
        Write-Log "Using local Redis at: $redisServer" "SUCCESS"
        
        # Save current location and change to Redis directory
        $originalLocation = Get-Location
        Set-Location $RedisPath
        
        try {
            # Start Redis in background with config file
            if (Test-Path $redisConfig) {
                $redisProcess = Start-Process -NoNewWindow -FilePath $redisServer -ArgumentList $redisConfig -PassThru
                Write-Log "Redis server starting with config file..." "SUCCESS"
            }
            else {
                $redisProcess = Start-Process -NoNewWindow -FilePath $redisServer -ArgumentList "--port 6379" -PassThru
                Write-Log "Redis server starting on port 6379..." "SUCCESS"
            }
            
            # Wait and verify Redis started
            Start-Sleep -Seconds 3
            if (Test-Port 6379) {
                Write-Log "Redis server is running (PID: $($redisProcess.Id))" "SUCCESS"
            }
            else {
                Write-Log "Redis may have failed to start" "WARN"
            }
        }
        catch {
            Write-Log "Failed to start Redis: $($_.Exception.Message)" "ERROR"
        }
        finally {
            # Restore original location
            Set-Location $originalLocation
        }
    }
    else {
        Write-Log "Local Redis not found at: $redisServer" "ERROR"
        Write-Log "Please ensure redis-server.exe exists in the redis folder" "INFO"
        if (-not $NoInteractive) {
            $continue = Read-Host "Continue without Redis? (y/N)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                exit 1
            }
        }
        else {
            Write-Log "Non-interactive mode: Continuing without Redis..." "WARN"
        }
    }
}
else {
    Write-Log "Skipping Redis startup (as requested)" "INFO"
}

# Start Backend
Write-Log "Starting Backend Service..." "INFO"

# Save current location and change to backend directory
$originalLocation = Get-Location
Set-Location $BackendPath

try {
    # Check if backend binary exists
    $backendBinary = ".\backend.exe"
    if (Test-Path $backendBinary) {
        Write-Log "Found backend binary: $backendBinary" "SUCCESS"
        $backendProcess = Start-Process -NoNewWindow -FilePath $backendBinary -PassThru
        Write-Log "Backend server starting (PID: $($backendProcess.Id))..." "SUCCESS"
    }
    else {
        Write-Log "Backend binary not found, checking for Go..." "INFO"
        
        # Check if Go is available
        try {
            $goVersion = & go version 2>$null
            Write-Log "Go found: $goVersion" "SUCCESS"
            $backendProcess = Start-Process -NoNewWindow -FilePath "go" -ArgumentList "run", "main.go" -PassThru
            Write-Log "Backend starting with 'go run main.go' (PID: $($backendProcess.Id))..." "SUCCESS"
        }
        catch {
            Write-Log "Go not found in PATH" "ERROR"
            Write-Log "Please install Go or build the backend binary" "INFO"
            return
        }
    }

    # Wait and verify backend started
    Write-Log "Waiting for backend to start..." "INFO"
    $maxWait = 10
    $waited = 0
    do {
        Start-Sleep -Seconds 1
        $waited++
        if (Test-Port 3344) {
            Write-Log "Backend is running on http://localhost:3344" "SUCCESS"
            break
        }
    } while ($waited -lt $maxWait)
    
    if ($waited -ge $maxWait) {
        Write-Log "Backend may have failed to start (timeout after ${maxWait}s)" "WARN"
    }
}
catch {
    Write-Log "Failed to start backend: $($_.Exception.Message)" "ERROR"
}
finally {
    # Restore original location
    Set-Location $originalLocation
}

# Start Frontend
Write-Log "Starting Frontend Development Server..." "INFO"

# Save current location and change to frontend directory
$originalLocation = Get-Location
Set-Location $FrontendPath

try {
    # Check if Node.js is available
    try {
        $nodeVersion = & npm --version 2>$null
        Write-Log "npm found (version: $nodeVersion)" "SUCCESS"
    }
    catch {
        Write-Log "npm not found in PATH" "ERROR"
        Write-Log "Please install Node.js" "INFO"
        return
    }

    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Log "Installing frontend dependencies..." "INFO"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Failed to install dependencies" "ERROR"
            return
        }
        Write-Log "Dependencies installed successfully" "SUCCESS"
    }

    Write-Log "Starting frontend dev server..." "SUCCESS"
    Write-Log "Frontend will be available at http://localhost:5173" "INFO"
    Write-Log "Press Ctrl+C to stop all services" "INFO"

    # Start frontend (this will block the terminal)
    npm run dev
}
catch {
    Write-Log "Failed to start frontend: $($_.Exception.Message)" "ERROR"
}
finally {
    # Restore original location
    Set-Location $originalLocation
    Write-Log "Frontend development server stopped." "WARN"
    Write-Log "Backend and Redis may still be running in background." "INFO"
    Write-Log "Use '.\start.ps1 -Stop' to stop all services" "INFO"
}
