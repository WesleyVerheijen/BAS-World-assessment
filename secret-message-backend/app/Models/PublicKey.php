<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicKey extends Model
{
    protected $fillable = ['public_key'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}