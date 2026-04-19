<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FuzzyLog;
use App\Services\FuzzyService;
use Illuminate\Http\Request;

class SchedulingController extends Controller
{
    protected $fuzzy;

    public function __construct(FuzzyService $fuzzy)
    {
        $this->fuzzy = $fuzzy;
    }

    /**
     * Endpoint untuk estimasi waktu pengisian (Fuzzy Logic)
     */
    public function estimate(Request $request)
    {
        $request->validate([
            'battery_level' => 'required|numeric|between:0,100',
            'queue_count' => 'required|integer|between:0,10',
            'power_capacity' => 'required|numeric'
        ]);

        $battery = $request->battery_level;
        $queue = $request->queue_count;
        $power = $request->power_capacity;

        // Proses Fuzzy
        $result = $this->fuzzy->estimate($battery, $queue, $power);

        // Simpan Log
        FuzzyLog::create([
            'input_battery' => $battery,
            'input_queue' => $queue,
            'input_power' => $power,
            'output_estimation' => $result['estimation'],
            'recommendation' => $result['recommendation']
        ]);

        return response()->json([
            'success' => true,
            'input' => [
                'battery' => $battery . '%',
                'queue' => $queue . ' mobil',
                'power' => $power . ' kW'
            ],
            'result' => [
                'estimated_time_minutes' => $result['estimation'],
                'status' => $result['status'],
                'recommendation' => $result['recommendation']
            ]
        ]);
    }
}
