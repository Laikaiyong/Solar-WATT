<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    // The attributes that are mass assignable.
    protected $fillable = [
        'order_id',
        'image_url',
        'title',
        'status',
        'message',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
