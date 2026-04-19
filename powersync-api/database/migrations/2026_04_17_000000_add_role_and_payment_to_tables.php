<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add role to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email');
        });

        // Add payment fields to bookings table
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('payment_proof')->nullable()->after('status');
            $table->string('payment_status')->default('unpaid')->after('payment_proof'); // unpaid, pending, paid
            $table->text('ocr_result')->nullable()->after('payment_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['payment_proof', 'payment_status', 'ocr_result']);
        });
    }
};
