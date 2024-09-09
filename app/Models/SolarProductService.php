<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarProductService extends Model
{
    // Define the table associated with the model (if not using the default table name)
    protected $table = 'solar_products_services';

    // Specify the primary key if it's not 'id'
    protected $primaryKey = 'id';

    // If the primary key is not an integer
    protected $keyType = 'int';

    // If the model does not have timestamps
    public $timestamps = true;

    // Define which attributes are mass assignable
    protected $fillable = [
        'name', 
        'description', 
        'type', 
        'price', 
        'availability', 
        'solar_site_id'
    ];

    // Define relationship to SolarConstructionSite model
    public function solarSite()
    {
        return $this->belongsTo(SolarConstructionSite::class, 'solar_site_id');
    }
}
