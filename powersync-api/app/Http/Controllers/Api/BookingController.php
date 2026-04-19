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

    public function allBookings()
    {
        $bookings = Booking::with(['user', 'station'])->latest()->get();
        return response()->json($bookings);
    }

    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'vehicle_type' => 'nullable|string|max:50',
            'plate_number' => 'nullable|string|max:20',
            'connector' => 'required|string|max:50',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:15',
            'notes' => 'nullable|string',
        ]);

        $user = auth()->user();
        $startDateTime = \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['start_time']);
        $endDateTime = clone $startDateTime;
        $endDateTime->addMinutes($validated['duration']);

        if ($startDateTime->isPast()) {
            return response()->json(['message' => 'Tidak bisa booking di waktu yang sudah lewat.'], 400);
        }

        $startTimeStr = $startDateTime->toTimeString();
        $endTimeStr = $endDateTime->toTimeString();

        // Check if user already has an active booking at the same time
        $userOverlap = $user->bookings()
            ->where('date', $validated['date'])
            ->whereIn('status', ['pending', 'accepted', 'ready', 'occupied'])
            ->where(function($query) use ($startTimeStr, $endTimeStr) {
                $query->where('start_time', '<', $endTimeStr)
                      ->where('end_time', '>', $startTimeStr);
            })->exists();

        if ($userOverlap) {
            return response()->json(['message' => 'Anda sudah memiliki booking di waktu tersebut.'], 400);
        }

        $station = \App\Models\Station::findOrFail($id);
        $allSlots = $station->slots;
        $assignedSlot = null;

        foreach ($allSlots as $slot) {
            $hasOverlap = Booking::where('slot_id', $slot->id)
                ->where('date', $validated['date'])
                ->whereIn('status', ['pending', 'accepted', 'ready', 'occupied'])
                ->where(function($query) use ($startTimeStr, $endTimeStr) {
                    $query->where('start_time', '<', $endTimeStr)
                          ->where('end_time', '>', $startTimeStr);
                })->exists();

            if (!$hasOverlap) {
                $assignedSlot = $slot;
                break;
            }
        }

        if (!$assignedSlot) {
            // Add to queue
            $position = \App\Models\Queue::where('station_id', $station->id)->count() + 1;
            $queue = \App\Models\Queue::create([
                'user_id' => $user->id,
                'station_id' => $station->id,
                'position' => $position,
                'request_time' => now(),
            ]);

            return response()->json([
                'message' => 'Slot penuh. Anda dimasukkan ke dalam antrean (Queue).',
                'queue_position' => $position,
            ], 202);
        }

        $booking = $user->bookings()->create([
            'station_id' => $station->id,
            'slot_id' => $assignedSlot->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => static::getPhoneNumber($user),
            'vehicle_type' => $validated['vehicle_type'],
            'plate_number' => $validated['plate_number'],
            'connector' => $validated['connector'],
            'date' => $validated['date'],
            'start_time' => $startTimeStr,
            'end_time' => $endTimeStr,
            'duration' => $validated['duration'],
            'status' => 'pending',
            'notes' => $validated['notes'],
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat',
            'data' => $booking
        ], 201);
    }

    private static function getPhoneNumber($user) {
        return $user->phone ?? '0800000000'; // fallback
    }

    // Removed uploadPayment method

    public function acceptBooking($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'accepted']);
        return response()->json(['message' => 'Booking accepted']);
    }

    public function rejectBooking($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'rejected']);
        return response()->json(['message' => 'Booking rejected']);
    }

    public function completeBooking($id)
    {
        $booking = Booking::findOrFail($id);
        if ($booking->status !== 'paid') {
            return response()->json(['message' => 'Only paid bookings can be completed.'], 400);
        }
        $booking->update(['status' => 'completed']);
        return response()->json(['message' => 'Booking completed']);
    }

    public function destroy($id)
    {
        $booking = auth()->user()->bookings()->findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'Booking berhasil dihapus'
        ]);
    }
    
    public function checkIn($id)
    {
        $booking = auth()->user()->bookings()->findOrFail($id);

        $now = now();
        $bookingStart = \Carbon\Carbon::parse($booking->date . ' ' . $booking->start_time);
        
        // Window: 15 minutes before to 10 minutes after
        $minCheckIn = clone $bookingStart;
        $minCheckIn->subMinutes(15);
        $maxCheckIn = clone $bookingStart;
        $maxCheckIn->addMinutes(10);

        if ($now->between($minCheckIn, $maxCheckIn)) {
            $booking->update([
                'status' => 'occupied',
                'check_in_time' => $now,
            ]);
            return response()->json(['message' => 'Check-in berhasil.']);
        }

        return response()->json(['message' => 'Check-in hanya dapat dilakukan 15 menit sebelum hingga 10 menit setelah jadwal.'], 400);
    }

    public function stats()
    {
        // Simple mock stats for admin/dashboard since payment is removed
        $user = auth()->user();
        $totalBookings = $user->bookings()->count();
        $activeBookings = $user->bookings()->whereIn('status', ['accepted', 'ready', 'occupied'])->count();

        $statusDistribution = $user->bookings()
            ->selectRaw('status as name, COUNT(*) as value')
            ->groupBy('status')
            ->get();

        return response()->json([
            'totalBookings' => $totalBookings,
            'activeBookings' => $activeBookings,
            'statusDistribution' => $statusDistribution,
        ]);
    }
}