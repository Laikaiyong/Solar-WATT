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

    public function quotations()
    {
        return $this->hasMany(Quotation::class, 'solar_site_id');
    }

    public function delete()
    {
        // Use the parent delete method to delete the solar site
        parent::delete();

        // Manually delete associated quotations if not using cascading deletes
        $this->quotations()->delete();
    }
}
