@echo off
title Hentikan Portal Guru
echo ===================================================
echo Menghentikan layanan Portal Guru...
echo ===================================================

echo Menghentikan Frontend di port 8003...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8003 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo Menghentikan Backend di port 8004...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8004 ^| findstr LISTENING') do (
    echo Menghentikan PID: %%a
    taskkill /f /pid %%a
)

echo ===================================================
echo Portal Guru telah dihentikan!
echo ===================================================
pause
