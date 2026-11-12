<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
{
    protected $table = 'purchase_items';

    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'purchase_price',
        'mrp',
        'selling_price',
        'discount',
        'tax',
        'total_amount',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'purchase_price' => 'decimal:2',
        'mrp' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}


