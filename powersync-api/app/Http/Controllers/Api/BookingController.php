<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'connector' => 'required|string|max:50',
            'time' => 'required|date_format:Y-m-d\TH:i',
            'duration' => 'required|integer|min:1',
            'energy' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        // Tarif per kWh (misal Rp 2500)
        $ratePerKwh = 2500;
        $price = $validated['energy'] * $ratePerKwh;

        $booking = Booking::create([
            'station_id' => $id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'connector' => $validated['connector'],
            'time' => $validated['time'],
            'duration' => $validated['duration'],
            'energy' => $validated['energy'],
            'price' => $price,
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat',
            'data' => $booking
        ], 201);
    }

    public function stats()
    {
        $totalBookings = Booking::count();
        $totalEnergy = Booking::sum('energy');
        $totalRevenue = Booking::sum('price');

        // contoh grouping per hari
        $dailyBookings = Booking::selectRaw('DATE(time) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'totalBookings' => $totalBookings,
            'totalEnergy' => $totalEnergy,
            'totalRevenue' => $totalRevenue,
            'dailyBookings' => $dailyBookings,
        ]);
    }
}