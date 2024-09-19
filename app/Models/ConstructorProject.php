<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConstructorProject extends Model
{
    use HasFactory;

    protected $table = 'constructor_projects';

    protected $fillable = [
        'project_name',
        'description',
        'start_date', 
        'expected_end_date', 
        'constructor_in_charge', 
        'manager_name', 
        'manager_contact_number', 
        'status',
        'quotation_id'
    ];

      // Define the relationship to the Quotation model
      public function quotation()
      {
          return $this->belongsTo(Quotation::class, 'quotation_id');
      }
}
