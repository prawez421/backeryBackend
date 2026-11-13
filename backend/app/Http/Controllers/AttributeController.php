<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AttributeController extends Controller
{
    // GET: All Attributes
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $query = Attribute::where('branch_code', $branchCode)
            ->with([
                'category',
                'values' => function ($query) use ($branchCode) {
                    $query->where('branch_code', $branchCode)->latest();
                }
            ])
            ->withCount([
                'values' => function ($query) use ($branchCode) {
                    $query->where('branch_code', $branchCode);
                }
            ]);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('attribute_name', 'LIKE', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where(
                            'category_name',
                            'LIKE',
                            "%{$search}%"
                        );
                    });
            });
        }

        // Category Filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Status Filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attributes = $query->latest()->paginate(
            $request->input('per_page', 10)
        );

        return response()->json([
            'success' => true,
            'message' => 'Attributes fetched successfully',
            'data' => $attributes,
        ], 200);
    }


    // POST: Create Attribute with Values
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([

            // Category Validation
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where('branch_code', $branchCode),
            ],

            // Attribute Name
            'attribute_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('attributes', 'attribute_name')
                    ->where('branch_code', $branchCode),
            ],

            // Status
            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],

            // Attribute Values
            'values' => [
                'required',
                'array',
                'min:1',
            ],

            'values.*' => [
                'required',
                'string',
                'max:150',
                'distinct:ignore_case',
            ],
        ]);

        // Trim Values
        $values = collect($validated['values'])
            ->map(fn ($value) => trim($value))
            ->values();

        // Check Empty Values
        if ($values->contains(fn ($value) => $value === '')) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute values cannot be empty.',
            ], 422);
        }

        // Check Duplicate Values
        if (
            $values->map(fn ($value) => mb_strtolower($value))
                ->unique()
                ->count() !== $values->count()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate attribute values are not allowed.',
            ], 422);
        }

        $attribute = DB::transaction(function () use (
            $validated,
            $values,
            $branchCode
        ) {

            // Create Attribute
            $attribute = Attribute::create([
                'unique_id' => 'TEMP-' . Str::uuid(),
                'branch_code' => $branchCode,
                'category_id' => $validated['category_id'],
                'attribute_name' => $validated['attribute_name'],
                'status' => $validated['status'] ?? 'Active',
            ]);

            // Generate Attribute Unique ID
            $attribute->unique_id = 'ATT-' .
                str_pad($attribute->id, 4, '0', STR_PAD_LEFT);

            $attribute->save();

            // Create Attribute Values
            foreach ($values as $value) {

                $attributeValue = AttributeValue::create([
                    'unique_id' => 'TEMP-' . Str::uuid(),
                    'branch_code' => $branchCode,
                    'attribute_id' => $attribute->id,
                    'attribute_value' => $value,
                    'status' => 'Active',
                ]);

                // Generate Value Unique ID
                $attributeValue->unique_id = 'AV-' .
                    str_pad($attributeValue->id, 4, '0', STR_PAD_LEFT);

                $attributeValue->save();
            }

            return $attribute;
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute created successfully',
            'data' => $attribute->load(['category', 'values']),
        ], 201);
    }


    // GET: Single Attribute
    public function show(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $attribute = Attribute::where('branch_code', $branchCode)
            ->with([
                'category',
                'values' => function ($query) use ($branchCode) {
                    $query->where('branch_code', $branchCode);
                }
            ])
            ->withCount([
                'values' => function ($query) use ($branchCode) {
                    $query->where('branch_code', $branchCode);
                }
            ])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Attribute details fetched successfully',
            'data' => $attribute,
        ], 200);
    }


    // PUT: Update Attribute and Values
    public function update(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $attribute = Attribute::where('branch_code', $branchCode)
            ->findOrFail($id);

        $validated = $request->validate([

            // Category Validation
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where('branch_code', $branchCode),
            ],

            // Attribute Name
            'attribute_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('attributes', 'attribute_name')
                    ->where('branch_code', $branchCode)
                    ->ignore($attribute->id),
            ],

            // Status
            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],

            // Attribute Values
            'values' => [
                'required',
                'array',
                'min:1',
            ],

            'values.*' => [
                'required',
                'string',
                'max:150',
                'distinct:ignore_case',
            ],
        ]);

        // Trim Values
        $values = collect($validated['values'])
            ->map(fn ($value) => trim($value))
            ->values();

        if ($values->contains(fn ($value) => $value === '')) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute values cannot be empty.',
            ], 422);
        }

        // Check Duplicate Values
        if (
            $values->map(fn ($value) => mb_strtolower($value))
                ->unique()
                ->count() !== $values->count()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate attribute values are not allowed.',
            ], 422);
        }

        DB::transaction(function () use (
            $attribute,
            $validated,
            $values,
            $branchCode
        ) {

            // Update Attribute
            $attribute->update([
                'category_id' => $validated['category_id'],
                'attribute_name' => $validated['attribute_name'],
                'status' => $validated['status'] ?? $attribute->status,
            ]);

            // Get Existing Values
            $existingValues = AttributeValue::where(
                'branch_code',
                $branchCode
            )
                ->where('attribute_id', $attribute->id)
                ->get();

            $keepIds = [];

            foreach ($values as $value) {

                // Find Existing Value
                $existing = $existingValues->first(
                    fn ($item) =>
                        mb_strtolower($item->attribute_value) ===
                        mb_strtolower($value)
                );

                if ($existing) {

                    $keepIds[] = $existing->id;

                    if ($existing->attribute_value !== $value) {
                        $existing->update([
                            'attribute_value' => $value,
                        ]);
                    }

                } else {

                    // Create New Value
                    $newValue = AttributeValue::create([
                        'unique_id' => 'TEMP-' . Str::uuid(),
                        'branch_code' => $branchCode,
                        'attribute_id' => $attribute->id,
                        'attribute_value' => $value,
                        'status' => 'Active',
                    ]);

                    $newValue->unique_id = 'AV-' .
                        str_pad($newValue->id, 4, '0', STR_PAD_LEFT);

                    $newValue->save();

                    $keepIds[] = $newValue->id;
                }
            }

            // Delete Removed Values
            AttributeValue::where('branch_code', $branchCode)
                ->where('attribute_id', $attribute->id)
                ->whereNotIn('id', $keepIds)
                ->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute updated successfully',
            'data' => $attribute->fresh()->load(['category', 'values']),
        ], 200);
    }


    // DELETE: Attribute with Values
    public function destroy(Request $request, $id)
    {
        $attribute = Attribute::where(
            'branch_code',
            $request->user()->branch_code
        )->findOrFail($id);

        DB::transaction(function () use ($attribute) {

            // Delete Only This Branch Values
            AttributeValue::where('branch_code', $attribute->branch_code)
                ->where('attribute_id', $attribute->id)
                ->delete();

            $attribute->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute deleted successfully',
        ], 200);
    }
}
