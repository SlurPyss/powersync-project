<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        'station_id',
        'name',
        'email',
        'phone',
        'connector',
        'time',
        'duration',
        'energy',
        'price',
        'notes',
        'status',    
    ];
}