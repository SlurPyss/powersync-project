<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\Queue;
use Carbon\Carbon;
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
        $noShows = Booking::whereIn('status', ['pending', 'accepted', 'ready'])
            ->whereRaw("CONCAT(date, ' ', start_time) < ?", [$now->copy()->subMinutes(10)->toDateTimeString()])
            ->get();
            
        foreach ($noShows as $booking) {
            $booking->update(['status' => 'cancelled']);
            $this->info("Booking {$booking->id} cancelled due to No-Show.");
            
            // Auto Promotion Logic!
            $this->promoteQueue($booking->station_id, $booking->slot_id, $booking->date, $booking->start_time, $booking->duration);
        }
    }

    private function promoteQueue($stationId, $slotId, $date, $startTime, $duration)
    {
        // Get the first person in the queue for this station
        $nextQueue = Queue::where('station_id', $stationId)
            ->orderBy('position', 'asc')
            ->first();

        if ($nextQueue) {
            $endDateTime = Carbon::parse($date . ' ' . $startTime)->addMinutes($duration);
            
            // Create a booking for them automatically
            Booking::create([
                'user_id' => $nextQueue->user_id,
                'station_id' => $stationId,
                'slot_id' => $slotId,
                'name' => $nextQueue->user->name,
                'email' => $nextQueue->user->email,
                'phone' => '080000', // Mock data for now since queue may not store all details
                'connector' => 'Type 2', // Default assume 
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endDateTime->toTimeString(),
                'duration' => $duration,
                'status' => 'accepted', // Auto accepted because they were waiting
                'notes' => 'Auto-promoted from queue.',
            ]);

            Log::info("User ID {$nextQueue->user_id} promoted from Queue to an accepted booking.");
            $this->info("User ID {$nextQueue->user_id} promoted from queue.");

            // Remove from queue and update positions
            $nextQueue->delete();
            
            Queue::where('station_id', $stationId)->decrement('position');
        }
    }
}
