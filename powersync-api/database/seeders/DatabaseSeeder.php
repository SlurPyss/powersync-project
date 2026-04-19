<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hubungkan stasiun ke database
        $this->call(StationSeeder::class);

        // Buat admin user terlebih dahulu
        $admin = \App\Models\User::factory()->create([
            'name' => 'PowerSync Admin',
            'email' => 'admin@powersync.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $stations = \App\Models\Station::all();
        $statuses = ['pending', 'confirmed', 'charging', 'completed', 'cancelled'];
        $connectors = ['CCS2', 'CHAdeMO', 'Type 2'];

        // Buat 15 booking acak untuk mendemonstrasikan dashboard
        for ($i = 0; $i < 15; $i++) {
            $station = $stations->random();
            $slot = $station->slots()->inRandomOrder()->first();
            $daysAgo = rand(0, 6);
            $startHour = rand(8, 20);
            $durationMinutes = rand(30, 90);
            
            $startDateTime = now()->subDays($daysAgo)->setHour($startHour)->setMinute(0);
            $endDateTime = clone $startDateTime;
            $endDateTime->addMinutes($durationMinutes);
            
            \App\Models\Booking::create([
                'user_id' => $admin->id,
                'station_id' => $station->id,
                'slot_id' => $slot ? $slot->id : null,
                'name' => 'Customer ' . ($i + 1),
                'email' => 'customer' . ($i + 1) . '@example.com',
                'phone' => '0812' . rand(1000000, 9999999),
                'vehicle_type' => 'Tesla Model 3',
                'plate_number' => 'B 1234 PS',
                'connector' => $connectors[array_rand($connectors)],
                'date' => $startDateTime->toDateString(),
                'start_time' => $startDateTime->toTimeString(),
                'end_time' => $endDateTime->toTimeString(),
                'duration' => $durationMinutes,
                'status' => $statuses[array_rand($statuses)],
                'notes' => 'Generated sample booking',
            ]);
        }
    }
}
