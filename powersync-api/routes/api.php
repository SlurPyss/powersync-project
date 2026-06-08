<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\StationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\SchedulingController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/otp/send', [AuthController::class, 'sendOtp']);
Route::post('/otp/verify', [AuthController::class, 'verifyOtp']);
Route::get('/stations', [StationController::class, 'index']);
Route::get('/stations/{id}', [StationController::class, 'show']);
Route::get('/recommendations', [RecommendationController::class, 'getRecommendations']);
Route::post('/estimate-charging', [SchedulingController::class, 'estimate']);


// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings/{id}/check-in', [BookingController::class, 'checkIn']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
    Route::post('/stations/{id}/book', [BookingController::class, 'store']);
    Route::get('/bookings/stats', [BookingController::class, 'stats']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/bookings', [BookingController::class, 'allBookings']);
        Route::put('/admin/bookings/{id}/accept', [BookingController::class, 'acceptBooking']);
        Route::put('/admin/bookings/{id}/reject', [BookingController::class, 'rejectBooking']);
        Route::put('/admin/bookings/{id}/complete', [BookingController::class, 'completeBooking']);
    });
});