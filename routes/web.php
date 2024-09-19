<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SolarConstructionSiteController;
use App\Http\Controllers\SolarProductServiceController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\ConstructorProjectController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderItemController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Constructor Quotation
Route::middleware('auth')->group(function () {
    Route::resource('quotations', QuotationController::class);
    Route::get('/constructor-quotation', [QuotationController::class, 'index'])->name('constructor-quotation');
});

// Constructor Projects
Route::middleware('auth')->group(function () {
    Route::resource('constructor-projects', ConstructorProjectController::class);
});

// Delivery
Route::middleware('auth')->group(function () {
    Route::resource('delivery', DeliveryController::class);
});

// Solar Panel Construction Sites Routes
Route::middleware('auth')->group(function () {
    Route::resource('solar-construction-sites', SolarConstructionSiteController::class);
});

// Solar Products & Services Routes
Route::middleware('auth')->group(function () {
    Route::resource('solar-products-services', SolarProductServiceController::class);
    Route::get('/product-list', [SolarProductServiceController::class, 'browse'])->name('product-list.browse'); // For browsing solar products
});

// Cart and Order Management
Route::middleware('auth')->group(function () {
    Route::resource('carts', CartController::class); // Manage cart
    Route::resource('cart-items', CartItemController::class); // Manage cart items
    Route::resource('orders', OrderController::class); // Manage orders
    Route::resource('order-items', OrderItemController::class); // Manage order items

    Route::get('/carts', [CartController::class, 'createOrFetchCart']);
    Route::post('/carts', [CartController::class, 'store']); // Create a new cart

    // Add product to the cart
    Route::post('/cart-items', [CartController::class, 'addToCart'])->name('cart.add');
    // Get cart items count
    Route::get('/cart-items/count', [CartItemController::class, 'count']);
});

// Customer: Purchase History
Route::middleware('auth')->group(function () {
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchases/{id}', [PurchaseController::class, 'show'])->name('purchases.show');
});

// Customer: Feedback and Suggestions
Route::middleware('auth')->group(function () {
    Route::resource('feedbacks', FeedbackController::class); // Manage customer feedback
});

// Main Dashboard Route
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Customer Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Include Laravel Auth Routes
require __DIR__.'/auth.php';
