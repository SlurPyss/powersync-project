<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'station_id',
        'name',
        'email',
        'phone',
        'vehicle_type',
        'plate_number',
        'connector',
        'time',
        'duration',
        'energy',
        'price',
        'notes',
        'status',    
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function station()
    {
        return $this->belongsTo(Station::class);
    }
}