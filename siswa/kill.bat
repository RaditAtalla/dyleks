@echo off
title Hentikan Portal Siswa
echo ===================================================
echo Menghentikan layanan Portal Siswa...
echo ===================================================

echo Menghentikan Frontend di port 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo Menghentikan Backend di port 8002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8002 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo ===================================================
echo Portal Siswa telah dihentikan!
echo ===================================================
pause
