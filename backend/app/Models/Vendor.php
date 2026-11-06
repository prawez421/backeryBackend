<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'vendor_code',
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
}