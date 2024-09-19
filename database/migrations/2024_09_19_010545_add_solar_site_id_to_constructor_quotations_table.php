<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSolarSiteIdToConstructorQuotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('constructor_quotations', function (Blueprint $table) {
            // Check if the column does not exist before adding it
            if (!Schema::hasColumn('constructor_quotations', 'solar_site_id')) {
                $table->unsignedBigInteger('solar_site_id')->after('constructor_id');
            }
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
            // Drop the column if it exists
            if (Schema::hasColumn('constructor_quotations', 'solar_site_id')) {
                $table->dropColumn('solar_site_id');
            }
        });
    }
}
