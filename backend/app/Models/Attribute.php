<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    protected $table = 'attributes';

    protected $fillable = [
        'unique_id',
        'branch_code',
        'category_id',
        'attribute_name',
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

    // Category Relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class,
            'category_id',
            'id'
        );
    }

    // Attribute Values Relationship
    public function values(): HasMany
    {
        return $this->hasMany(
            AttributeValue::class,
            'attribute_id'
        );
    }

    
}
