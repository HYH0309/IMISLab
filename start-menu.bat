@echo off
chcp 65001 >nul
title IMISLab ��Ŀ����

:menu
cls
echo.
echo �X�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�[
echo �U          IMISLab ��Ŀ����             �U
echo �^�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�T�a
echo.
echo ��ѡ�������
echo.
echo [1] ? �������з���
echo [2] ? ������������Redis��
echo [3] ? �鿴����״̬
echo [4] ? ֹͣ���з���
echo [5] ? ��ʾ����
echo [0] ? �˳�
echo.
set /p choice="������ѡ�� (0-5): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_no_redis
if "%choice%"=="3" goto show_status
if "%choice%"=="4" goto stop_all
if "%choice%"=="5" goto show_help
if "%choice%"=="0" goto exit
echo ��Чѡ�������ѡ��...
timeout /t 2 >nul
goto menu

:start_all
echo.
echo ? �������з���...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1"
goto menu_pause

:start_no_redis
echo.
echo ? ������������Redis��...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -SkipRedis
goto menu_pause

:show_status
echo.
echo ? �鿴����״̬...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Status
goto menu_pause

:stop_all
echo.
echo ? ֹͣ���з���...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Stop
goto menu_pause

:show_help
echo.
echo ? ��ʾ����...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1" -Help
goto menu_pause

:menu_pause
echo.
echo ��������������˵�...
pause >nul
goto menu

:exit
echo �ټ���
timeout /t 1 >nul
exit /b 0
