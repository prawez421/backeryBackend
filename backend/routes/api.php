
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;


// Register
Route::post('/register', [AuthController::class, 'register']);

// Login
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Logged-in User Details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Vendor CRUD Routes
    Route::apiResource('vendors', VendorController::class);

    // Units CRUD Routes
    Route::apiResource('units',UnitController::class);

    // Category
    Route::apiResource('categories',CategoryController::class);
         // sub_category
     Route::apiResource('sub-categories',SubCategoryController::class);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
