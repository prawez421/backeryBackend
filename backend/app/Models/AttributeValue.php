<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttributeValue extends Model
{
    protected $table = 'attribute_values';

    protected $fillable = [
        'unique_id',
        'branch_code',
        'attribute_id',
        'attribute_value',
        'status',
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

    // Attribute Relationship
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(
            Attribute::class,
            'attribute_id'
        );
    }
}
