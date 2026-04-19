<?php

namespace App\Services;

class FuzzyService
{
    /**
     * Estimasi Waktu Pengisian menggunakan Fuzzy Logic
     * 
     * @param float $battery (0-100%)
     * @param int $queue (0-10 mobil)
     * @param float $power (3.5 - 350 kW)
     * @return array [estimation, status]
     */
    public function estimate(float $battery, int $queue, float $power)
    {
        // 1. Fuzzifikasi
        $fuzzyBattery = $this->fuzzifyBattery($battery);
        $fuzzyQueue = $this->fuzzifyQueue($queue);
        $fuzzyPower = $this->fuzzifyPower($power);

        // 2. Inferensi (Rule Base)
        $rules = $this->inference($fuzzyBattery, $fuzzyQueue, $fuzzyPower);

        // 3. Defuzzifikasi (Weighted Average)
        $estimation = $this->defuzzify($rules);

        return [
            'estimation' => round($estimation, 2),
            'status' => $this->getStatus($estimation),
            'recommendation' => $this->getRecommendation($estimation, $queue)
        ];
    }

    private function fuzzifyBattery($val)
    {
        return [
            'low' => $this->trapezoid($val, 0, 0, 20, 40),
            'medium' => $this->triangle($val, 30, 50, 70),
            'high' => $this->trapezoid($val, 60, 80, 100, 100),
        ];
    }

    private function fuzzifyQueue($val)
    {
        return [
            'few' => $this->trapezoid($val, 0, 0, 1, 3),
            'moderate' => $this->triangle($val, 2, 4, 6),
            'many' => $this->trapezoid($val, 5, 7, 10, 10),
        ];
    }

    private function fuzzifyPower($val)
    {
        return [
            'low' => $this->trapezoid($val, 3.5, 3.5, 11, 22),
            'medium' => $this->triangle($val, 11, 50, 100),
            'high' => $this->trapezoid($val, 75, 150, 350, 350),
        ];
    }

    private function inference($battery, $queue, $power)
    {
        $rules = [];

        // R1: IF Battery Low AND Queue Many AND Power Low THEN Time SLOW
        $rules[] = ['weight' => min($battery['low'], $queue['many'], $power['low']), 'output' => 120];

        // R2: IF Battery High AND Queue Few AND Power High THEN Time FAST
        $rules[] = ['weight' => min($battery['high'], $queue['few'], $power['high']), 'output' => 30];

        // R3: IF Battery Medium AND Queue Moderate AND Power Medium THEN Time NORMAL
        $rules[] = ['weight' => min($battery['medium'], $queue['moderate'], $power['medium']), 'output' => 60];

        // R4: IF Battery Low AND Power High THEN Time NORMAL
        $rules[] = ['weight' => min($battery['low'], $power['high']), 'output' => 60];

        // R5: IF Queue Many THEN Time SLOW
        $rules[] = ['weight' => $queue['many'], 'output' => 120];

        // R6: IF Battery High AND Queue Few THEN Time FAST
        $rules[] = ['weight' => min($battery['high'], $queue['few']), 'output' => 30];

        // R7: IF Power Low THEN Time SLOW
        $rules[] = ['weight' => $power['low'], 'output' => 120];

        // R8: IF Power High THEN Time FAST
        $rules[] = ['weight' => $power['high'], 'output' => 30];

        return $rules;
    }

    private function defuzzify($rules)
    {
        $numerator = 0;
        $denominator = 0;

        foreach ($rules as $rule) {
            $numerator += $rule['weight'] * $rule['output'];
            $denominator += $rule['weight'];
        }

        return $denominator == 0 ? 60 : $numerator / $denominator;
    }

    // Helper Functions
    private function triangle($x, $a, $b, $c)
    {
        if ($x <= $a || $x >= $c) return 0;
        if ($x == $b) return 1;
        if ($x > $a && $x < $b) return ($x - $a) / ($b - $a);
        return ($c - $x) / ($c - $b);
    }

    private function trapezoid($x, $a, $b, $c, $d)
    {
        if ($x <= $a || $x >= $d) return 0;
        if ($x >= $b && $x <= $c) return 1;
        if ($x > $a && $x < $b) return ($x - $a) / ($b - $a);
        return ($d - $x) / ($d - $c);
    }

    private function getStatus($min)
    {
        if ($min <= 45) return 'Cepat';
        if ($min <= 80) return 'Normal';
        return 'Lama';
    }

    private function getRecommendation($min, $queue)
    {
        if ($queue > 5) return 'Antrian padat, disarankan menjadwalkan 2 jam lagi.';
        if ($min > 90) return 'Waktu pengisian lama, pastikan daya SPKLU tinggi.';
        return 'Waktu ideal, silahkan mulai pengisian sekarang.';
    }
}
