<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
    protected $table = 'tabel_kriteria';

    protected $fillable = ['nama_kriteria', 'tipe'];

    public function weight()
    {
        return $this->hasOne(Weight::class, 'kriteria_id');
    }
}
