<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UnitController extends Controller
{
    // Get all units branch-wise
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        if (!$branchCode) {
            return response()->json([
                'success' => false,
                'message' => 'User branch code not found.',
            ], 403);
        }

        $units = Unit::where('branch_code', $branchCode)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Units fetched successfully',
            'data' => $units,
        ], 200);
    }

    // Add new unit
   
// Add new unit
public function store(Request $request)
{
    $branchCode = $request->user()->branch_code;

    if (!$branchCode) {
        return response()->json([
            'success' => false,
            'message' => 'User branch code not found.',
        ], 403);
    }

    $validated = $request->validate([
        'unit_name' => 'required|string|max:100',

        'short_name' => [
            'required',
            'string',
            'max:20',
            Rule::unique('units', 'short_name')
                ->where('branch_code', $branchCode),
        ],

        'status' => 'required|in:Active,Inactive',
    ]);

    $validated['branch_code'] = $branchCode;

    // Create Unit and Generate Unique ID
    $unit = DB::transaction(function () use ($validated) {

        // Temporary unique ID
        $validated['unique_id'] = 'TEMP-' . Str::uuid();

        // Create Unit
        $unit = Unit::create($validated);

        // Generate Final Unique ID
        $unit->unique_id = 'UNT-' . str_pad(
            $unit->id, 4, '0', STR_PAD_LEFT

            // 'VND-' . str_pad($vendorId, 4, '0', STR_PAD_LEFT);
        );

        $unit->save();

        return $unit->fresh();
    });

    return response()->json([
        'success' => true,
        'message' => 'Unit created successfully',
        'data' => $unit,
    ], 201);
}



    // Get single unit
    public function show(Request $request, string $id)
    {
        $unit = Unit::where('branch_code', $request->user()->branch_code)
            ->find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Unit details fetched successfully',
            'data' => $unit,
        ], 200);
    }

    // Update unit
    public function update(Request $request, string $id)
    {
        $branchCode = $request->user()->branch_code;

        $unit = Unit::where('branch_code', $branchCode)
            ->find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        $validated = $request->validate([
            'unit_name' => 'required|string|max:100',

            'short_name' => [
                'required',
                'string',
                'max:20',
                Rule::unique('units', 'short_name')
                    ->where('branch_code', $branchCode)
                    ->ignore($unit->id),
            ],

            'status' => 'required|in:Active,Inactive',
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Unit updated successfully',
            'data' => $unit->fresh(),
        ], 200);
    }

    // Delete unit
    public function destroy(Request $request, string $id)
    {
        $unit = Unit::where('branch_code', $request->user()->branch_code)
            ->find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit deleted successfully',
        ], 200);
    }
}
