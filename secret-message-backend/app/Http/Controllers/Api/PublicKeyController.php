<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePublicKeyRequest;
use App\Models\PublicKey;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicKeyController extends Controller
{
    /**
     * POST /api/public-keys
     * Save (or rotate) the authenticated user’s public key.
     */
    public function store(StorePublicKeyRequest $request): JsonResponse
    {
        $key = $request->user()->publicKeys()->create([
            'public_key' => $request->public_key,
        ]);

        return response()->json([
            'message' => 'Public key stored.',
            'data'    => [
                'id'         => $key->id,
                'created_at' => $key->created_at,
            ],
        ], 201);
    }

    /**
     * GET /api/public-keys/{user}
     * Fetch the *latest* public key for the given user ID.
     */
    public function show(User $user): JsonResponse
    {
        $key = $user->publicKeys()
                    ->latest('created_at')
                    ->first();

        if (! $key) {
            return response()->json([
                'message' => 'This user has not published a public key.',
            ], 404);
        }

        return response()->json([
            'user_id'    => $user->id,
            'public_key' => $key->public_key,
            'created_at' => $key->created_at,
        ]);
    }
}