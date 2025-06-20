# IMISLab Project Stop Script
# Stops all running services

Write-Host "🛑 Stopping IMISLab Project Services..." -ForegroundColor Red
Write-Host ""

# Stop processes by name
$processesToStop = @("redis-server", "backend", "node")

foreach ($processName in $processesToStop) {
    $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
    
    if ($processes) {
        Write-Host "🔴 Stopping $processName processes..." -ForegroundColor Yellow
        foreach ($process in $processes) {
            try {
                # Check if it's our project process (by checking working directory or command line)
                if ($processName -eq "node") {
                    # Only stop node processes that might be our Vite dev server
                    $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
                    if ($commandLine -and ($commandLine -like "*vite*" -or $commandLine -like "*dev*")) {
                        $process.Kill()
                        Write-Host "   ✅ Stopped Vite dev server (PID: $($process.Id))" -ForegroundColor Green
                    }
                } else {
                    $process.Kill()
                    Write-Host "   ✅ Stopped $processName (PID: $($process.Id))" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "   ⚠️  Could not stop $processName (PID: $($process.Id))" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "ℹ️  No $processName processes found" -ForegroundColor Gray
    }
}

# Stop processes by port
$portsToCheck = @(3344, 5173, 6379)

Write-Host ""
Write-Host "🔍 Checking for processes on specific ports..." -ForegroundColor Cyan

foreach ($port in $portsToCheck) {
    try {
        $netstat = netstat -ano | Select-String ":$port "
        if ($netstat) {
            foreach ($line in $netstat) {
                $parts = $line.ToString().Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
                if ($parts.Length -ge 5) {                    $procId = $parts[-1]
                    if ($procId -match '^\d+$') {
                        try {
                            $process = Get-Process -Id $procId -ErrorAction Stop
                            $process.Kill()
                            Write-Host "   ✅ Stopped process on port $port (PID: $procId)" -ForegroundColor Green
                        }
                        catch {
                            Write-Host "   ⚠️  Could not stop process on port $port (PID: $procId)" -ForegroundColor Yellow
                        }
                    }
                }
            }
        }
    }
    catch {
        # netstat command might fail, continue
    }
}

Write-Host ""
Write-Host "✅ Stop script completed!" -ForegroundColor Green
Write-Host "💡 All IMISLab services should now be stopped." -ForegroundColor Cyan
