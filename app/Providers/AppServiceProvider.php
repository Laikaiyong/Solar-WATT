<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Napp\Xray\Facades\Xray;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Configure X-Ray
        Xray::addSegment('BootApplication');

        // Example of logging to CloudWatch
        \Log::info('Application started');
        Xray::endSegment('BootApplication');
    }
}
