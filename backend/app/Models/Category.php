<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'unique_id',
        'branch_code',
        'category_name',
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

    // Sub Category Relationship
    public function subCategories(): HasMany
    {
        return $this->hasMany(
            SubCategory::class,
            'category_id'
        );
    }
}
