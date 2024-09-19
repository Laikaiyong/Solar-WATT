<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToConstructorQuotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('constructor_quotations', function (Blueprint $table) {
            // Add the foreign key constraint with cascading deletes
            $table->foreign('solar_site_id')
                ->references('id')
                ->on('solar_construction_sites')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('constructor_quotations', function (Blueprint $table) {
            // Drop the foreign key constraint if it exists
            $table->dropForeign(['solar_site_id']);
        });
    }
}
