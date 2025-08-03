<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSymmetricKeyRequest;
use App\Models\SymmetricKey;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SymmetricKeyController extends Controller
{
    /** POST /api/symmetric-keys */
    public function store(StoreSymmetricKeyRequest $request): JsonResponse
    {
        $key = SymmetricKey::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'cypher'      => $request->cypher,
            'signature'   => $request->signature,
            'algo'        => $request->algo,
        ]);

        return response()->json([
            'message' => 'Symmetric key stored.',
            'data'    => [
                'id'         => $key->id,
                'created_at' => $key->created_at,
            ],
        ], 201);
    }

    /** GET /api/symmetric-keys/{user} – latest key between me ↔ that user */
    public function show(User $user): JsonResponse
    {
        $me  = auth()->id();

        $key = SymmetricKey::where(/*function ($q) use ($me, $user) {
                    $q->where('sender_id', $me)
                      ->where('receiver_id', $user->id);
               })
               ->orWhere(*/function ($q) use ($me, $user) {
                    $q->where('sender_id', $user->id)
                      ->where('receiver_id', $me);
               })
               ->latest('created_at')
               ->first();

        if (! $key) {
            return response()->json(['message' => 'No symmetric key found'], 404);
        }

        return response()->json($key);
    }
}
