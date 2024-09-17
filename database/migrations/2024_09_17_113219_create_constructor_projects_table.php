<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConstructorProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('constructor_projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->text('description');
            $table->date('start_date');
            $table->date('expected_end_date');

            // Additional fields for constructor and manager
            $table->string('constructor_in_charge');
            $table->string('manager_name');
            $table->string('manager_contact_number');

            
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('constructor_projects');
    }
};
