<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solar_products_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['Product', 'Service']);
            $table->decimal('price', 10, 2)->nullable(); // Use decimal for pricing
            $table->string('availability')->default('In Stock');
            $table->foreignId('solar_site_id')->constrained('solar_construction_sites')->onDelete('cascade'); // Optional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solar_product_services');
    }
};
