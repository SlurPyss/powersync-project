<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $table = 'tabel_penilaian';

    protected $fillable = ['spklu_id', 'kriteria_id', 'nilai'];

    public function spklu()
    {
        return $this->belongsTo(Spklu::class, 'spklu_id');
    }

    public function criterion()
    {
        return $this->belongsTo(Criterion::class, 'kriteria_id');
    }
}
