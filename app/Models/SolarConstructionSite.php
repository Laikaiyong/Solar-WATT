<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarConstructionSite extends Model
{
    protected $table = 'solar_construction_sites';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'location',
        'contact_number',
        'email',
        'capacity',
        'manager_name',
        'status',
    ];

}
