<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    // Get all units  
    public function index()
    {
        $units = Unit::latest()->get();

        return response()->json([
         'success' => true,
         'message' => 'Units Fetched Successfully',
         'data'    => $units
        ], 200);
    }

    // add new units 
    public function store(Request $request)
    {
       $validated = $request->validate([
        'unit_name'  => 'required|string|max:100',
        'short_name' => 'required|string|max:20|unique:units,short_name',
        'status' => 'required|in:Active,Inactive',
       ]); 

       $unit = Unit::create($validated);

       return response()->json([
        'success'  => true,
        'message'  => 'unit created successfully',
        'data'     => $unit  
       ],201);
    }

   
    // Get single unit
    // public function show(string $id)
    // {
    //     $unit = Unit::find($id);

    //     if (!$unit) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Unit not found'
    //         ], 404);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Unit details fetched successfully',
    //         'data' => $unit
    //     ], 200);
    // }

   // Update unit
    public function update(Request $request, string $id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found'
            ], 404);
        }

        $validated = $request->validate([
            'unit_name' => 'required|string|max:100',
            'short_name' => [
                'required',
                'string',
                'max:20',
                Rule::unique('units', 'short_name')->ignore($unit->id),
            ],
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Unit updated successfully',
            'data' => $unit->fresh()
        ], 200);
    }
// Delete unit
    public function destroy(string $id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found'
            ], 404);
        }

        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit deleted successfully'
        ], 200);
    }
}

