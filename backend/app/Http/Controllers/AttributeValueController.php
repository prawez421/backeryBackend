<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AttributeValueController extends Controller
{
    // GET: All Attribute Values
    public function index(Request $request)
    {
        $query = AttributeValue::with('attribute');

        if ($request->filled('attribute_id')) {
            $query->where('attribute_id', $request->attribute_id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(
                $request->input('per_page', 10)
            ),
        ]);
    }

    // GET: Single Value
    public function show($id)
    {
        $value = AttributeValue::with('attribute')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $value,
        ]);
    }

    // PUT: Update Value
    public function update(Request $request, $id)
    {
        $attributeValue = AttributeValue::findOrFail($id);

        $validated = $request->validate([
            'value' => [
                'required',
                'string',
                'max:255',
                Rule::unique('attribute_values', 'value')
                    ->where('attribute_id', $attributeValue->attribute_id)
                    ->ignore($attributeValue->id),
            ],

            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $attributeValue->update([
            'value' => trim($validated['value']),
            'status' => $validated['status'] ?? $attributeValue->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attribute value updated successfully',
            'data' => $attributeValue->fresh(),
        ]);
    }

    // DELETE: Single Value
    public function destroy($id)
    {
        $attributeValue = AttributeValue::findOrFail($id);

        $attributeValue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attribute value deleted successfully',
        ]);
    }
}
