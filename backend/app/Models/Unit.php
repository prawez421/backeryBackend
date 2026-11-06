<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
      protected $fillable = [
      'unit_name',
       'short_name',
       'status',
      ];

       protected $casts = [
        'decimal_allowed' => 'boolean',
    ];
}
