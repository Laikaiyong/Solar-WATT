<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Include HasFactory
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(SolarProductService::class, 'product_id');
    }
}


