# Dokumentasi Gambar Diagram Proposal Tugas Akhir PowerSync

Direktori ini berisi kode sumber diagram (**Mermaid** `.mmd` dan **PlantUML** `.puml`) beserta hasil ekspor resolusi tinggi (**SVG** vektor dan **PNG** 300 DPI) dengan latar belakang putih bersih (`#FFFFFF`) dan tipografi akademik formal bahasa Indonesia yang siap disisipkan ke dokumen Microsoft Word Proposal Tugas Akhir.

---

## Daftar File Diagram

### 1. GAMBAR 1: Bagan Alur Penelitian (Design Science Research - DSR 6 Tahap)
* **Konteks Akademik**: Mengacu pada metodologi *Design Science Research* (Peffers et al., 2007) yang terdiri dari 6 tahap berurutan dilengkapi dengan siklus umpan balik iteratif (*iterative refinement cycle*).
* **File Sumber Mermaid**: [`gambar_1_dsr_flowchart.mmd`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_1_dsr_flowchart.mmd)
* **File Sumber PlantUML**: [`gambar_1_dsr_flowchart.puml`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_1_dsr_flowchart.puml)
* **File Vektor SVG**: [`gambar_1_dsr_flowchart.svg`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_1_dsr_flowchart.svg)
* **File Gambar PNG (300 DPI)**: [`gambar_1_dsr_flowchart.png`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_1_dsr_flowchart.png)

---

### 2. GAMBAR 2: Gambaran Umum Sistem PowerSync (Arsitektur 3-Tier)
* **Konteks Akademik**: Menggambarkan arsitektur 3 lapis (*Three-Tier Architecture*) berurutan dari kiri ke kanan:
  1. **Lapisan Presentasi (Client Tier)**: React 18 SPA (TypeScript + Tailwind CSS + Vite) yang diakses Pengguna EV & Admin SPKLU.
  2. **Protokol Komunikasi**: HTTP/HTTPS REST API dengan otorisasi Bearer Token (Laravel Sanctum) & DTO JSON.
  3. **Lapisan Logika Bisnis (Application Tier)**: Laravel 11 REST API (`Auth Middleware`, `BookingController` logika FCFS, dan `Scheduled Command UpdateBookingStatus`).
  4. **Lapisan Persistensi Data (Data Tier)**: MySQL Database Server menyimpan 5 tabel relasional inti (`users`, `stations`, `slots`, `bookings`, `queues`).
* **File Sumber Mermaid**: [`gambar_2_arsitektur_3tier.mmd`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_2_arsitektur_3tier.mmd)
* **File Sumber PlantUML**: [`gambar_2_arsitektur_3tier.puml`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_2_arsitektur_3tier.puml)
* **File Vektor SVG**: [`gambar_2_arsitektur_3tier.svg`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_2_arsitektur_3tier.svg)
* **File Gambar PNG (300 DPI)**: [`gambar_2_arsitektur_3tier.png`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_2_arsitektur_3tier.png)

---

### 3. GAMBAR 3: Diagram Use Case Sistem PowerSync
* **Konteks Akademik**: Standar UML Use Case Diagram dengan batasan sistem (*System Boundary*):
  * **Pengguna EV (Kiri)**: Terhubung ke UC-01, UC-02, UC-03 (`<<include>>` Validasi Kapasitas Slot), dan UC-04 (`<<include>>` Validasi Jendela Waktu Check-In).
  * **Administrator SPKLU (Kanan)**: Terhubung ke UC-01 dan UC-05 (Pengelolaan SPKLU & Pemantauan Antrean).
* **File Sumber Mermaid**: [`gambar_3_use_case.mmd`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_3_use_case.mmd)
* **File Sumber PlantUML**: [`gambar_3_use_case.puml`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_3_use_case.puml)
* **File Vektor SVG**: [`gambar_3_use_case.svg`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_3_use_case.svg)
* **File Gambar PNG (300 DPI)**: [`gambar_3_use_case.png`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_3_use_case.png)

---

### 4. GAMBAR 4: Activity Diagram Alur Reservasi dan Antrean FCFS
* **Konteks Akademik**: Activity Diagram UML dengan 3 Swimlane terstruktur:
  1. **Pengguna EV (Frontend)**
  2. **Backend Laravel (Application Logic)**
  3. **Basis Data MySQL (Data Persistence)**
  Memodelkan pemesanan normal (ACCEPTED), penanganan kelebihan kapasitas (PENDING FCFS Queue), evaluasi batas toleransi check-in kedatangan (-15m s.d. +10m), pembatalan no-show, dan eksekusi promosi otomatis antrean terdepan.
* **File Sumber Mermaid**: [`gambar_4_activity_diagram_fcfs.mmd`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_4_activity_diagram_fcfs.mmd)
* **File Sumber PlantUML**: [`gambar_4_activity_diagram_fcfs.puml`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_4_activity_diagram_fcfs.puml)
* **File Vektor SVG**: [`gambar_4_activity_diagram_fcfs.svg`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_4_activity_diagram_fcfs.svg)
* **File Gambar PNG (300 DPI)**: [`gambar_4_activity_diagram_fcfs.png`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_4_activity_diagram_fcfs.png)

---

### 5. GAMBAR 5: Entity Relationship Diagram (ERD - Subbab 3.4.6)
* **Konteks Akademik**: ERD Notasi Crow's Foot untuk 5 entitas relasional:
  * `users`, `stations`, `slots`, `bookings`, `queues`
  * Spesifikasi kunci prioritas FCFS (`bookings.created_at`) dan nomor urut antrean (`queues.position`).
* **File Sumber Mermaid**: [`gambar_5_erd_powersync.mmd`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_5_erd_powersync.mmd)
* **File Sumber PlantUML**: [`gambar_5_erd_powersync.puml`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_5_erd_powersync.puml)
* **File Vektor SVG**: [`gambar_5_erd_powersync.svg`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_5_erd_powersync.svg)
* **File Gambar PNG (300 DPI)**: [`gambar_5_erd_powersync.png`](file:///c:/Projects/powersync-project/diagrams_proposal/gambar_5_erd_powersync.png)

---

## Petunjuk Penyisipan ke Microsoft Word
1. **Opsi 1 - Menggunakan Format SVG (Sangat Direkomendasikan)**:
   * Microsoft Word 2016 ke atas mendukung file SVG secara native.
   * Pilih menu **Insert > Pictures > This Device...**, lalu pilih file `.svg`.
   * **Keunggulan**: Teks dan garis tidak akan pernah pecah (*lossless vector*) saat diperbesar atau dicetak.
2. **Opsi 2 - Menggunakan Format PNG**:
   * File `.png` telah diekspor pada skala 3x (*high-DPI*, setara resolusi cetak 300 DPI).
   * Latar belakang gambar telah diset putih bersih (`#FFFFFF`) tanpa artefak transparansi gelap.

---

## Menjalankan Ulang Generator / Render
Jika ingin mengubah kode diagram pada file `.mmd`, jalankan perintah berikut dari root folder proyek:
```bash
node ./diagrams_proposal/render_all.js
```
Skrip akan secara otomatis merender ulang seluruh file `.svg` dan `.png`.
