<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    // GET: Category List
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $categories = Category::where('branch_code', $branchCode)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Category list fetched successfully',
            'data' => $categories,
        ], 200);
    }

    // POST: Add Category
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'category_name')
                    ->where('branch_code', $branchCode),
            ],
            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $category = DB::transaction(function () use ($validated, $branchCode) {

            $validated['branch_code'] = $branchCode;

            // Temporary unique ID
            $validated['unique_id'] = 'TEMP-' . Str::uuid();

            $category = Category::create($validated);

            // Generate CAT-0001 format
            $category->unique_id = 'CAT-' .
                str_pad($category->id, 4, '0', STR_PAD_LEFT);

            $category->save();

            return $category->fresh();
        });

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    // GET: Single Category
    public function show(Request $request, $id)
    {
        $category = Category::where('branch_code', $request->user()->branch_code)
            ->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Category fetched successfully',
            'data' => $category,
        ], 200);
    }

    // PUT: Update Category
    public function update(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $category = Category::where('branch_code', $branchCode)
            ->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'category_name')
                    ->where('branch_code', $branchCode)
                    ->ignore($category->id),
            ],
            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category->fresh(),
        ], 200);
    }

    // DELETE: Delete Category
    public function destroy(Request $request, $id)
    {
        $category = Category::where('branch_code', $request->user()->branch_code)
            ->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ], 200);
    }
}
