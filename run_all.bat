@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

title DyLeks - Multi-Portal System Manager

:menu
cls
echo =====================================================================
echo                DYLEKS - MULTI-PORTAL SYSTEM MANAGER
echo =====================================================================
echo.
echo Silakan pilih menu di bawah ini:
echo.
echo   [1] Jalankan SEMUA Portal (Siswa, Guru, Psikolog)
echo   [2] Jalankan Portal Siswa Saja (Port 8001 ^& 8002)
echo   [3] Jalankan Portal Guru Saja (Port 8003 ^& 8004)
echo   [4] Jalankan Portal Psikolog Saja (Port 8005 ^& 8006)
echo.
echo   [5] Cek Status Port ^& Debugging
echo   [6] Matikan SEMUA Portal (Kill Port 8001-8006)
echo   [7] Inisialisasi / Reset Database (run init_db.py)
echo   [8] Install Dependensi (Python ^& Node.js)
echo   [9] Keluar
echo.
echo =====================================================================
set /p choice="Masukkan pilihan Anda (1-9): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_siswa
if "%choice%"=="3" goto start_guru
if "%choice%"=="4" goto start_psikolog
if "%choice%"=="5" goto check_status
if "%choice%"=="6" goto kill_all
if "%choice%"=="7" goto init_db
if "%choice%"=="8" goto install_deps
if "%choice%"=="9" exit
goto menu

:start_all
cls
echo =====================================================================
echo Memulai semua portal DyLeks...
echo =====================================================================
echo.
call :kill_ports_silent 8001 8002 8003 8004 8005 8006

:: 1. Jalankan Siswa
echo [1/3] Menjalankan Portal Siswa...
cd /d "%~dp0siswa\backend"
start "DyLeks Siswa Backend (8002)" cmd /k "title Siswa Backend (8002) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload"

cd /d "%~dp0siswa\frontend"
start "DyLeks Siswa Frontend (8001)" cmd /k "title Siswa Frontend (8001) && npm run dev"

:: 2. Jalankan Guru
echo [2/3] Menjalankan Portal Guru...
cd /d "%~dp0guru\backend"
start "DyLeks Guru Backend (8004)" cmd /k "title Guru Backend (8004) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8004 --reload"

cd /d "%~dp0guru\frontend"
start "DyLeks Guru Frontend (8003)" cmd /k "title Guru Frontend (8003) && npm run dev"

:: 3. Jalankan Psikolog
echo [3/3] Menjalankan Portal Psikolog...
cd /d "%~dp0psikolog\backend"
start "DyLeks Psikolog Backend (8006)" cmd /k "title Psikolog Backend (8006) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8006 --reload"

cd /d "%~dp0psikolog\frontend"
start "DyLeks Psikolog Frontend (8005)" cmd /k "title Psikolog Frontend (8005) && npm run dev"

cd /d "%~dp0"
goto show_urls

:start_siswa
cls
echo =====================================================================
echo Memulai Portal Siswa...
echo =====================================================================
echo.
call :kill_ports_silent 8001 8002
cd /d "%~dp0siswa\backend"
start "DyLeks Siswa Backend (8002)" cmd /k "title Siswa Backend (8002) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload"

cd /d "%~dp0siswa\frontend"
start "DyLeks Siswa Frontend (8001)" cmd /k "title Siswa Frontend (8001) && npm run dev"

cd /d "%~dp0"
goto show_urls

:start_guru
cls
echo =====================================================================
echo Memulai Portal Guru...
echo =====================================================================
echo.
call :kill_ports_silent 8003 8004
cd /d "%~dp0guru\backend"
start "DyLeks Guru Backend (8004)" cmd /k "title Guru Backend (8004) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8004 --reload"

cd /d "%~dp0guru\frontend"
start "DyLeks Guru Frontend (8003)" cmd /k "title Guru Frontend (8003) && npm run dev"

cd /d "%~dp0"
goto show_urls

:start_psikolog
cls
echo =====================================================================
echo Memulai Portal Psikolog...
echo =====================================================================
echo.
call :kill_ports_silent 8005 8006
cd /d "%~dp0psikolog\backend"
start "DyLeks Psikolog Backend (8006)" cmd /k "title Psikolog Backend (8006) && (if exist .venv\Scripts\activate (call .venv\Scripts\activate) else if exist ..\.venv\Scripts\activate (call ..\.venv\Scripts\activate)) && uvicorn app.main:app --host 127.0.0.1 --port 8006 --reload"

cd /d "%~dp0psikolog\frontend"
start "DyLeks Psikolog Frontend (8005)" cmd /k "title Psikolog Frontend (8005) && npm run dev"

cd /d "%~dp0"
goto show_urls

