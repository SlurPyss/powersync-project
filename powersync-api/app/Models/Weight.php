<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weight extends Model
{
    protected $table = 'tabel_bobot';

    protected $fillable = ['kriteria_id', 'nilai_bobot'];

    public function criterion()
    {
        return $this->belongsTo(Criterion::class, 'kriteria_id');
    }
}
