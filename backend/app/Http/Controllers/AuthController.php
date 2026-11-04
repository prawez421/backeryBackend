<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // registration 
    public function register(Request $request)
    {
        // request data validate karnein
        $validated = $request->validate([
          'name'     => ['required', 'string', 'max:255'],
          'email'    => ['required', 'string', 'email' , 'max:255', 'unique:users'],
          'phone'    => ['required', 'string', 'unique:users'],
          'password' => ['required', 'string', 'min:8'],  //  'password' => ['required', 'string', 'min:8', 'confirmed'],
          'role'     => ['required', 'string', 'in:admin,user,manager,vender'],  
        ]);

        // User create karein (Password automatic cast ya Hash ho jayega agar model mein hashed cast hai, warna Hash::make() use karein)

        $user = user::create([
         'name'     => $validated['name'],
         'email'    => $validated['email'],
         'phone'    => $validated['phone'],
         'password' => $validated['password'],  // Model mein 'password' => 'hashed' cast hone ki wajah se yeh automatically hash ho jayega
         'role'     => $validated['role'] ?? 'user',
         'status'   => true,
        ]);

        // Registration ke baad turant token generate karein taaki user auto-login ho jaye
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'User registered successfully',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ], 201);
    }

    // login 

    public function login(Request $request)
    {
        // login 
        $request->validate([
           'email'    => 'required|email',
           'password' => 'required',
        ]);

        $user = user::where('email', $request->email)->first();
        //check karein ki user exist karta hai aur password match hota hai 
        if(! $user || ! Hash::check($request->password, $user->password)){
            throw validationException::withMessages([
             'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Token create karein
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successgul',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user'  => $user
        ]);
    }

    // user logout
    public function logout(Request $request)
    {
        // Current access token ko delete/revoke kar dein
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}