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
        Schema::create('slots', function (Blueprint $col) {
            $col->id();
            $col->foreignId('station_id')->constrained()->onDelete('cascade');
            $col->string('slot_number');
            $col->timestamps();
        });

        Schema::create('queues', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_id')->constrained()->onDelete('cascade');
            $col->foreignId('station_id')->constrained()->onDelete('cascade');
            $col->integer('position');
            $col->dateTime('request_time');
            $col->timestamps();
        });

        Schema::table('bookings', function (Blueprint $table) {
            // Drop old payment fields if they exist from previous session
            if (Schema::hasColumn('bookings', 'payment_proof')) {
                $table->dropColumn(['payment_proof', 'payment_status', 'ocr_result', 'price']);
            }
            if (Schema::hasColumn('bookings', 'time')) {
                $table->dropColumn(['time', 'energy']);
            }
            
            // Add new fields
            $table->foreignId('slot_id')->nullable()->constrained()->onDelete('cascade');
            $table->date('date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->dateTime('check_in_time')->nullable();
            
            // Update status ENUM via raw if needed, but for SQLite/MySQL compatibility:
            // Existing status column might need to be dropped and recreated if we want specific ENUMs
            // But let's just use string to be safe and flexible
            $table->string('status')->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queues');
        Schema::dropIfExists('slots');
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['slot_id']);
            $table->dropColumn(['slot_id', 'date', 'start_time', 'end_time', 'check_in_time']);
            $table->dateTime('time')->nullable();
            $table->integer('energy')->nullable();
        });
    }
};
