<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * GET /api/users – return an array of user names.
     */
    public function index(Request $request)
    {
        // If you only want the name column:
        $names = User::select('id', 'name')->get();

        return response()->json($names);
    }
}
