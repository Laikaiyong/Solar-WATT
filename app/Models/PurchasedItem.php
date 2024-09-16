<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchasedItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'solar_product_id',
        'quantity',
        'price',
    ];

    /**
     * Get the order that owns the purchased item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the solar product or service that the purchased item refers to.
     */
    public function solarProductService()
    {
        return $this->belongsTo(SolarProductService::class, 'solar_product_id');
    }
}