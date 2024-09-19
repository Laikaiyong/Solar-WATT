<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->unique('user_id'); // Add unique constraint
        });
    }

    public function down()
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropUnique(['user_id']); // Remove unique constraint if rolled back
        });
    }
};
