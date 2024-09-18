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
        'project_name',
        'description',
        'price',
        'duration',
    ];

    // Define relationship with User model (constructor)
    public function constructor()
    {
        return $this->belongsTo(User::class, 'constructor_id');
    }
}