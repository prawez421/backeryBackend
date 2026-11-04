<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

           /// register
Route::post('/register', [AuthController::class, 'register']);
// Public route (Login)
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (Token required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user(); // Logged-in user ki details dega
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});