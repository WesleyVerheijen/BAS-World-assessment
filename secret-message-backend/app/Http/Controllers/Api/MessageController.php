<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Http\Requests\Api\UpdateMessageReadRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /** GET /api/messages?peer=2 */
    public function index(Request $request): JsonResponse
    {
        $me   = $request->user()->id;
        $peer = $request->query('peer');    // optional filter by conversation

        $query = Message::with(['sender:id,name', 'recipient:id,name'])
                 ->visible()
                 ->where('recipient_id', $me)->orWhere('sender_id', $me);

        if ($peer) {
            $query->where('sender_id', $peer);
        }

        return response()->json($query->latest()->get());
    }

    /** POST /api/messages */
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $msg = Message::create([
            'sender_id'    => $request->user()->id,
            'recipient_id' => $request->recipient_id,
            'cipher'       => $request->cipher,
            'read_once'    => $request->boolean('read_once', false),
            'expires_at'   => $request->input('expires_at'),
        ]);

        return response()->json(['data' => $msg], 201);
    }

    /** PUT /api/messages/{message}/read */
    public function markRead(UpdateMessageReadRequest $request, Message $message): JsonResponse
    {
        $message->update(['read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }
}
