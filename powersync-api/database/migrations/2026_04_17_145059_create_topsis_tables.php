<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tabel SPKLU (Alternatif)
        Schema::create('tabel_spklu', function (Blueprint $table) {
            $table->id();
            $table->string('nama_stasiun');
            $table->string('lokasi');
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->integer('harga_per_kwh'); // Kriteria 2 (Cost)
            $table->integer('waiting_time_minutes'); // Kriteria 3 (Cost)
            $table->integer('kapasitas_daya'); // Kriteria 4 (Benefit)
            $table->timestamps();
        });

        // 2. Tabel Kriteria
        Schema::create('tabel_kriteria', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kriteria');
            $table->enum('tipe', ['benefit', 'cost']); // Menentukan apakah nilai tinggi itu baik (benefit) atau buruk (cost)
            $table->timestamps();
        });

        // 3. Tabel Bobot (Bisa diatur Admin/User)
        Schema::create('tabel_bobot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kriteria_id')->constrained('tabel_kriteria')->onDelete('cascade');
            $table->float('nilai_bobot'); // Contoh: 1 - 5 atau 0 - 1
            $table->timestamps();
        });

        // 4. Tabel Penilaian (Matriks Keputusan)
        Schema::create('tabel_penilaian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spklu_id')->constrained('tabel_spklu')->onDelete('cascade');
            $table->foreignId('kriteria_id')->constrained('tabel_kriteria')->onDelete('cascade');
            $table->float('nilai'); // Nilai performa alternatif i pada kriteria j
            $table->timestamps();
        });

        // 5. Tabel Hasil (Ranking)
        Schema::create('tabel_hasil', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spklu_id')->constrained('tabel_spklu')->onDelete('cascade');
            $table->float('nilai_preferensi'); // Hasil akhir TOPSIS
            $table->integer('ranking');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabel_hasil');
        Schema::dropIfExists('tabel_penilaian');
        Schema::dropIfExists('tabel_bobot');
        Schema::dropIfExists('tabel_kriteria');
        Schema::dropIfExists('tabel_spklu');
    }
};
