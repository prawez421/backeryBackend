<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\AttributeValueController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Register
Route::post('/register', [AuthController::class, 'register']);

// Login
Route::post('/login', [AuthController::class, 'login']);

// Branches
Route::apiResource('branches', BranchController::class);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Logged-in User Details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Vendor CRUD Routes
    Route::apiResource('vendors', VendorController::class);
    // Units CRUD Routes
    Route::apiResource('units', UnitController::class);
    // Category CRUD Routes
    Route::apiResource('categories', CategoryController::class);
    // Sub-Category CRUD Routes
    Route::apiResource('sub-categories', SubCategoryController::class);
    // Brand Routes
    Route::get('/brands', [BrandController::class, 'index']);
    Route::post('/brands', [BrandController::class, 'store']);
    Route::get('/brands/{id}', [BrandController::class, 'show']);
    Route::post('/brands/{id}', [BrandController::class, 'update']);
    Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

    // Attribute Master
    Route::apiResource('attributes', AttributeController::class);
    // Attribute Values
    Route::get('attribute-values', [AttributeValueController::class, 'index']);
    Route::get('attribute-values/{id}', [AttributeValueController::class, 'show']);
    Route::put('attribute-values/{id}', [AttributeValueController::class, 'update']);
    Route::delete('attribute-values/{id}', [AttributeValueController::class, 'destroy']);

    // products 
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // purchases  
    Route::get('/purchases/vendors', [PurchaseController::class, 'vendors']);
    Route::get('/purchases/products', [PurchaseController::class, 'products']);
    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
    Route::get('/purchases/{id}', [PurchaseController::class, 'show']);
    // Update using POST
    Route::post('/purchases/{id}', [PurchaseController::class, 'update']);
    Route::delete('/purchases/{id}', [PurchaseController::class, 'destroy']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});

 //  public api 

 // Public Website APIs
Route::get('/menu/categories', [CategoryController::class, 'publicMenuCategories']);
Route::get('/menu/sub-categories', [SubCategoryController::class, 'index']);
Route::get('/menu/products', [PurchaseController::class, 'menuproducts']);