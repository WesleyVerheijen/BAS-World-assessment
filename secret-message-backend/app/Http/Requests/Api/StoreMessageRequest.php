<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
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
            'recipient_id' => ['required', 'integer', 'exists:users,id', 'not_in:'.$this->user()->id],
            'cipher'       => ['required', 'string', 'max:10000', 'regex:/^[A-Za-z0-9+\/=]+$/'],
            'read_once'    => ['boolean'],
            'expires_at'   => ['nullable', 'date', 'after:now'],
        ];
    }

    public function wantsJson(): bool   // force JSON responses for failed registration
    {
        return true;
    }
}
