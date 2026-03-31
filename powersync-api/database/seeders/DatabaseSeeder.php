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
        ]);

        $stations = \App\Models\Station::all();
        $statuses = ['pending', 'confirmed', 'charging', 'completed', 'cancelled'];
        $connectors = ['CCS2', 'CHAdeMO', 'Type 2'];

        // Buat 15 booking acak untuk mendemonstrasikan dashboard
        for ($i = 0; $i < 15; $i++) {
            $station = $stations->random();
            $energy = rand(15, 60);
            $price = $energy * $station->price_per_kwh;
            $daysAgo = rand(0, 6);
            
            \App\Models\Booking::create([
                'user_id' => $admin->id,
                'station_id' => $station->id,
                'name' => 'Customer ' . ($i + 1),
                'email' => 'customer' . ($i + 1) . '@example.com',
                'phone' => '0812' . rand(1000000, 9999999),
                'connector' => $connectors[array_rand($connectors)],
                'time' => now()->subDays($daysAgo)->setHour(rand(8, 22))->setMinute(0)->toDateTimeString(),
                'duration' => rand(30, 90),
                'energy' => $energy,
                'price' => $price,
                'status' => $statuses[array_rand($statuses)],
                'notes' => 'Generated sample booking',
            ]);
        }
    }
}
