<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarProductService extends Model
{
    protected $table = 'solar_products_services';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'name', 
        'description', 
        'type', 
        'price', 
        'availability', 
        'solar_site_id',
        'image_path'
    ];

    // Define relationship to SolarConstructionSite model
    public function solarSite()
    {
        return $this->belongsTo(SolarConstructionSite::class, 'solar_site_id');
    }
}
