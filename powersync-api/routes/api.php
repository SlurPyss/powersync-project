<?php

use App\Http\Controllers\Api\BookingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StationController;


Route::get('/stations/{id}', [StationController::class, 'show']);
Route::post('/stations/{id}/book', [BookingController::class, 'store']);
Route::get('/bookings/stats', [BookingController::class, 'stats']);