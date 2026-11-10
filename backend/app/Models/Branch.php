<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Vendor;

class Branch extends Model
{
    protected $table = 'branches';

    protected $fillable = [
        'branch_name',
        'branch_code',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'email',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Branch has many Users using branch_code
    public function users(): HasMany
    {
        return $this->hasMany(
            User::class,
            'branch_id',
            'branch_code'
        );
    }

    // Branch has many Vendors using branch primary ID
    public function vendors(): HasMany
    {
        return $this->hasMany(
            Vendor::class,
            'branch_id',
            'id'
        );
    }
}
