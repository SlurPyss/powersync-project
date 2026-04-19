<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopsisResult extends Model
{
    protected $table = 'tabel_hasil';

    protected $fillable = ['spklu_id', 'nilai_preferensi', 'ranking'];

    public function spklu()
    {
        return $this->belongsTo(Spklu::class, 'spklu_id');
    }
}
