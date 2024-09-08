<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarConstructionSite extends Model
{
    // Define the table associated with the model (if not using the default table name)
    protected $table = 'solar_construction_sites';

    // Specify the primary key if it's not 'id'
    protected $primaryKey = 'id';

    // If the primary key is not an integer
    protected $keyType = 'int';

    // If the model does not have timestamps
    public $timestamps = true;
}
