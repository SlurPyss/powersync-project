<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Station;
use App\Models\Queue;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index()
    {
        $this->syncBookingStatuses();

        $bookings = auth()->user()->bookings()->with('station')->latest()->get();
        return response()->json($bookings);
    }

    public function allBookings()
    {
        $this->syncBookingStatuses();

        $bookings = Booking::with(['user', 'station'])->latest()->get();
        return response()->json($bookings);
    }

    private function syncBookingStatuses()
    {
        $now = \Carbon\Carbon::now();

        // 1. Auto-complete occupied bookings whose end_time has passed
        Booking::where('status', 'occupied')
            ->whereRaw("CONCAT(date, ' ', end_time) <= ?", [$now->toDateTimeString()])
            ->update(['status' => 'completed']);

        // 2. Auto-ready bookings within 15 minutes of start_time
        Booking::whereIn('status', ['pending', 'accepted'])
            ->whereRaw("CONCAT(date, ' ', start_time) BETWEEN ? AND ?", [
                $now->copy()->toDateTimeString(),
                $now->copy()->addMinutes(15)->toDateTimeString()
            ])
            ->update(['status' => 'ready']);

        // 3. Auto-cancel no-shows (more than 10 mins past start_time without check-in) and promote queue
        $noShows = Booking::whereIn('status', ['pending', 'accepted', 'ready'])
            ->whereRaw("CONCAT(date, ' ', start_time) < ?", [$now->copy()->subMinutes(10)->toDateTimeString()])
            ->get();

        foreach ($noShows as $booking) {
            DB::transaction(function () use ($booking) {
                $lockedBooking = Booking::where('id', $booking->id)->lockForUpdate()->first();
                if (!$lockedBooking || in_array($lockedBooking->status, ['occupied', 'cancelled', 'completed'])) {
                    return;
                }

                $lockedBooking->update(['status' => 'cancelled']);

                // Promote next user in queue if available
                $nextQueue = Queue::where('station_id', $lockedBooking->station_id)
                    ->orderBy('position', 'asc')
                    ->lockForUpdate()
                    ->first();

                if ($nextQueue) {
                    $user = $nextQueue->user;
                    $station = $nextQueue->station;
                    $endDateTime = \Carbon\Carbon::parse($lockedBooking->date . ' ' . $lockedBooking->start_time)->addMinutes($lockedBooking->duration);
                    
                    $phone = $user->phone ?? '08123456789';
                    $vehicleType = $user->vehicle_type ?? 'Electric Vehicle';
                    $plateNumber = $user->plate_number ?? 'B 1234 PS';
                    $connectors = is_array($station->connectors) ? $station->connectors : json_decode($station->connectors, true);
                    $connector = !empty($connectors) ? (is_array($connectors) ? $connectors[0] : $connectors) : 'CCS2';

                    Booking::create([
                        'user_id' => $user->id,
                        'station_id' => $lockedBooking->station_id,
                        'slot_id' => $lockedBooking->slot_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $phone,
                        'vehicle_type' => $vehicleType,
                        'plate_number' => $plateNumber,
                        'connector' => $connector,
                        'date' => $lockedBooking->date,
                        'start_time' => $lockedBooking->start_time,
                        'end_time' => $endDateTime->toTimeString(),
                        'duration' => $lockedBooking->duration,
                        'status' => 'accepted',
                        'notes' => 'Auto-promoted from queue (FCFS) due to slot availability.',
                    ]);

                    $nextQueue->delete();
                    Queue::where('station_id', $lockedBooking->station_id)->decrement('position');
                }
            });
        }
    }

    public function finishCharging($id)
    {
        $booking = auth()->user()->bookings()->findOrFail($id);

        if ($booking->status !== 'occupied') {
            return response()->json(['message' => 'Hanya sesi yang sedang memuat daya yang dapat diselesaikan.'], 400);
        }

        $booking->update([
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Pengisian daya berhasil diselesaikan.',
            'booking' => $booking
        ]);
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
        $endDateTime = (clone $startDateTime)->addMinutes($validated['duration']);

        if ($startDateTime->isPast()) {
            return response()->json(['message' => 'Tidak bisa booking di waktu yang sudah lewat.'], 400);
        }

        $startTimeStr = $startDateTime->toTimeString();
        $endTimeStr = $endDateTime->toTimeString();

        return DB::transaction(function () use ($user, $id, $validated, $startTimeStr, $endTimeStr) {
            // Lock station record to synchronize concurrent bookings
            $station = Station::where('id', $id)->lockForUpdate()->firstOrFail();

            // Check if user already has an active booking at the same time
            $userOverlap = $user->bookings()
                ->where('date', $validated['date'])
                ->whereIn('status', ['accepted', 'ready', 'occupied'])
                ->where(function($query) use ($startTimeStr, $endTimeStr) {
                    $query->where('start_time', '<', $endTimeStr)
                          ->where('end_time', '>', $startTimeStr);
                })
                ->lockForUpdate()
                ->exists();

            if ($userOverlap) {
                return response()->json(['message' => 'Anda sudah memiliki booking di waktu tersebut.'], 400);
            }

            // Lock slots to prevent race conditions
            $allSlots = $station->slots()->lockForUpdate()->get();
            $assignedSlot = null;

            foreach ($allSlots as $slot) {
                $hasOverlap = Booking::where('slot_id', $slot->id)
                    ->where('date', $validated['date'])
                    ->whereIn('status', ['accepted', 'ready', 'occupied'])
                    ->where(function($query) use ($startTimeStr, $endTimeStr) {
                        $query->where('start_time', '<', $endTimeStr)
                              ->where('end_time', '>', $startTimeStr);
                    })
                    ->lockForUpdate()
                    ->exists();

                if (!$hasOverlap) {
                    $assignedSlot = $slot;
                    break;
                }
            }

            if (!$assignedSlot) {
                // Add to queue with lock to guarantee strict sequential ordering
                $lastQueue = Queue::where('station_id', $station->id)
                    ->lockForUpdate()
                    ->orderBy('position', 'desc')
                    ->first();

                $position = $lastQueue ? $lastQueue->position + 1 : 1;

                $queue = Queue::create([
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

            // Slot is available -> Create booking directly with consistent 'accepted' status
            $booking = $user->bookings()->create([
                'station_id' => $station->id,
                'slot_id' => $assignedSlot->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '08123456789',
                'vehicle_type' => $validated['vehicle_type'] ?? $user->vehicle_type,
                'plate_number' => $validated['plate_number'] ?? $user->plate_number,
                'connector' => $validated['connector'],
                'date' => $validated['date'],
                'start_time' => $startTimeStr,
                'end_time' => $endTimeStr,
                'duration' => $validated['duration'],
                'status' => 'accepted',
                'notes' => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'message' => 'Booking berhasil dibuat dan dikonfirmasi.',
                'data' => $booking
            ], 201);
        });
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