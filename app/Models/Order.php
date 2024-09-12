<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'order_date',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the purchased items for the order.
     */
    public function purchasedItems()
    {
        return $this->hasMany(PurchasedItem::class);
    }

    /**
     * Fetch related products.
     */
    public function products()
    {
        return $this->belongsToMany(SolarProductService::class, 'order_product')
                    ->withPivot('quantity', 'price');
    }

}