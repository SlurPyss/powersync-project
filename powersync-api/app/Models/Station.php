<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'type',
        'power',
        'capacity',
        'available_slots',
        'connectors',
        'status',
        'image',
        'price_per_kwh',
        'facilities',
        'rating',
        'reviews',
        'operating_hours',
    ];
}