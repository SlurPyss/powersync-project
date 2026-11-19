@echo off
title Push PowerSync to GitHub
echo ==========================================
echo       PUSH POWERSYNC TO GITHUB
echo ==========================================
echo.
echo Menjalankan: git push origin main --tags
echo (Jika muncul jendela autentikasi GitHub di browser, silakan setujui/login)
echo.
git push origin main --tags
echo.
if %ERRORLEVEL% EQU 0 (
    echo ==========================================
    echo [SUKSES] Berhasil dipush ke GitHub!
    echo Versi v1.1.0 dan seluruh perubahan berhasil terunggah.
    echo ==========================================
) else (
    echo ==========================================
    echo [GAGAL] Push ke GitHub tidak berhasil.
    echo Pastikan koneksi internet aktif dan akun GitHub memiliki akses.
    echo ==========================================
)
echo.
pause
