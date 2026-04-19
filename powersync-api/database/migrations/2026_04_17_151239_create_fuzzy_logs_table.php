<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fuzzy_logs', function (Blueprint $table) {
            $table->id();
            $table->float('input_battery'); // 0 - 100
            $table->integer('input_queue'); // 0 - 10
            $table->float('input_power'); // 3.5 - 350
            $table->float('output_estimation'); // minutes
            $table->string('recommendation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuzzy_logs');
    }
};
