<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Branch;

class VendorController extends Controller
{
    // GENERATE UNIQUE VENDOR ID
    private function generateUniqueId($vendorId)
    {
        return 'VND-' . str_pad($vendorId, 4, '0', STR_PAD_LEFT);
    }

    // GET ALL VENDORS + STATISTICS
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        if (!$branchCode) {
            return response()->json([
                'success' => false,
                'message' => 'User branch code not found.',
            ], 403);
        }

        // Branch-wise statistics
        $totalVendors = Vendor::where('branch_code', $branchCode)->count();

        $activeVendors = Vendor::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->count();

        $inactiveVendors = Vendor::where('branch_code', $branchCode)
            ->where('status', 'Inactive')
            ->count();

        $openingBalanceTotal = Vendor::where('branch_code', $branchCode)
            ->sum('opening_balance');

        // Vendor search
        $query = Vendor::where('branch_code', $branchCode);

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('unique_id', 'like', "%{$search}%")
                    ->orWhere('vendor_code', 'like', "%{$search}%")
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

        // Pagination
        $perPage = (int) $request->input('per_page', 10);
        $perPage = min(max($perPage, 1), 100);

        $vendors = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Vendor list fetched successfully.',
            'statistics' => [
                'total_vendors' => $totalVendors,
                'active_vendors' => $activeVendors,
                'inactive_vendors' => $inactiveVendors,
                'opening_balance_total' => (float) $openingBalanceTotal,
            ],
            'vendors' => $vendors->items(),
            'pagination' => [
                'current_page' => $vendors->currentPage(),
                'per_page' => $vendors->perPage(),
                'total_items' => $vendors->total(),
                'total_pages' => $vendors->lastPage(),
            ],
        ], 200);
    }

    // ADD VENDOR
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        if (!$branchCode) {
            return response()->json([
                'success' => false,
                'message' => 'User branch code not found.',
            ], 403);
        }

        // Check branch exists and is active
        $branchExists = Branch::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->exists();

        if (!$branchExists) {
            return response()->json([
                'success' => false,
                'message' => 'User branch is inactive or unavailable.',
            ], 403);
        }

        $validated = $request->validate([
            'vendor_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vendors', 'vendor_code')
                    ->where('branch_code', $branchCode),
            ],

            'vendor_name' => 'required|string|max:150',
            'company_name' => 'nullable|string|max:150',
            'category' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:150',
            'mobile' => 'required|string|digits:10',

            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('vendors', 'email')
                    ->where('branch_code', $branchCode),
            ],

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

            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],

            'remarks' => 'nullable|string',
        ]);

        $validated['branch_code'] = $branchCode;

        $validated['gst_number'] = !empty($validated['gst_number'])
            ? strtoupper($validated['gst_number'])
            : null;

        $validated['opening_balance'] = $validated['opening_balance'] ?? 0;

        // Create Vendor and generate unique ID
        $vendor = DB::transaction(function () use ($validated) {
            $validated['unique_id'] = 'TEMP-' . Str::uuid();

            $vendor = Vendor::create($validated);

            $vendor->unique_id = $this->generateUniqueId($vendor->id);
            $vendor->save();

            return $vendor->fresh();
        });

        return response()->json([
            'success' => true,
            'message' => 'Vendor added successfully.',
            'data' => $vendor,
        ], 201);
    }

    // GET SINGLE VENDOR
    public function show(string $id, Request $request)
    {
        $vendor = Vendor::where('branch_code', $request->user()->branch_code)
            ->find($id);

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Vendor details fetched successfully.',
            'data' => $vendor,
        ], 200);
    }

    // UPDATE VENDOR
    public function update(Request $request, string $id)
    {
        $branchCode = $request->user()->branch_code;

        $vendor = Vendor::where('branch_code', $branchCode)
            ->find($id);

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
                Rule::unique('vendors', 'vendor_code')
                    ->where('branch_code', $branchCode)
                    ->ignore($vendor->id),
            ],

            'vendor_name' => 'required|string|max:150',
            'company_name' => 'nullable|string|max:150',
            'category' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:150',
            'mobile' => 'required|string|digits:10',

            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('vendors', 'email')
                    ->where('branch_code', $branchCode)
                    ->ignore($vendor->id),
            ],

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

            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],

            'remarks' => 'nullable|string',
        ]);

        $validated['gst_number'] = !empty($validated['gst_number'])
            ? strtoupper($validated['gst_number'])
            : null;

        $validated['opening_balance'] = $validated['opening_balance'] ?? 0;

        // Branch code cannot be changed through request
        unset($validated['branch_code']);

        $vendor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Vendor updated successfully.',
            'data' => $vendor->fresh(),
        ], 200);
    }

    // DELETE VENDOR
    public function destroy(Request $request, string $id)
    {
        $vendor = Vendor::where('branch_code', $request->user()->branch_code)
            ->find($id);

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
