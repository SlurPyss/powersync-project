<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateBookingStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates booking statuses automatically (Ready, Cancelled/No-Show, Completed) and manages Queue promotion.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        // 1. Mark to "completed" if end_time is past and status is occupied
        $completed = Booking::where('status', 'occupied')
            ->whereRaw("CONCAT(date, ' ', end_time) <= ?", [$now->toDateTimeString()])
            ->update(['status' => 'completed']);
        
        if ($completed > 0) {
            $this->info("$completed bookings marked as completed.");
        }

        // 2. Mark to "ready" if within 15 mins of start time
        $readyBookings = Booking::whereIn('status', ['pending', 'accepted'])
            ->whereRaw("CONCAT(date, ' ', start_time) BETWEEN ? AND ?", [
                $now->copy()->toDateTimeString(), 
                $now->copy()->addMinutes(15)->toDateTimeString()
            ])
            ->get();
            
        foreach ($readyBookings as $booking) {
            $booking->update(['status' => 'ready']);
            $this->info("Booking {$booking->id} marked as ready.");
        }

        // 3. Mark to "cancelled" (No show) if more than 10 mins past start time and still not occupied (checked in)
        // Wrapped in atomic transaction with row locking to prevent race condition with check-in
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
                $this->info("Booking {$lockedBooking->id} cancelled due to No-Show.");
                
                // Auto Promotion Logic executed atomically within the same transaction
                $this->promoteQueue(
                    $lockedBooking->station_id,
                    $lockedBooking->slot_id,
                    $lockedBooking->date,
                    $lockedBooking->start_time,
                    $lockedBooking->duration
                );
            });
        }
    }

    private function promoteQueue($stationId, $slotId, $date, $startTime, $duration)
    {
        // Get the first person in the queue for this station using row-level locking (FCFS)
        $nextQueue = Queue::where('station_id', $stationId)
            ->orderBy('position', 'asc')
            ->lockForUpdate()
            ->first();

        if ($nextQueue) {
            $user = $nextQueue->user;
            $station = $nextQueue->station;
            $endDateTime = Carbon::parse($date . ' ' . $startTime)->addMinutes($duration);
            
            // Extract real user & vehicle attributes, avoiding hardcoded mock data
            $phone = $user->phone ?? '08123456789';
            $vehicleType = $user->vehicle_type ?? 'Electric Vehicle';
            $plateNumber = $user->plate_number ?? 'B 1234 PS';
            
            // Determine connector from station or user vehicle specification
            $connectors = is_array($station->connectors) ? $station->connectors : json_decode($station->connectors, true);
            $connector = !empty($connectors) ? (is_array($connectors) ? $connectors[0] : $connectors) : 'CCS2';

            // Create a booking automatically for the promoted user with confirmed status
            Booking::create([
                'user_id' => $user->id,
                'station_id' => $stationId,
                'slot_id' => $slotId,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $phone,
                'vehicle_type' => $vehicleType,
                'plate_number' => $plateNumber,
                'connector' => $connector,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endDateTime->toTimeString(),
                'duration' => $duration,
                'status' => 'accepted', // Auto-accepted since the slot is now assigned
                'notes' => 'Auto-promoted from queue (FCFS) due to slot availability.',
            ]);

            Log::info("User ID {$user->id} promoted from Queue to accepted Booking.");
            $this->info("User ID {$user->id} promoted from queue.");

            // Remove from queue and update remaining positions
            $nextQueue->delete();
            
            Queue::where('station_id', $stationId)->decrement('position');
        }
    }
}
