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
            // Check if the 'quotation_id' column does not exist
            if (!Schema::hasColumn('constructor_projects', 'quotation_id')) {
                // Add the 'quotation_id' column
                $table->unsignedBigInteger('quotation_id')->after('id');
            }

            // Get the foreign keys on the constructor_projects table
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $foreignKeys = $sm->listTableForeignKeys('constructor_projects');

            // Check if the foreign key for 'quotation_id' does not exist
            $foreignKeyExists = false;
            foreach ($foreignKeys as $foreignKey) {
                if ($foreignKey->getColumns() === ['quotation_id']) {
                    $foreignKeyExists = true;
                    break;
                }
            }

            // If the foreign key does not exist, add it
            if (!$foreignKeyExists) {
                $table->foreign('quotation_id')
                    ->references('id')->on('constructor_quotations')
                    ->onDelete('cascade'); // Cascade delete projects if the quotation is deleted
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
        Schema::table('constructor_projects', function (Blueprint $table) {
            // Check if the 'quotation_id' column exists before attempting to drop
            if (Schema::hasColumn('constructor_projects', 'quotation_id')) {
                // Drop the foreign key if it exists
                $table->dropForeign(['quotation_id']);
                // Drop the 'quotation_id' column
                $table->dropColumn('quotation_id');
            }
        });
    }
}
