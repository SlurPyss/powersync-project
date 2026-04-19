<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Spklu;
use App\Models\Criterion;
use App\Models\Weight;
use App\Models\Assessment;
use App\Models\TopsisResult;
use App\Services\TopsisService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected $topsis;

    public function __construct(TopsisService $topsis)
    {
        $this->topsis = $topsis;
    }

    /**
     * Flow: User -> input preferensi -> sistem hitung TOPSIS -> tampilkan ranking SPKLU
     */
    public function getRecommendations(Request $request)
    {
        // 1. Persiapkan Kriteria & Bobot
        $criteria = Criterion::all();
        if ($criteria->isEmpty()) {
            return response()->json(['message' => 'Kriteria belum diatur'], 400);
        }

        $weights = [];
        $types = [];

        foreach ($criteria as $c) {
            // Prioritas: Ambil bobot dari request user, jika tidak ada ambil dari tabel_bobot
            $userWeight = $request->input('weight_' . $c->id);
            $weights[$c->id] = (float) ($userWeight ?? Weight::where('kriteria_id', $c->id)->value('nilai_bobot') ?? 1);
            $types[$c->id] = $c->tipe;
        }

        // 2. Persiapkan Matriks Keputusan (Data SPKLU & Penilaian)
        $stations = Spklu::all();
        if ($stations->isEmpty()) {
            return response()->json(['message' => 'Data SPKLU kosong'], 400);
        }

        $matrix = [];
        foreach ($stations as $station) {
            foreach ($criteria as $c) {
                // Ambil nilai dari tabel_penilaian
                $nilai = Assessment::where('spklu_id', $station->id)
                                    ->where('kriteria_id', $c->id)
                                    ->value('nilai') ?? 0;

                // Dinamis: Jika kriteria adalah Jarak, hitung berdasarkan lokasi user jika ada
                if (str_contains(strtolower($c->nama_kriteria), 'jarak') && $request->has(['lat', 'lng'])) {
                    $nilai = $this->haversineDistance($request->lat, $request->lng, $station->lat, $station->lng);
                }

                $matrix[$station->id][$c->id] = (float) $nilai;
            }
        }

        // 3. Proses Hitung TOPSIS melalui Service
        $preferences = $this->topsis->calculate($matrix, $weights, $types);

        // 4. Ranking & Output
        arsort($preferences);

        $results = [];
        $ranking = 1;

        foreach ($preferences as $id => $score) {
            $station = $stations->find($id);
            $results[] = [
                'ranking' => $ranking,
                'nama_stasiun' => $station->nama_stasiun,
                'preferensi' => round($score, 4),
                'lokasi' => $station->lokasi,
                'data_asli' => [
                    'harga' => $station->harga_per_kwh,
                    'waktu_tunggu' => $station->waiting_time_minutes,
                    'kapasitas' => $station->kapasitas_daya
                ]
            ];

            // Simpan hasil ke tabel_hasil (Sesuai request)
            TopsisResult::updateOrCreate(
                ['spklu_id' => $id],
                ['nilai_preferensi' => $score, 'ranking' => $ranking]
            );

            $ranking++;
        }

        return response()->json([
            'success' => true,
            'user_preferences' => $weights,
            'recommendations' => $results
        ]);
    }

    /**
     * Hitung jarak Haversine (Sederhana)
     */
    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}
