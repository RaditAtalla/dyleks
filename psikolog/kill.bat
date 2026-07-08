@echo off
title Hentikan Portal Psikolog
echo ===================================================
echo Menghentikan layanan Portal Psikolog...
echo ===================================================

echo Menghentikan Frontend di port 8005...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8005 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo Menghentikan Backend di port 8006...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8006 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo ===================================================
echo Portal Psikolog telah dihentikan!
echo ===================================================
pause
