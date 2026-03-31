# Panduan Setup Proyek PowerSync

Panduan ini berisi langkah-langkah untuk menyiapkan lingkungan pengembangan (development environment) pada PC baru.

## 1. Persyaratan Software (Prerequisites)

Unduh dan instal software berikut jika belum tersedia:
- **XAMPP (PHP 8.2+)**: [Download XAMPP](https://www.apachefriends.org/download.html)
- **Node.js (LTS)**: [Download Node.js](https://nodejs.org/)
- **Composer**: [Download Composer](https://getcomposer.org/)
- **Git**: [Download Git](https://git-scm.com/)

---

## 2. Langkah-Langkah Instalasi

### Step 1: Clone Repositori
Buka terminal (CMD/PowerShell/Git Bash) dan jalankan:
```bash
git clone https://github.com/SlurPyss/powersync-project.git
cd powersync-project
```

### Step 2: Konfigurasi Backend (Laravel)
1. Masuk ke folder API:
   ```bash
   cd powersync-api
   ```
2. Instal dependensi:
   ```bash
   composer install
   ```
3. Copy file environment:
   ```bash
   cp .env.example .env
   ```
4. Generate Key aplikasi:
   ```bash
   php artisan key:generate
   ```
5. **Konfigurasi Database**:
   - Jalankan **Apache** dan **MySQL** di XAMPP Control Panel.
   - Buka `localhost/phpmyadmin`.
   - Buat database baru dengan nama `powersync_db`.
   - Cek file `.env` di folder `powersync-api`, pastikan:
     ```env
     DB_DATABASE=powersync_db
     DB_USERNAME=root
     DB_PASSWORD=
     ```
6. Jalankan Migrasi dan Seeding:
   ```bash
   php artisan migrate:fresh --seed
   ```
7. Jalankan Server API:
   ```bash
   php artisan serve --port=8001
   ```

### Step 3: Konfigurasi Frontend (React + Vite)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd powersync
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan Aplikasi:
   ```bash
   npm run dev -- --port 5177
   ```

---

## 3. Cara Mengakses
- **Aplikasi**: [http://localhost:5177](http://localhost:5177)
- **API Backend**: [http://localhost:8001](http://localhost:8001)

### Akun Admin (Default Seeder):
- **Email**: `admin@powersync.id`
- **Password**: `password`

---

## Troubleshooting
- **Port 8001/5177 Digunakan**: Jika error, pastikan tidak ada aplikasi lain yang menggunakan port tersebut.
- **PHP Not Recognized**: Pastikan path PHP (biasanya `C:\xampp\php`) sudah masuk ke dalam **Environment Variables** Windows.
- **Permission Windows**: Jika `npm` gagal karena script execution policy, jalankan command ini di PowerShell (sebagai Admin):
  `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
