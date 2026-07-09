@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

title DyLeks - Hentikan Semua Portal

echo =====================================================================
echo                MEMATIKAN SEMUA LAYANAN PORTAL DYLEKS
echo =====================================================================
echo.

for %%p in (8001 8002 8003 8004 8005 8006) do (
    set "PORT_PID="
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":%%p " ^| findstr LISTENING') do (
        set "PORT_PID=%%a"
    )
    
    if defined PORT_PID (
        echo Menghentikan PID !PORT_PID! pada port %%p...
        taskkill /f /pid !PORT_PID! >nul 2>&1
    ) else (
        echo Port %%p sudah bersih.
    )
)

echo.
echo =====================================================================
echo Semua proses pada port DyLeks berhasil dibersihkan!
echo =====================================================================
pause
