@echo off
chcp 65001 >nul
REM ����״̬���
echo ? ��� IMISLab ����״̬...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Status
echo.
echo ��������ر�...
pause >nul
