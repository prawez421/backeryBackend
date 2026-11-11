<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    // Registration
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email'
            ],

            'phone' => [
                'required',
                'string',
                'unique:users,phone'
            ],

            'password' => [
                'required',
                'string',
                'min:6'
            ],

            // Role validation
            'role' => [
                'required',
                'string',
                Rule::in(['user', 'manager','admin'])
            ],

            // Branch code validation
            'branch_code' => [
                'required',
                'string',
                'exists:branches,branch_code'
            ],
        ]);

        // Find active branch
        $branch = Branch::where(
            'branch_code',
            $validated['branch_code']
        )
        ->where('status', 'Active')
        ->first();

        if (!$branch) {
            return response()->json([
                'success' => false,
                'message' => 'Selected branch is inactive or unavailable.',
            ], 422);
        }

        // Create User
        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'phone'       => $validated['phone'],
            'password'    => $validated['password'],
            'role'        => $validated['role'],
            'status'      => true,
            'branch_code' => $branch->branch_code,
        ]);

        // Generate Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'      => true,
            'message'      => 'User registered successfully',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user->load('branch'),
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::with('branch')
            ->where('email', $request->email)
            ->first();

        if (
            !$user ||
            !Hash::check($request->password, $user->password)
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'The provided credentials are incorrect.'
                ],
            ]);
        }

        if (!$user->status) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'      => true,
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ], 200);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }

    // Get Active Branches
    public function getBranches()
    {
        $branches = Branch::where('status', 'Active')
            ->select('id', 'branch_name', 'branch_code')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Branches fetched successfully',
            'data' => $branches,
        ], 200);
    }
}
