<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreSymmetricKeyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'integer', 'exists:users,id', 'different:sender_id'],
            'cypher'      => ['required', 'string', 'max:5000', 'regex:/^[A-Za-z0-9+\/=]+$/'],
            'signature'   => ['required', 'string', 'max:5000', 'regex:/^[A-Za-z0-9+\/=]+$/'],
            'algo'        => ['required', 'string', 'max:50'],
        ];
    }

    public function wantsJson(): bool   // force JSON responses for failed registration
    {
        return true;
    }
}
