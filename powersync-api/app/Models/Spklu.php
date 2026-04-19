<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spklu extends Model
{
    protected $table = 'tabel_spklu';
    
    protected $fillable = [
        'nama_stasiun',
        'lokasi',
        'lat',
        'lng',
        'harga_per_kwh',
        'waiting_time_minutes',
        'kapasitas_daya'
    ];

    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'spklu_id');
    }
}
