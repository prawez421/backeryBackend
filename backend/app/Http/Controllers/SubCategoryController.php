<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubCategoryController extends Controller
{
    // GET: All Sub Categories
 public function index()
{
    $categories = Category::where('status', 'Active')
        ->with([
            'subCategories' => function ($query) {
                 $query->latest();
            }
        ])
        ->latest()
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Active Categories and Sub Categories Fetched Successfully',
        'total_categories' => $categories->count(),
        'data' => $categories,
    ], 200);
}

    // POST: Add Sub Category
    public function store(Request $request)
    {
        $validated = $request->validate([
           'category_id' => [
    'required',
    'integer',
    Rule::exists('categories', 'id')->where('status', 'Active'),
],
            'sub_category_name' => [
                'required',
                'string',
                'max:100',
            ],
            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $exists = SubCategory::where(
            'category_id',
            $validated['category_id']
        )
            ->whereRaw('LOWER(sub_category_name) = ?', [
                mb_strtolower($validated['sub_category_name']),
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Category already exists',
                'errors' => [
                    'sub_category_name' => [
                        'This Sub Category already exists in this Category.',
                    ],
                ],
            ], 422);
        }

        $subCategory = SubCategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sub Category Added Successfully',
            'data' => $subCategory->load('category'),
        ], 201);
    }

    // GET: Single Sub Category
    public function show($id)
    {
        $subCategory = SubCategory::with('category')->find($id);

        if (!$subCategory) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Category Not Found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Sub Category Details',
            'data' => $subCategory,
        ], 200);
    }

    // PUT: Update Sub Category
    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::find($id);

        if (!$subCategory) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Category Not Found',
            ], 404);
        }

        $validated = $request->validate([
           'category_id' => [
    'required',
    'integer',
    Rule::exists('categories', 'id')->where('status', 'Active'),
],
            'sub_category_name' => [
                'required',
                'string',
                'max:100',
            ],
            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $exists = SubCategory::where(
            'category_id',
            $validated['category_id']
        )
            ->where('id', '!=', $subCategory->id)
            ->whereRaw('LOWER(sub_category_name) = ?', [
                mb_strtolower($validated['sub_category_name']),
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Category already exists',
                'errors' => [
                    'sub_category_name' => [
                        'This Sub Category already exists in this Category.',
                    ],
                ],
            ], 422);
        }

        $subCategory->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sub Category Updated Successfully',
            'data' => $subCategory->fresh()->load('category'),
        ], 200);
    }

    // DELETE: Sub Category
    public function destroy($id)
    {
        $subCategory = SubCategory::find($id);

        if (!$subCategory) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Category Not Found',
            ], 404);
        }

        $subCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sub Category Deleted Successfully',
        ], 200);
    }
}