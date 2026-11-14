<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
{
    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'selected_attributes',
        'purchase_price',
        'mrp',
        'selling_price',
        'discount',
        'tax',
        'total_amount',
    ];

    // Purchase Relationship
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class, 'purchase_id', 'id');
    }

    // Product Relationship
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    protected $casts = [
    'selected_attributes' => 'array',
];

}
