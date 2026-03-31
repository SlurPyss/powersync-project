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
        \App\Models\Station::create([
            'name' => 'Station Sekupang',
            'location' => 'Batam, Riau Islands',
            'capacity' => 50,
            'connectors' => 'CCS, CHAdeMO',
        ]);
    
        \App\Models\Station::create([
            'name' => 'Station Nagoya',
            'location' => 'Batam Center',
            'capacity' => 75,
            'connectors' => 'CCS',
        ]);
    
    }
}