:show_urls
echo =====================================================================
echo            LAYANAN PORTAL DYLEKS BERHASIL DILUNCURKAN!
echo =====================================================================
echo.
echo Anda dapat mengakses portal melalui tautan berikut:
echo.
echo   1. Portal Siswa (Student Portal):
echo      - Frontend : http://localhost:8001
echo      - Backend  : http://localhost:8002  (Docs: http://localhost:8002/docs)
echo.
echo   2. Portal Guru (Teacher Portal):
echo      - Frontend : http://localhost:8003
echo      - Backend  : http://localhost:8004  (Docs: http://localhost:8004/docs)
echo.
echo   3. Portal Psikolog (Psychologist Portal):
echo      - Frontend : http://localhost:8005
echo      - Backend  : http://localhost:8006  (Docs: http://localhost:8006/docs)
echo.
echo =====================================================================
echo Catatan: Jika ada jendela command prompt yang langsung tertutup,
echo silakan cek dependensi atau jalankan Menu [5] untuk debugging.
echo =====================================================================
pause
goto menu

:check_status
cls
echo =====================================================================
echo                STATUS PORT ^& PROSES AKTIF
echo =====================================================================
echo.
echo Memeriksa port yang digunakan oleh sistem DyLeks...
echo.

:: Check Ports
for %%p in (8001 8002 8003 8004 8005 8006) do (
    set "PORT_PID="
    set "PORT_NAME="
    
    :: Get PID
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":%%p " ^| findstr LISTENING') do (
        set "PORT_PID=%%a"
    )
    
    :: Define label
    if "%%p"=="8001" set "LABEL=Siswa Frontend    "
    if "%%p"=="8002" set "LABEL=Siswa Backend     "
    if "%%p"=="8003" set "LABEL=Guru Frontend     "
    if "%%p"=="8004" set "LABEL=Guru Backend      "
    if "%%p"=="8005" set "LABEL=Psikolog Frontend "
    if "%%p"=="8006" set "LABEL=Psikolog Backend  "
    
    if defined PORT_PID (
        :: Get Process Name
        for /f "tokens=1" %%b in ('tasklist /fi "PID eq !PORT_PID!" /nh') do (
            set "PORT_NAME=%%b"
        )
        echo   Port %%p [!LABEL!] : AKTIF (PID: !PORT_PID!, !PORT_NAME!)
    ) else (
        echo   Port %%p [!LABEL!] : OFF
    )
)
echo.
echo =====================================================================
pause
goto menu

:kill_all
cls
echo =====================================================================
echo MEMATIKAN SEMUA LAYANAN PORTAL DYLEKS
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
goto menu

:init_db
cls
echo =====================================================================
echo INISIALISASI / RESET DATABASE
echo =====================================================================
echo.
echo Peringatan: Tindakan ini akan menghapus database lama dan membuat
echo ulang data awal (seeding) untuk Guru, Siswa, dan Psikolog.
echo.
set /p confirm="Apakah Anda yakin ingin melanjutkan? (y/n): "
if /i not "%confirm%"=="y" goto menu

echo.
echo Memeriksa dependensi database...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python tidak terdeteksi. Silakan install Python terlebih dahulu.
    pause
    goto menu
)

python -c "import bcrypt" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Library 'bcrypt' tidak ditemukan. Menginstal bcrypt...
    python -m pip install bcrypt
)

echo Menjalankan script inisialisasi database...
python "%~dp0shared-db\init_db.py"
echo.
echo =====================================================================
pause
goto menu

:install_deps
cls
echo =====================================================================
echo INSTALASI DEPENDENSI (PYTHON ^& NODE.JS)
echo =====================================================================
echo.
echo Proses ini akan menginstal semua package yang diperlukan untuk
echo menjalankan Frontend (Next.js) dan Backend (FastAPI).
echo.

echo [1/4] Memeriksa instalasi Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python tidak terdeteksi di system PATH!
) else (
    echo [OK] Python ditemukan. Menginstal dependensi backend...
    python -m pip install --upgrade pip
    python -m pip install -r "%~dp0siswa\backend\requirements.txt" -r "%~dp0guru\backend\requirements.txt" -r "%~dp0psikolog\backend\requirements.txt"
)
echo.

echo [2/4] Memeriksa instalasi Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak terdeteksi! Silakan install Node.js terlebih dahulu.
) else (
    echo [OK] Node.js ditemukan.
)
echo.

echo [3/4] Menginstal dependensi Node.js di masing-masing portal...
for %%d in (siswa guru psikolog) do (
    if exist "%~dp0%%d\frontend\package.json" (
        echo Menginstal dependensi untuk %%d\frontend...
        cd /d "%~dp0%%d\frontend" && npm install
    )
)
echo.
cd /d "%~dp0"

echo =====================================================================
echo Proses instalasi selesai!
echo =====================================================================
pause
goto menu

:kill_ports_silent
for %%p in (%*) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":%%p " ^| findstr LISTENING 2^>nul') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)
exit /b
