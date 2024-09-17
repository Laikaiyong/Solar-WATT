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
        Schema::create('constructor_quotations', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('constructor_id'); // Foreign key to the constructor user
            $table->string('project_name'); // Name of the project
            $table->text('description'); // Project description
            $table->decimal('price', 10, 2); // Quotation price
            $table->integer('duration');
            $table->timestamps(); // Created at and updated at timestamps

            // Foreign key constraint linking to users (constructor)
            $table->foreign('constructor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constructor_quotations');
    }
};