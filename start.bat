@echo off
chcp 65001 >nul
REM IMISLab 项目启动批处理文件
REM 此文件可以轻松执行 PowerShell 脚本

echo 正在启动 IMISLab 项目...
echo.

REM 检查 PowerShell 是否可用
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误：PATH 中找不到 PowerShell
    echo 请安装 PowerShell 或手动运行脚本
    pause
    exit /b 1
)

REM 获取批处理文件所在目录
set "SCRIPT_DIR=%~dp0"

REM 使用绕过执行策略运行 PowerShell 脚本
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start.ps1" %*

REM 如果出现错误，保持窗口打开
if %errorlevel% neq 0 (
    echo.
    echo 脚本执行失败。按任意键关闭...
    pause >nul
)
