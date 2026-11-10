<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttributeController extends Controller
{
    // GET: All Attributes
    public function index(Request $request)
    {
        $query = Attribute::with('values')
            ->withCount('values');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('attribute_name', 'LIKE', "%{$search}%");
        }

        // Status filter
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
        ]);
    }

    // POST: Create Attribute with Values
    public function store(Request $request)
    {
        $validated = $request->validate([
            'attribute_name' => [
                'required',
                'string',
                'max:255',
                'unique:attributes,attribute_name',
            ],

            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],

            'values' => [
                'required',
                'array',
                'min:1',
            ],

            'values.*' => [
                'required',
                'string',
                'max:255',
                'distinct:ignore_case',
            ],
        ]);

        $attribute = DB::transaction(function () use ($validated) {

            $attribute = Attribute::create([
                'attribute_name' => $validated['attribute_name'],
                'status' => $validated['status'] ?? 'Active',
            ]);

            foreach ($validated['values'] as $value) {
                $attribute->values()->create([
                    'value' => trim($value),
                    'status' => 'Active',
                ]);
            }

            return $attribute;
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute created successfully',
            'data' => $attribute->load('values'),
        ], 201);
    }

    // GET: Single Attribute
    public function show($id)
    {
        $attribute = Attribute::with('values')
            ->withCount('values')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Attribute details fetched successfully',
            'data' => $attribute,
        ]);
    }

    // PUT: Update Attribute and Values
    public function update(Request $request, $id)
    {
        $attribute = Attribute::findOrFail($id);

        $validated = $request->validate([
            'attribute_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('attributes', 'attribute_name')
                    ->ignore($attribute->id),
            ],

            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],

            'values' => [
                'required',
                'array',
                'min:1',
            ],

            'values.*' => [
                'required',
                'string',
                'max:255',
                'distinct:ignore_case',
            ],
        ]);

        DB::transaction(function () use ($attribute, $validated) {

            $attribute->update([
                'attribute_name' => $validated['attribute_name'],
                'status' => $validated['status'] ?? 'Active',
            ]);

            $values = collect($validated['values'])
                ->map(fn ($value) => trim($value))
                ->unique(fn ($value) => mb_strtolower($value))
                ->values();

            // Create new values and keep existing values
            foreach ($values as $value) {
                $attribute->values()->firstOrCreate([
                    'value' => $value,
                ], [
                    'status' => 'Active',
                ]);
            }

            // Remove values which are no longer submitted
            $attribute->values()
                ->whereNotIn('value', $values->all())
                ->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute updated successfully',
            'data' => $attribute->fresh()->load('values'),
        ]);
    }

    // DELETE: Attribute with Values
    public function destroy($id)
    {
        $attribute = Attribute::findOrFail($id);

        DB::transaction(function () use ($attribute) {
            $attribute->values()->delete();
            $attribute->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Attribute deleted successfully',
        ]);
    }
}
