<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQuotationIdToConstructorProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('constructor_projects', function (Blueprint $table) {
            // Add the quotation_id column as a foreign key
            $table->unsignedBigInteger('quotation_id')->after('id');

            // Define the foreign key constraint
            $table->foreign('quotation_id')
                  ->references('id')->on('constructor_quotations')
                  ->onDelete('cascade'); // Cascade delete projects if the quotation is deleted
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('constructor_projects', function (Blueprint $table) {
            // Drop the foreign key and the quotation_id column
            $table->dropForeign(['quotation_id']);
            $table->dropColumn('quotation_id');
        });
    }
}