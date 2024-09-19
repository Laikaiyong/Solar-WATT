<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToConstructorQuotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('constructor_quotations', function (Blueprint $table) {
            $table->string('status')->default('Pending'); // Add the status column with a default value
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
            $table->dropColumn('status'); // Drop the status column
        });
    }
}
