<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Aws\S3\S3Client;
use Aws\Rekognition\RekognitionClient;


class AwsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $this->app->singleton('aws.s3', function ($app) {
            return new S3Client([
                'version' => 'latest',
                'region' => config('services.aws.region'),
                'credentials' => [
                    'key' => config('services.aws.key'),
                    'secret' => config('services.aws.secret'),
                ],
            ]);
        });
    
        $this->app->singleton('aws.rekognition', function ($app) {
            return new RekognitionClient([
                'version' => 'latest',
                'region' => config('services.aws.region'),
                'credentials' => [
                    'key' => config('services.aws.key'),
                    'secret' => config('services.aws.secret'),
                ],
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
