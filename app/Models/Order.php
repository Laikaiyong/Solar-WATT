<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'status', 'total_amount'];

    // Define the relationship between Order and Delivery
    public function delivery()
    {
        return $this->hasOne(Delivery::class, 'order_id');
    }
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(SolarProductService::class, 'product_id');
    }
}