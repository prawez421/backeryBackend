<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SubCategoryController extends Controller
{
    // GET: All Sub Categories
  
// GET: All Sub Categories
public function index(Request $request)
{
    $branchCode = $request->user()->branch_code;

    $categories = Category::where('branch_code', $branchCode)
        ->with([
            'subCategories' => function ($query) use ($branchCode) {
                $query->where('branch_code', $branchCode)
                    ->latest();
            }
        ])
        ->latest()
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Categories and Sub Categories Fetched Successfully',
        'total_categories' => $categories->count(),
        'data' => $categories,
    ], 200);
}


    // POST: Add Sub Category
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where('branch_code', $branchCode)
                    ->where('status', 'Active'),
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

        // Check duplicate within same branch and category
        $exists = SubCategory::where('branch_code', $branchCode)
            ->where('category_id', $validated['category_id'])
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

        $subCategory = DB::transaction(function () use ($validated, $branchCode) {

            $validated['branch_code'] = $branchCode;

            // Temporary unique ID
            $validated['unique_id'] = 'TEMP-' . Str::uuid();

            $subCategory = SubCategory::create($validated);

            // Generate SUB-0001 format
            $subCategory->unique_id = 'SUB-' .
                str_pad($subCategory->id, 4, '0', STR_PAD_LEFT);

            $subCategory->save();

            return $subCategory->fresh()->load('category');
        });

        return response()->json([
            'success' => true,
            'message' => 'Sub Category Added Successfully',
            'data' => $subCategory,
        ], 201);
    }

    // GET: Single Sub Category
    public function show(Request $request, $id)
    {
        $subCategory = SubCategory::where(
            'branch_code',
            $request->user()->branch_code
        )
            ->with('category')
            ->find($id);

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
        $branchCode = $request->user()->branch_code;

        $subCategory = SubCategory::where('branch_code', $branchCode)
            ->find($id);

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
                Rule::exists('categories', 'id')
                    ->where('branch_code', $branchCode)
                    ->where('status', 'Active'),
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

        // Check duplicate excluding current record
        $exists = SubCategory::where('branch_code', $branchCode)
            ->where('category_id', $validated['category_id'])
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
    public function destroy(Request $request, $id)
    {
        $subCategory = SubCategory::where(
            'branch_code',
            $request->user()->branch_code
        )->find($id);

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
