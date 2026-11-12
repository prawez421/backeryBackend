<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'unique_id',
        'branch_code',
        'product_name',
        'category_id',
        'sub_category_id',
        'brand_id',
        'unit_id',
        'product_image',
        'product_images',
        'description',
        'status',
    ];

    protected $casts = [
        'product_images' => 'array',
    ];

    // Category Relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Sub Category Relationship
    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    // Brand Relationship
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    // Unit Relationship
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
}
