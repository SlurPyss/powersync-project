<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Station;

class StationController extends Controller
{
    public function show($id)
    {
        // Cari station berdasarkan ID
        $station = Station::find($id);

        if (!$station) {
            return response()->json([
                'message' => 'Station not found'
            ], 404);
        }

        // Kembalikan data station dalam bentuk JSON
        return response()->json($station);
    }
}