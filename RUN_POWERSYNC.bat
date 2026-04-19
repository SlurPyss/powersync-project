@echo off
title PowerSync Starter
echo ==========================================
echo       POWERSYNC ECOSYSTEM STARTER
echo ==========================================
echo.

echo [1/3] Menjalankan Backend Laravel (Port 8001)...
start "PowerSync Backend" /D "%~dp0powersync-api" cmd /k "C:\xampp\php\php.exe artisan serve --port=8001"

echo [2/3] Menjalankan Frontend React (Port 5177)...
:: Menggunakan cmd /c untuk npm agar log tetap terlihat di jendela baru
start "PowerSync Frontend" /D "%~dp0powersync" cmd /k "npm run dev -- --port 5177"

echo [3/3] Menunggu server siap dan membuka browser...
timeout /t 5 >nul
start http://localhost:5177

echo.
echo ==========================================
echo SEMUA SISTEM SEDANG BERJALAN!
echo.
echo - Jendela Backend (8001) sedang aktif.
echo - Jendela Frontend (5177) sedang aktif.
echo - Browser akan terbuka otomatis.
echo.
echo Tekan tombol apa saja untuk menutup jendela ini...
pause >nul
