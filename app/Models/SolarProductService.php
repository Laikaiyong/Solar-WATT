<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarProductService extends Model
{
    // Define the table associated with the model (if not using the default table name)
    protected $table = 'solar_product_services';

    // Specify the primary key if it's not 'id'
    protected $primaryKey = 'id';

    // If the primary key is not an integer
    protected $keyType = 'int';

    // If the model does not have timestamps
    public $timestamps = true;
}
