<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    protected $fillable = [
        'unique_id',
        'branch_code',
        'vendor_id',
        'invoice_number',
        'purchase_date',
        'subtotal',
        'discount',
        'tax',
        'grand_total',
        'paid_amount',
        'due_amount',
        'payment_status',
        'status',
        'remarks',
    ];

    // Vendor Relationship
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }

    // Purchase Items Relationship
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class, 'purchase_id', 'id');
    }
}
