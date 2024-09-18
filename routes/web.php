<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Company
use App\Http\Controllers\SolarConstructionSiteController;
use App\Http\Controllers\SolarProductServiceController;

//Constructor
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\ConstructorProjectController;

use App\Http\Controllers\DeliveryController;

//Constructor Quotation
Route::resource('quotations', QuotationController::class);

Route::middleware('auth')->group(function () {
    Route::get('/constructor-quotation', [QuotationController::class, 'index'])->name('constructor-quotation');
});


Route::middleware('auth')->group(function () {
    Route::resource('constructor-projects', ConstructorProjectController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/delivery', [DeliveryController::class, 'index'])->name('delivery.index');
    Route::get('/delivery/create', [DeliveryController::class, 'create'])->name('delivery.create');
    Route::post('/delivery', [DeliveryController::class, 'store'])->name('delivery.store');
    Route::get('/delivery/{id}/edit', [DeliveryController::class, 'edit'])->name('delivery.edit');
    Route::put('/delivery/{id}', [DeliveryController::class, 'update'])->name('delivery.update');
    Route::delete('/delivery/{id}', [DeliveryController::class, 'destroy'])->name('delivery.destroy');
});




// Solar Panel Construction Sites Routes
Route::resource('solar-construction-sites', SolarConstructionSiteController::class);

Route::middleware('auth')->group(function () {
    Route::get('/solar-construction-sites', [SolarConstructionSiteController::class, 'index'])->name('solar-construction-sites.index');
    Route::get('/solar-construction-sites/create', [SolarConstructionSiteController::class, 'create'])->name('solar-construction-sites.create');
    Route::post('/solar-construction-sites', [SolarConstructionSiteController::class, 'store'])->name('solar-construction-sites.store');
    Route::get('/solar-construction-sites/{id}/edit', [SolarConstructionSiteController::class, 'edit'])->name('solar-construction-sites.edit');
    Route::put('/solar-construction-sites/{id}', [SolarConstructionSiteController::class, 'update'])->name('solar-construction-sites.update');
    Route::delete('/solar-construction-sites/{id}', [SolarConstructionSiteController::class, 'destroy'])->name('solar-construction-sites.destroy');
});

Route::resource('solar-products-services', SolarProductServiceController::class);

// Solar Products & Services Routes
Route::middleware('auth')->group(function () {
    Route::get('/solar-products-services', [SolarProductServiceController::class, 'index'])->name('solar-products-services.index');
    Route::get('/solar-products-services/create', [SolarProductServiceController::class, 'create'])->name('solar-products-services.create');
    Route::post('/solar-products-services', [SolarProductServiceController::class, 'store'])->name('solar-products-services.store');
    Route::get('/solar-products-services/{id}/edit', [SolarProductServiceController::class, 'edit'])->name('solar-products-services.edit');
    Route::put('/solar-products-services/{id}', [SolarProductServiceController::class, 'update'])->name('solar-products-services.update');
    Route::delete('/solar-products-services/{id}', [SolarProductServiceController::class, 'destroy'])->name('solar-products-services.destroy');
});

// Customer
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\FeedbackController;

// Customer: Browse Solar Products & Services
Route::middleware('auth')->group(function () {
    Route::get('/product-list', [SolarProductServiceController::class, 'browse'])->name('product-list.browse');
});

// Customer: Order Solar Products & Services
Route::middleware('auth')->group(function () {
    Route::resource('orders', OrderController::class);
    Route::post('/orders/{id}/purchase', [OrderController::class, 'purchase'])->name('orders.purchase');
});
// Route::middleware('auth')->group(function () {
//     Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
//     Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
//     Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
//     Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
//     Route::post('/orders/{id}/edit', [OrderController::class, 'edit'])->name('orders.edit');
//     Route::put('/orders/{id}', [OrderController::class, 'update'])->name('orders.update');
//     Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('orders.destroy');
// });


// Customer: Purchase History
Route::middleware('auth')->group(function () {
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchases/{id}', [PurchaseController::class, 'show'])->name('purchases.show');
});

// Customer: Feedback and Suggestions
Route::middleware('auth')->group(function () {
    Route::get('feedbacks', [FeedbackController::class, 'index'])->name('feedbacks.index');
});
// Route::middleware('auth')->group(function () {
//     Route::get('/feedbacks', [FeedbackController::class, 'index'])->name('feedback.index');
//     Route::post('/feedbacks', [FeedbackController::class, 'store'])->name('feedback.store');
//     Route::post('/feedbacks/create', [FeedbackController::class, 'create'])->name('feedback.create');
//     Route::post('/feedbacks/{id}', [FeedbackController::class, 'update'])->name('feedback.update');
//     Route::post('/feedbacks/{id}/edit', [FeedbackController::class, 'edit'])->name('feedback.edit');
//     Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy'])->name('feedback.destroy');
// });


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [

    ]);
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';