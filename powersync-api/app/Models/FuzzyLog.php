<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuzzyLog extends Model
{
    protected $fillable = [
        'input_battery',
        'input_queue',
        'input_power',
        'output_estimation',
        'recommendation'
    ];
}
