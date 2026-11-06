<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VendorController extends Controller
{
    // Get All Vendors
    public function index(Request $request)
    {
        $query = Vendor::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('vendor_code', 'like', "%{$search}%")
                    ->orWhere('vendor_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('gst_number', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%");
            });
        }

        $vendors = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Vendor list fetched successfully.',
            'data' => $vendors,
        ], 200);
    }

    // Add Vendor
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_code' => 'required|string|max:50|unique:vendors,vendor_code',
            'vendor_name' => 'required|string|max:150',
            'company_name' => 'nullable|string|max:150',
            'category' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:150',
            'mobile' => 'required|string|digits:10',
           'email' => 'nullable|email|max:150|unique:vendors,email',
            'gst_number' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]{2}[A-Z0-9]{10}[0-9][A-Z0-9]Z[A-Z0-9]$/',
            ],
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|digits:6',
            'payment_terms' => 'required|string|max:50',
            'opening_balance' => 'nullable|numeric|min:0',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
            'remarks' => 'nullable|string',
        ]);

        $validated['gst_number'] = isset($validated['gst_number'])
            ? strtoupper($validated['gst_number'])
            : null;

        $vendor = Vendor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Vendor added successfully.',
            'data' => $vendor,
        ], 201);
    }

    // Get Single Vendor
    // public function show(string $id)
    // {
    //     $vendor = Vendor::find($id);

    //     if (!$vendor) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Vendor not found.',
    //         ], 404);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Vendor details fetched successfully.',
    //         'data' => $vendor,
    //     ], 200);
    // }

    // Update Vendor
    public function update(Request $request, string $id)
    {
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor not found.',
            ], 404);
        }

        $validated = $request->validate([
            'vendor_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vendors', 'vendor_code')->ignore($vendor->id),
            ],
            'vendor_name' => 'required|string|max:150',
            'company_name' => 'nullable|string|max:150',
            'category' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:150',
            'mobile' => 'required|string|digits:10',
             'email' => 'nullable|email|max:150|unique:vendors,email',
            'gst_number' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]{2}[A-Z0-9]{10}[0-9][A-Z0-9]Z[A-Z0-9]$/',
            ],
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|digits:6',
            'payment_terms' => 'required|string|max:50',
            'opening_balance' => 'nullable|numeric|min:0',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
            'remarks' => 'nullable|string',
        ]);

        $validated['gst_number'] = isset($validated['gst_number'])
            ? strtoupper($validated['gst_number'])
            : null;

        $vendor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Vendor updated successfully.',
            'data' => $vendor->fresh(),
        ], 200);
    }

    // Delete Vendor
    public function destroy(string $id)
    {
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor not found.',
            ], 404);
        }

        $vendor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vendor deleted successfully.',
        ], 200);
    }
}