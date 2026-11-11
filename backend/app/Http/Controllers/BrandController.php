<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    // GET: Brands + Categories
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        // Active categories of logged-in branch
        $categories = Category::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->select('id', 'unique_id', 'category_name', 'status')
            ->orderBy('category_name')
            ->get();

        // Brands of logged-in branch
        $query = Brand::with(['category' => function ($query) use ($branchCode) {
                $query->where('branch_code', $branchCode);
            }])
            ->where('branch_code', $branchCode);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('brand_name', 'like', "%{$search}%")
                  ->orWhere('unique_id', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('category_name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $brands = $query->latest()->paginate(
            $request->integer('per_page', 1000)
        );

        return response()->json([
            'success' => true,
            'message' => 'Brands and categories fetched successfully',
            'data' => [
                'brands' => $brands,
                'categories' => $categories,
            ],
        ]);
    }

    // POST: Create Brand
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(
                    fn ($query) => $query
                        ->where('branch_code', $branchCode)
                        ->where('status', 'Active')
                ),
            ],
            'brand_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'brand_name')
                    ->where(fn ($query) => $query
                        ->where('branch_code', $branchCode)
                        ->where('category_id', $request->input('category_id'))),
            ],
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::in(['Active', 'Inactive'])],
        ]);

        $brand = DB::transaction(function () use ($validated, $branchCode) {
            $brand = Brand::create([
                'unique_id' => 'TEMP-' . Str::uuid(),
                'branch_code' => $branchCode,
                'category_id' => $validated['category_id'],
                'brand_name' => trim($validated['brand_name']),
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'] ?? 'Active',
            ]);

            $brand->unique_id = 'BRD-' . str_pad(
                $brand->id,
                4,
                '0',
                STR_PAD_LEFT
            );

            $brand->save();

            return $brand;
        });

        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully',
            'data' => $brand->load('category'),
        ], 201);
    }

    // GET: Single Brand
    public function show(Request $request, $id)
    {
        $brand = Brand::with('category')
            ->where('branch_code', $request->user()->branch_code)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $brand,
        ]);
    }

    // PUT: Update Brand
    public function update(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $brand = Brand::where('branch_code', $branchCode)
            ->findOrFail($id);

        $validated = $request->validate([
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(
                    fn ($query) => $query
                        ->where('branch_code', $branchCode)
                        ->where('status', 'Active')
                ),
            ],
            'brand_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'brand_name')
                    ->where(fn ($query) => $query
                        ->where('branch_code', $branchCode)
                        ->where('category_id', $request->input('category_id')))
                    ->ignore($brand->id),
            ],
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::in(['Active', 'Inactive'])],
        ]);

        $brand->update([
            'category_id' => $validated['category_id'],
            'brand_name' => trim($validated['brand_name']),
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? $brand->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully',
            'data' => $brand->fresh()->load('category'),
        ]);
    }

    // DELETE: Brand
    public function destroy(Request $request, $id)
    {
        $brand = Brand::where('branch_code', $request->user()->branch_code)
            ->findOrFail($id);

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully',
        ]);
    }
}
