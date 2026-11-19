# PowerSync — Sistem Reservasi & Manajemen Pengisian Daya SPKLU Berbasis Web

[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![React 19](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8.svg)](https://tailwindcss.com)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.x-teal.svg)](https://maplibre.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PowerSync** adalah platform ekosistem cerdas untuk reservasi slot stasiun pengisian kendaraan listrik (SPKLU) di Kota Batam. Platform ini mengintegrasikan pemantauan stasiun secara real-time melalui peta interaktif, sistem antrean FCFS (*First-Come, First-Served*), penanganan *No-Show* otomatis, rekomendasi SPKLU cerdas (TOPSIS), serta kalkulasi jarak GPS real-time (*Haversine Formula*).

---

## ⚡ Fitur Utama

### 1. 🗺️ Pantau Stasiun Real-Time (MapLibre GL)
- Visualisasi peta interaktif seluruh titik SPKLU aktif di Kota Batam.
- Penanda lokasi (*custom animated pulse markers*) dengan pop-up detail kapasitas slot, daya (kW), konektor (CCS2, CHAdeMO, Type 2), dan tarif/kWh.
- Filter cepat: Fast Charging, Tersedia, dan SPKLU Terdekat.
- Sinkronisasi instan antara daftar kartu stasiun dan titik pada peta tanpa tumpang-tindih (*single active popup reference*).

### 2. 📍 Geolocation & Jarak GPS (Formula Haversine)
- Deteksi lokasi pengguna secara presisi melalui HTML5 Geolocation API.
- Penghitungan jarak langsung (*straight-line distance*) ke setiap SPKLU dengan *Haversine Formula*.
- Fallback koordinat default Kota Batam (Batam Centre) jika izin GPS tidak diaktifkan.

### 3. ⏱️ Time-Slot Reservation & Anti Race-Condition
- Pengguna dapat memilih jadwal pengisian daya spesifik per slot stasiun.
- Penerapan *Pessimistic Concurrency Locking* (`lockForUpdate()`) di tingkat basis data MySQL untuk menjamin integritas transaksi dan mencegah *double booking* saat diakses bersamaan.

### 4. 🔄 Siklus Reservasi & Toleransi Waktu (Check-In & No-Show)
- **Jendela Check-In**: Dibuka 15 menit sebelum waktu mulai hingga 10 menit setelah waktu mulai (*grace period*).
- **Penanganan No-Show Otomatis**: Jika pengguna tidak check-in lewat dari 10 menit setelah jadwal, reservasi otomatis berstatus `cancelled`.
- **Auto-Promotion FCFS**: Slot yang kosong akibat *No-Show* langsung dialihkan secara otomatis ke pengemudi yang berada di antrean nomor 1 stasiun terkait.
- **Siklus Pengisian Daya Lengkap**:
  `Antrean` ➔ `Reserved` ➔ `Siap Check-In` ➔ `Memuat Daya (Occupied)` ➔ `Selesai (Completed)`.
- **Penyelesaian Sesi Hybrid**: Penghentian otomatis saat durasi habis atau penghentian instan melalui tombol **"Selesai Mengisi"** untuk kebutuhan pengujian.

### 5. 🎯 Sistem Rekomendasi SPKLU Cerdas (TOPSIS)
- Memberikan pemeringkatan SPKLU terbaik berdasarkan multi-kriteria: Jarak, Ketersediaan Slot, Daya Pengisian (kW), Biaya/Tarif per kWh, dan Rating/Fasilitas.

---

## 🏗️ Arsitektur Sistem

PowerSync dibangun dengan arsitektur **3-Tier Monorepo**:

```
powersync-project/
├── powersync/             # Frontend Client (React 19, TypeScript, Vite, Tailwind v4)
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Footer, MapLibre, dll)
│   │   ├── context/       # AuthContext, BookingContext
│   │   ├── pages/         # Home, Catalog, Detail, MyBookings, Login, Register
│   │   └── types/         # TypeScript Interfaces
├── powersync-api/         # Backend API (Laravel 11, Sanctum, Eloquent ORM)
│   ├── app/
│   │   ├── Console/       # Artisan Command (bookings:update-status)
│   │   ├── Http/          # Controllers (Booking, Station, Auth, Recommendation)
│   │   └── Models/        # Booking, Station, Slot, Queue, User
│   └── routes/            # api.php
├── diagrams_proposal/     # Diagram Arsitektur, Flowchart DSR, Activity Diagram, ERD
└── RUN_POWERSYNC.bat      # 1-Click Starter Script untuk Windows Environment
```

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### Prasyarat
- **PHP 8.2+** & **Composer** (tersedia di XAMPP)
- **MySQL / MariaDB**
- **Node.js (LTS v18+)** & **npm**

### 1-Click Launch (Windows)
Jalankan file batch:
```cmd
RUN_POWERSYNC.bat
```
Script ini akan otomatis mengaktifkan server Laravel API di port `8001`, server Vite di port `5177`, dan membuka aplikasi di browser Anda.

### Menjalankan Manual

#### 1. Setup Backend (Laravel)
```bash
cd powersync-api
composer install
cp .env.example .env
php artisan key:generate
# Pastikan database 'powersync_db' telah dibuat di MySQL
php artisan migrate:fresh --seed
php artisan serve --port=8001
```

#### 2. Setup Frontend (React + Vite)
```bash
cd powersync
npm install
npm run dev -- --port 5177
```

Buka browser pada:
- **Aplikasi Web**: [http://localhost:5177](http://localhost:5177)
- **API Endpoint**: [http://localhost:8001](http://localhost:8001)

### Akun Uji Coba:
- **Pengguna Uji**: `brama@gmail.com` / `password`
- **Admin**: `admin@powersync.id` / `password`

---

## 🧪 Pengujian & Simulasi
Sistem dilengkapi skrip simulasi dan uji komparasi pada `powersync-api/tests/`:
- `simulate_noshow.php`: Menguji perbandingan utilisasi slot antara sistem konvensional vs PowerSync dengan toleransi 10 menit + FCFS Auto Promotion.
- `benchmark_concurrency.php`: Menguji keandalan *database row locking* terhadap percobaan pemesanan bersamaan (*concurrency stress test*).

---

## 📄 Lisensi
Proyek ini dikembangkan untuk tujuan penelitian dan pengujian sistem manajemen energi dan SPKLU. Bebas digunakan untuk keperluan edukasi dan akademik.
