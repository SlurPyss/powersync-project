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
        Schema::table('stations', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->string('location')->nullable();
            $table->integer('capacity')->default(0);
            $table->string('connectors')->nullable(); // contoh: "CCS, CHAdeMO"
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropColumn(['name', 'location', 'capacity', 'connectors']);
        });
    
    }
};
