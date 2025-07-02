@echo off
chcp 65001 >nul
REM 快速状态检查
echo ? 检查 IMISLab 服务状态...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Status
echo.
echo 按任意键关闭...
pause >nul
