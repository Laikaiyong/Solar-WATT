<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $table = 'constructor_quotations';

    protected $fillable = [
        'constructor_id',
        'solar_site_id',
        'project_name',
        'description',
        'price',
        'duration',
        'status',
    ];

    // Define relationship with User model (constructor)
    public function constructor()
    {
        return $this->belongsTo(User::class, 'constructor_id');
    }

    public function solarSite()
    {
        return $this->belongsTo(SolarConstructionSite::class, 'solar_site_id');
    }

    public function project()
    {
        return $this->hasOne(ConstructorProject::class, 'quotation_id');
    }


}