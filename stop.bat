@echo off
chcp 65001 >nul
REM ����ֹͣ���з���
echo ? ����ֹͣ���� IMISLab ����...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Stop
echo.
echo ��������ر�...
pause >nul
