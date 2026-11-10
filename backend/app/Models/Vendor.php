<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Branch;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vendor extends Model
{
    protected $fillable = [
        'unique_id',
        'vendor_code',
        'branch_id',
        'vendor_name',
        'company_name',
        'category',
        'contact_person',
        'mobile',
        'email',
        'gst_number',
        'address',
        'city',
        'state',
        'pincode',
        'payment_terms',
        'opening_balance',
        'status',
        'remarks',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
    ];

    // Branch Relationship
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
