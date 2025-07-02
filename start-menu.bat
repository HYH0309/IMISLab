@echo off
chcp 65001 >nul
title IMISLab 项目管理

:menu
cls
echo.
echo ╔══════════════════════════════════════╗
echo ║          IMISLab 项目管理             ║
echo ╚══════════════════════════════════════╝
echo.
echo 请选择操作：
echo.
echo [1] ? 启动所有服务
echo [2] ? 启动服务（跳过Redis）
echo [3] ? 查看服务状态
echo [4] ? 停止所有服务
echo [5] ? 显示帮助
echo [0] ? 退出
echo.
set /p choice="请输入选项 (0-5): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_no_redis
if "%choice%"=="3" goto show_status
if "%choice%"=="4" goto stop_all
if "%choice%"=="5" goto show_help
if "%choice%"=="0" goto exit
echo 无效选项，请重新选择...
timeout /t 2 >nul
goto menu

:start_all
echo.
echo ? 启动所有服务...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1"
goto menu_pause

:start_no_redis
echo.
echo ? 启动服务（跳过Redis）...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -SkipRedis
goto menu_pause

:show_status
echo.
echo ? 查看服务状态...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Status
goto menu_pause

:stop_all
echo.
echo ? 停止所有服务...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Stop
goto menu_pause

:show_help
echo.
echo ? 显示帮助...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Help
goto menu_pause

:menu_pause
echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:exit
echo 再见！
timeout /t 1 >nul
exit /b 0
