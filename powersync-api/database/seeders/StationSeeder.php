<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stations = [
            [
              'name' => 'PowerSync Nagoya Hill Super Charging',
              'location' => 'Nagoya Hill Mall, Batam',
              'type' => 'Super Fast',
              'power' => '150kW',
              'capacity' => 6,
              'available_slots' => 4,
              'connectors' => 'CCS2, CHAdeMO',
              'status' => 'available',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 2800,
              'facilities' => 'WiFi, Coffee Shop, Mall, Restroom',
              'rating' => 4.8,
              'reviews' => 124,
              'operating_hours' => '10:00 - 22:00',
            ],
            [
              'name' => 'PowerSync Batam Centre Fast Hub',
              'location' => 'Mega Mall Batam Centre',
              'type' => 'Fast Charging',
              'power' => '50kW',
              'capacity' => 4,
              'available_slots' => 2,
              'connectors' => 'CCS2, Type 2',
              'status' => 'available',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 2500,
              'facilities' => 'Shopping, Food Court, Prayer Room',
              'rating' => 4.6,
              'reviews' => 89,
              'operating_hours' => '08:00 - 22:00',
            ],
            [
              'name' => 'PowerSync Harbour Bay Ultra Fast',
              'location' => 'Harbour Bay Ferry Terminal',
              'type' => 'Ultra Fast',
              'power' => '350kW',
              'capacity' => 8,
              'available_slots' => 0,
              'connectors' => 'CCS2, CHAdeMO, Type 2',
              'status' => 'busy',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 3800,
              'facilities' => 'Lounge, Sea View, Security 24/7',
              'rating' => 4.9,
              'reviews' => 42,
              'operating_hours' => '24/7',
            ],
            [
              'name' => 'PowerSync Grand Batam Mall Station',
              'location' => 'Grand Batam Mall, Penuin',
              'type' => 'Super Fast',
              'power' => '150kW',
              'capacity' => 10,
              'available_slots' => 7,
              'connectors' => 'CCS2, Type 2',
              'status' => 'available',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 3000,
              'facilities' => 'WiFi, Cinema, Store, Restroom',
              'rating' => 4.7,
              'reviews' => 215,
              'operating_hours' => '10:00 - 22:00',
            ],
            [
              'name' => 'PowerSync BCS Mall Charging Point',
              'location' => 'BCS Mall, Baloi',
              'type' => 'Fast Charging',
              'power' => '22kW',
              'capacity' => 4,
              'available_slots' => 4,
              'connectors' => 'Type 2, GB/T',
              'status' => 'available',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 1800,
              'facilities' => 'Parking, Food Court, ATM',
              'rating' => 4.5,
              'reviews' => 67,
              'operating_hours' => '10:00 - 21:00',
            ],
            [
              'name' => 'PowerSync Kepri Mall EV Centre',
              'location' => 'Kepri Mall, Simpang Kabil',
              'type' => 'Super Fast',
              'power' => '120kW',
              'capacity' => 6,
              'available_slots' => 1,
              'connectors' => 'CCS2, CHAdeMO',
              'status' => 'available',
              'image' => 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000',
              'price_per_kwh' => 2700,
              'facilities' => 'Supermarket, Gym, Restroom',
              'rating' => 4.4,
              'reviews' => 38,
              'operating_hours' => '09:00 - 22:00',
            ],
        ];

        foreach ($stations as $station) {
            \App\Models\Station::create($station);
        }
    }
}
