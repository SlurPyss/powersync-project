<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
    use HasFactory;

    protected $fillable = [
        'station_id',
        'slot_number',
    ];

    public function station()
    {
        return $this->belongsTo(Station::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
