@echo off
chcp 65001 >nul
REM 快速停止所有服务
echo ? 正在停止所有 IMISLab 服务...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Stop
echo.
echo 按任意键关闭...
pause >nul
