<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PublicKeyController;
use App\Http\Controllers\Api\SymmetricKeyController;
use App\Http\Controllers\Api\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/auth', fn (Request $request) => $request->user());
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'index']);

Route::middleware('auth:sanctum')->post('/public-keys', [PublicKeyController::class, 'store']);
Route::middleware('auth:sanctum')->get('/public-keys/{user}', [PublicKeyController::class, 'show']);

Route::middleware('auth:sanctum')->post('/symmetric-keys', [SymmetricKeyController::class, 'store']);
Route::middleware('auth:sanctum')->get('/symmetric-keys/{user}', [SymmetricKeyController::class, 'show']);

Route::middleware('auth:sanctum')->post('/messages', [MessageController::class, 'store']);
Route::middleware('auth:sanctum')->get('/messages', [MessageController::class, 'index']);
Route::middleware('auth:sanctum')->put('/messages/{message}/read', [MessageController::class, 'markRead']);

Route::get('/user', fn (Request $request) => $request->user())->middleware('auth:sanctum');

Route::get('/test', fn (Request $request) => ['test' => true, 'message' => 'API is running!']);

