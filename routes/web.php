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
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Constructor Quotation
Route::middleware('auth')->group(function () {
    Route::resource('quotations', QuotationController::class);
    Route::get('/constructor-quotation', [QuotationController::class, 'index'])->name('constructor-quotation');
    Route::get('/constructor-quotation/all', [QuotationController::class, 'all'])->name('quotations.all');
    Route::post('/quotations/{id}/approve', [QuotationController::class, 'approve'])->name('quotations.approve');
    Route::post('/quotations/{id}/reject', [QuotationController::class, 'reject'])->name('quotations.reject');
    Route::get('/quotations/{id}', [QuotationController::class, 'show']);
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
    Route::get('/solar-construction-sites', [SolarConstructionSiteController::class, 'index'])->name('solar-construction-sites.index');
    Route::get('/solar-construction-sites/create', [SolarConstructionSiteController::class, 'create'])->name('solar-construction-sites.create');
    Route::post('/solar-construction-sites', [SolarConstructionSiteController::class, 'store'])->name('solar-construction-sites.store');
    Route::get('/solar-construction-sites/{id}/edit', [SolarConstructionSiteController::class, 'edit'])->name('solar-construction-sites.edit');
    Route::put('/solar-construction-sites/{id}', [SolarConstructionSiteController::class, 'update'])->name('solar-construction-sites.update');
    Route::delete('/solar-construction-sites/{id}', [SolarConstructionSiteController::class, 'destroy'])->name('solar-construction-sites.destroy');
    Route::get('/all-sites', [SolarConstructionSiteController::class, 'allSites'])->name('solar-construction-sites.all');
    Route::post('/solar-construction-sites/{id}/update-status', [SolarConstructionSiteController::class, 'updateStatus'])->name('solar-sites.updateStatus');
    Route::put('/solar-construction-sites/{id}/update-status', [SolarConstructionSiteController::class, 'updateStatus']);
});

// Solar Products & Services Routes
Route::middleware('auth')->group(function () {
    Route::resource('solar-products-services', SolarProductServiceController::class);
    Route::get('/product-list', [SolarProductServiceController::class, 'browse'])->name('product-list.browse'); // For browsing solar products
    Route::get('/product-details', [SolarProductServiceController::class, 'getProductsByIds'])->name('product-details');
});

// Cart and Order Management
Route::middleware('auth')->group(function () {
    Route::resource('carts', CartController::class); // Manage cart
    Route::resource('cart-items', CartItemController::class); // Manage cart items
    Route::resource('orders', OrderController::class); // Manage orders
    Route::resource('order-items', OrderItemController::class); // Manage order items

    Route::get('/carts', [CartController::class, 'createOrFetchCart']);
    Route::post('/carts', [CartController::class, 'store']); 
    Route::get('/cart', [CartController::class, 'showCart'])->name('cart.show');
    Route::delete('/carts/{cart}/clear', [CartController::class, 'clearCart']);

    Route::post('/cart-items', [CartController::class, 'addToCart'])->name('cart.add');
    Route::get('/cart-items/count', [CartItemController::class, 'count']);
    Route::put('/cart-items/{id}', [CartItemController::class, 'update']);
    Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);

    Route::get('/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

});

// Customer: Order History
Route::middleware('auth')->group(function () {
    Route::get('/order-history', [OrderController::class, 'getUserOrders'])->name('order-history.orders');
});

// Customer: Feedback and Suggestions
Route::middleware('auth')->group(function () {
    Route::resource('feedbacks', FeedbackController::class); // Manage customer feedback
});

// Deliveryman 
Route::middleware('auth')->group(function () {
    // Delivery routes for delivery personnel
    Route::get('/delivery/orders', [DeliveryController::class, 'index'])->name('delivery.orders');
    Route::post('/delivery', [DeliveryController::class, 'store'])->name('delivery.store');
    Route::post('/delivery/{id}', [DeliveryController::class, 'update']);
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Include Laravel Auth Routes
require __DIR__.'/auth.php';