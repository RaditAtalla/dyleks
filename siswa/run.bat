@echo off
title DyLeks Siswa (Student Portal)
echo ===================================================
echo Memulai Frontend dan Backend untuk Portal Siswa...
echo ===================================================

:: Jalankan backend di window baru
echo Menjalankan Backend FastAPI di port 8002...
start cmd /k "cd backend && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload"

:: Jalankan frontend di window baru
echo Menjalankan Frontend Next.js di port 8001...
start cmd /k "cd frontend && npm run dev"

echo ===================================================
echo Portal Siswa berhasil diluncurkan!
echo ===================================================
pause
