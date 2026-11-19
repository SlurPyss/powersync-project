# Catatan Rilis PowerSync (Release Notes)

## Versi 1.1.0 — Production-Ready Prototype Release (2026-11-19)

Rilis ini menghadirkan ekosistem PowerSync yang lengkap, stabil, dan siap untuk tahap pengujian dan demonstrasi akademik:

### 🌟 Fitur Baru & Pembaruan
1. **Siklus Pengisian Daya Hybrid (*Charging Lifecycle Management*)**:
   - Transisi status pemesanan: `Pending` ➔ `Accepted` ➔ `Ready (Siap Check-in)` ➔ `Occupied (Memuat Daya)` ➔ `Completed (Selesai)`.
   - Penyelesaian sesi otomatis (*Time-based Auto Completion*) saat jadwal selesai terlewati.
   - Tombol manual **"Selesai Mengisi"** pada status `Occupied` untuk fleksibilitas demo dan pengujian tanpa harus menunggu durasi riil.
   - Proteksi aksi: tombol pembatalan dinonaktifkan saat sedang memuat daya, dan berganti menjadi **"Hapus Riwayat"** setelah sesi selesai.

2. **Manajemen No-Show & Promosi Antrean Otomatis (*FCFS Auto-Promotion*)**:
   - Jendela check-in 15 menit sebelum hingga 10 menit setelah jadwal mulai.
   - Pembatalan otomatis (*Auto-Cancel*) bagi pemesan yang tidak check-in lewat batas toleransi.
   - Promosi antrean otomatis: antrean nomor 1 di stasiun terkait langsung dialihkan menempati slot kosong tanpa intervensi manual.
   - Endpoint API `POST /api/bookings/{id}/check-in` dengan validasi rentang waktu ketat.

3. **Perbaikan & Optimalisasi Peta Interaktif (MapLibre GL)**:
   - Perbaikan masalah pergeseran titik koordinat saat kursor diarahkan ke marker (*hover jitter fix*).
   - Penanganan pop-up stasiun tunggal (*single active popup ref*) untuk mencegah pop-up saling menumpuk.
   - Perbaikan hilangnya ikon listrik stasiun setelah berpindah halaman antara Beranda dan Katalog.
   - Penonaktifan *auto-focus scroll* pada pop-up peta agar halaman tidak melompat sendiri saat pop-up terbuka.

4. **Navigasi & Pengalaman Pengguna (*Scroll Restoration*)**:
   - Komponen `ScrollToTop` terintegrasi pada React Router sehingga setiap perpindahan halaman (Beranda, Katalog, Login, Register, Booking Saya) langsung terbuka di posisi paling atas secara halus.
   - Pembersihan hash URL pada navigasi agar link antar halaman berfungsi konsisten.

5. **Diagram Arsitektur & Berkas Proposal Lengkap (`diagrams_proposal/`)**:
   - Diagram Alir Metodologi DSR (*Design Science Research*).
   - Arsitektur Sistem 3-Tier (*Presentation, Application, Data Layer*).
   - Use Case Diagram pengguna dan administrator.
   - Activity Diagram alur FCFS Queue & No-Show Auto-Promotion.
   - Entity-Relationship Diagram (ERD) basis data PowerSync.
   - File master Mermaid (`.mmd`), PlantUML (`.puml`), PNG resolusi tinggi, dan SVG vektor.

6. **Pengujian Kinerja & Simulasi**:
   - Skrip benchmark `simulate_noshow.php` (pengujian utilisasi slot dan efisiensi waktu tunggu).
   - Skrip benchmark `benchmark_concurrency.php` (pengujian keandalan row-locking anti *race-condition*).
