<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Company
use App\Http\Controllers\SolarConstructionSiteController;
use App\Http\Controllers\SolarProductServiceController;

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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/quotation', function () {
    return Inertia::render('Constructor/Quotation');
})->middleware(['auth', 'verified'])->name('constructor-quotation');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
