<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Spklu;
use App\Models\Criterion;
use App\Models\Weight;
use App\Models\Assessment;

class TopsisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Data Kriteria
        // Kriteria Jarak, Harga, dan Waktu Tunggu adalah COST (Makin rendah makin baik)
        // Kriteria Kapasitas Daya adalah BENEFIT (Makin tinggi makin baik)
        $k1 = Criterion::create(['nama_kriteria' => 'Jarak', 'tipe' => 'cost']);
        $k2 = Criterion::create(['nama_kriteria' => 'Harga', 'tipe' => 'cost']);
        $k3 = Criterion::create(['nama_kriteria' => 'Waktu Tunggu', 'tipe' => 'cost']);
        $k4 = Criterion::create(['nama_kriteria' => 'Kapasitas Daya', 'tipe' => 'benefit']);

        // 2. Data Bobot Default (Skala 1 - 5)
        Weight::create(['kriteria_id' => $k1->id, 'nilai_bobot' => 5]); // Jarak sangat penting
        Weight::create(['kriteria_id' => $k2->id, 'nilai_bobot' => 3]); // Harga cukup penting
        Weight::create(['kriteria_id' => $k3->id, 'nilai_bobot' => 4]); // Waktu tunggu penting
        Weight::create(['kriteria_id' => $k4->id, 'nilai_bobot' => 2]); // Kapasitas daya kurang penting

        // 3. Data SPKLU (Alternatif)
        $s1 = Spklu::create([
            'nama_stasiun' => 'PowerSync Station Alpha',
            'lokasi' => 'Jl. Merdeka No. 10',
            'lat' => -6.175392, 'lng' => 106.827153,
            'harga_per_kwh' => 2500,
            'waiting_time_minutes' => 10,
            'kapasitas_daya' => 50
        ]);

        $s2 = Spklu::create([
            'nama_stasiun' => 'EV Charge Beta',
            'lokasi' => 'Sudirman Central',
            'lat' => -6.224855, 'lng' => 106.808511,
            'harga_per_kwh' => 2000,
            'waiting_time_minutes' => 30,
            'kapasitas_daya' => 150
        ]);

        $s3 = Spklu::create([
            'nama_stasiun' => 'Green Energy Gamma',
            'lokasi' => 'Epicentrum Walk',
            'lat' => -6.216654, 'lng' => 106.834575,
            'harga_per_kwh' => 3000,
            'waiting_time_minutes' => 0,
            'kapasitas_daya' => 22
        ]);

        // 4. Data Penilaian (Initial Matrix)
        // Format: [SPKLU] [Kriteria] = Nilai
        
        // Penilaian S1: Alpha
        Assessment::create(['spklu_id' => $s1->id, 'kriteria_id' => $k1->id, 'nilai' => 2]); // 2km
        Assessment::create(['spklu_id' => $s1->id, 'kriteria_id' => $k2->id, 'nilai' => 2500]);
        Assessment::create(['spklu_id' => $s1->id, 'kriteria_id' => $k3->id, 'nilai' => 10]);
        Assessment::create(['spklu_id' => $s1->id, 'kriteria_id' => $k4->id, 'nilai' => 50]);

        // Penilaian S2: Beta
        Assessment::create(['spklu_id' => $s2->id, 'kriteria_id' => $k1->id, 'nilai' => 5]); // 5km
        Assessment::create(['spklu_id' => $s2->id, 'kriteria_id' => $k2->id, 'nilai' => 2000]);
        Assessment::create(['spklu_id' => $s2->id, 'kriteria_id' => $k3->id, 'nilai' => 30]);
        Assessment::create(['spklu_id' => $s2->id, 'kriteria_id' => $k4->id, 'nilai' => 150]);

        // Penilaian S3: Gamma
        Assessment::create(['spklu_id' => $s3->id, 'kriteria_id' => $k1->id, 'nilai' => 1]); // 1km
        Assessment::create(['spklu_id' => $s3->id, 'kriteria_id' => $k2->id, 'nilai' => 3000]);
        Assessment::create(['spklu_id' => $s3->id, 'kriteria_id' => $k3->id, 'nilai' => 0]);
        Assessment::create(['spklu_id' => $s3->id, 'kriteria_id' => $k4->id, 'nilai' => 22]);
    }
}
