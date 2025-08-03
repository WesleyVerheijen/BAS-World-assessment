<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StorePublicKeyRequest extends FormRequest
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
            'public_key' => [
                'required',
                'string',
                'max:5000',                    // plenty for 4096-bit
                'regex:/^[A-Za-z0-9+\/=]+$/',  // looks like base64
            ],
        ];
    }

    public function wantsJson(): bool   // force JSON responses for failed registration
    {
        return true;
    }
}
