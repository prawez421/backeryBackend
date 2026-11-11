<?php

namespace App\Http\Controllers;

use App\Models\AttributeValue;
use Illuminate\Http\Request;

class AttributeValueController extends Controller
{
    // GET: All Attribute Values
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $query = AttributeValue::where('branch_code', $branchCode)
            ->with('attribute');

        // Filter by Attribute
        if ($request->filled('attribute_id')) {

            $query->where('attribute_id', $request->attribute_id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attribute values fetched successfully',
            'data' => $query->latest()->paginate(
                $request->input('per_page', 10)
            ),
        ], 200);
    }

    // GET: Single Attribute Value
    public function show(Request $request, $id)
    {
        $value = AttributeValue::where(
            'branch_code',
            $request->user()->branch_code
        )
            ->with('attribute')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Attribute value fetched successfully',
            'data' => $value,
        ], 200);
    }

    // PUT: Update Attribute Value
    public function update(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $attributeValue = AttributeValue::where(
            'branch_code',
            $branchCode
        )->findOrFail($id);

        $validated = $request->validate([
            'attribute_value' => [
                'required',
                'string',
                'max:150',
            ],

            'status' => [
                'nullable',
                \Illuminate\Validation\Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $newValue = trim($validated['attribute_value']);

        if ($newValue === '') {
            return response()->json([
                'success' => false,
                'message' => 'Attribute value cannot be empty.',
            ], 422);
        }

        // Check duplicate within same branch and attribute
        $exists = AttributeValue::where('branch_code', $branchCode)
            ->where('attribute_id', $attributeValue->attribute_id)
            ->where('id', '!=', $attributeValue->id)
            ->whereRaw('LOWER(attribute_value) = ?', [
                mb_strtolower($newValue),
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute value already exists.',
                'errors' => [
                    'attribute_value' => [
                        'This value already exists in this attribute.',
                    ],
                ],
            ], 422);
        }

        $attributeValue->update([
            'attribute_value' => $newValue,
            'status' => $validated['status'] ?? $attributeValue->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attribute value updated successfully',
            'data' => $attributeValue->fresh()->load('attribute'),
        ], 200);
    }

    // DELETE: Single Attribute Value
    public function destroy(Request $request, $id)
    {
        $attributeValue = AttributeValue::where(
            'branch_code',
            $request->user()->branch_code
        )->findOrFail($id);

        $attributeValue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attribute value deleted successfully',
        ], 200);
    }
}
