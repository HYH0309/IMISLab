@echo off
chcp 65001 >nul
REM IMISLab ��Ŀ�����������ļ�
REM ���ļ���������ִ�� PowerShell �ű�

echo �������� IMISLab ��Ŀ...
echo.

REM ��� PowerShell �Ƿ����
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ����PATH ���Ҳ��� PowerShell
    echo �밲װ PowerShell ���ֶ����нű�
    pause
    exit /b 1
)

REM ��ȡ�������ļ�����Ŀ¼
set "SCRIPT_DIR=%~dp0"

REM ʹ���ƹ�ִ�в������� PowerShell �ű�
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start.ps1" %*

REM ������ִ��󣬱��ִ��ڴ�
if %errorlevel% neq 0 (
    echo.
    echo �ű�ִ��ʧ�ܡ���������ر�...
    pause >nul
)
