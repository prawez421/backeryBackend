<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    protected $fillable = [
    'unique_id',
    'branch_code',
    'unit_name',
    'short_name',
    'status',
];

    protected $casts = [
        'decimal_allowed' => 'boolean',
    ];

    // Branch Relationship
    public function branch(): BelongsTo
    {
        return $this->belongsTo(
            Branch::class,
            'branch_code',
            'branch_code'
        );
    }
}
