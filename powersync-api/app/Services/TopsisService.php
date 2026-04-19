<?php

namespace App\Services;

class TopsisService
{
    /**
     * Hitung Rekomendasi dengan Metode TOPSIS
     * 
     * @param array $matrix Matriks keputusan [alternatif][kriteria]
     * @param array $weights Bobot setiap kriteria [kriteria_id => bobot]
     * @param array $types Tipe kriteria [kriteria_id => 'benefit'/'cost']
     * @return array Nilai preferensi untuk setiap alternatif
     */
    public function calculate(array $matrix, array $weights, array $types)
    {
        if (empty($matrix)) return [];

        // 1. Normalisasi Matriks Keputusan
        // Rumus: r_ij = x_ij / sqrt(sum(x_ij^2))
        $normalizedMatrix = $this->normalize($matrix);

        // 2. Pembobotan Matriks yang Dinormalisasi
        // Rumus: y_ij = w_j * r_ij
        $weightedMatrix = $this->applyWeights($normalizedMatrix, $weights);

        // 3. Menentukan Solusi Ideal Positif (A+) & Negatif (A-)
        // Benefit: A+ max, A- min | Cost: A+ min, A- max
        list($idealPositive, $idealNegative) = $this->calculateIdealSolutions($weightedMatrix, $types);

        // 4. Menghitung Jarak ke Solusi Ideal Positif (D+) & Negatif (D-)
        // Rumus: sqrt(sum(y_ij - A_j)^2)
        $distances = $this->calculateDistances($weightedMatrix, $idealPositive, $idealNegative);

        // 5. Menghitung Nilai Preferensi (V)
        // Rumus: V_i = D-_i / (D+_i + D-_i)
        return $this->calculatePreference($distances);
    }

    private function normalize(array $matrix)
    {
        $normalized = [];
        $criteriaIds = array_keys($matrix[array_key_first($matrix)]);
        $alternativesIds = array_keys($matrix);

        foreach ($criteriaIds as $j) {
            $sumSquares = 0;
            foreach ($alternativesIds as $i) {
                $sumSquares += pow($matrix[$i][$j], 2);
            }
            $divider = sqrt($sumSquares);

            foreach ($alternativesIds as $i) {
                $normalized[$i][$j] = $divider == 0 ? 0 : $matrix[$i][$j] / $divider;
            }
        }

        return $normalized;
    }

    private function applyWeights(array $matrix, array $weights)
    {
        foreach ($matrix as $i => $row) {
            foreach ($row as $j => $value) {
                $matrix[$i][$j] *= ($weights[$j] ?? 0);
            }
        }
        return $matrix;
    }

    private function calculateIdealSolutions(array $matrix, array $types)
    {
        $idealPositive = [];
        $idealNegative = [];
        $criteriaIds = array_keys($matrix[array_key_first($matrix)]);

        foreach ($criteriaIds as $j) {
            $column = array_column($matrix, $j);
            if (($types[$j] ?? 'benefit') === 'benefit') {
                $idealPositive[$j] = !empty($column) ? max($column) : 0;
                $idealNegative[$j] = !empty($column) ? min($column) : 0;
            } else {
                $idealPositive[$j] = !empty($column) ? min($column) : 0;
                $idealNegative[$j] = !empty($column) ? max($column) : 0;
            }
        }

        return [$idealPositive, $idealNegative];
    }

    private function calculateDistances(array $matrix, array $idealPositive, array $idealNegative)
    {
        $distances = [];
        foreach ($matrix as $i => $row) {
            $sumPositive = 0;
            $sumNegative = 0;
            foreach ($row as $j => $value) {
                $sumPositive += pow($value - $idealPositive[$j], 2);
                $sumNegative += pow($value - $idealNegative[$j], 2);
            }
            $distances[$i] = [
                'positive' => sqrt($sumPositive),
                'negative' => sqrt($sumNegative)
            ];
        }
        return $distances;
    }

    private function calculatePreference(array $distances)
    {
        $preferences = [];
        foreach ($distances as $i => $d) {
            $total = $d['positive'] + $d['negative'];
            $preferences[$i] = $total == 0 ? 0 : $d['negative'] / $total;
        }
        return $preferences;
    }
}
