<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = auth()->user()->bookings()->with('station')->latest()->get();
        return response()->json($bookings);
    }

    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'vehicle_type' => 'nullable|string|max:50',
            'plate_number' => 'nullable|string|max:20',
            'connector' => 'required|string|max:50',
            'time' => 'required|date_format:Y-m-d\TH:i',
            'duration' => 'required|integer|min:1',
            'energy' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $ratePerKwh = 2500;
        $price = $validated['energy'] * $ratePerKwh;

        $booking = auth()->user()->bookings()->create([
            'station_id' => $id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'vehicle_type' => $validated['vehicle_type'],
            'plate_number' => $validated['plate_number'],
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

    public function updateStatus(Request $request, $id)
    {
        $booking = auth()->user()->bookings()->findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,charging,completed,cancelled',
        ]);

        $booking->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'message' => 'Status booking berhasil diperbarui',
            'data' => $booking
        ]);
    }

    public function destroy($id)
    {
        $booking = auth()->user()->bookings()->findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'Booking berhasil dihapus'
        ]);
    }

    public function stats()
    {
        $user = auth()->user();
        $totalBookings = $user->bookings()->count();
        $totalEnergy = $user->bookings()->sum('energy');
        $totalRevenue = $user->bookings()->sum('price');

        $dailyBookings = $user->bookings()
            ->selectRaw('DATE(time) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $energyData = $user->bookings()
            ->join('stations', 'bookings.station_id', '=', 'stations.id')
            ->selectRaw('stations.name, SUM(bookings.energy) as kwh')
            ->groupBy('stations.name')
            ->get();

        $statusDistribution = $user->bookings()
            ->selectRaw('status as name, COUNT(*) as value')
            ->groupBy('status')
            ->get();

        return response()->json([
            'totalBookings' => $totalBookings,
            'totalEnergy' => $totalEnergy,
            'totalRevenue' => $totalRevenue,
            'dailyBookings' => $dailyBookings,
            'energyData' => $energyData,
            'statusDistribution' => $statusDistribution,
        ]);
    }
}