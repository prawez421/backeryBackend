<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // Yeh class zaroori hai

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Route se user ka id ya user object nikalna (e.g., route /users/{user})
        $userId = $this->route('user')?->id ?? $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            
            // Email unique rahega lekin current user ki email ko ignore karega
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users', 'email')->ignore($userId)
            ],
            
            // Phone ke liye bhi same rule (nullable hone ki wajah se unique with ignore)
            'phone' => [
                'nullable', 
                'string', 
                Rule::unique('users', 'phone')->ignore($userId)
            ],
            
            'password' => ['nullable', 'string', 'min:8'], // Password update optional rakh sakte hain
            
            'role' => ['required', 'string', 'in:admin,user,manager,vendor'],
            'status' => ['nullable', 'boolean'],
        ];
    }
}