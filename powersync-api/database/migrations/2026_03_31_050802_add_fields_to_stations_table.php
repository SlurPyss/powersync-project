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
            $table->string('type')->after('location'); // e.g. Ultra Fast, Super Fast
            $table->string('power')->after('type'); // e.g. 350kW
            $table->integer('capacity')->default(0); // Total slots
            $table->integer('available_slots')->default(0); 
            $table->string('connectors')->nullable(); 
            $table->string('status')->default('available'); // available, busy, maintenance
            $table->string('image')->nullable();
            $table->integer('price_per_kwh')->default(0);
            $table->text('facilities')->nullable(); // Store as JSON string
            $table->float('rating')->default(5.0);
            $table->integer('reviews')->default(0);
            $table->string('operating_hours')->default('24/7');
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
