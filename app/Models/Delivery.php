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

    // Define the inverse relationship back to Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}