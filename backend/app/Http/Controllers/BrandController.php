<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    // GET: All Brands + Categories
    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        // Categories for Brand dropdown
        $categories = Category::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->select('id', 'category_name', 'status')
            ->orderBy('category_name')
            ->get();

        // Branch-wise Brands
        $query = Brand::where('branch_code', $branchCode)
            ->with([
                'category' => function ($categoryQuery) use ($branchCode) {
                    $categoryQuery
                        ->where('branch_code', $branchCode)
                        ->select('id', 'branch_code', 'category_name', 'status');
                }
            ]);

        // Search
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search, $branchCode) {
                $q->where('brand_name', 'like', "%{$search}%")
                    ->orWhere('unique_id', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use (
                        $search,
                        $branchCode
                    ) {
                        $categoryQuery
                            ->where('branch_code', $branchCode)
                            ->where(
                                'category_name',
                                'like',
                                "%{$search}%"
                            );
                    });
            });
        }

        // Status Filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category Filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $brands = $query->latest()->paginate(
            $request->integer('per_page', 15)
        );

        return response()->json([
            'success' => true,
            'message' => 'Brands fetched successfully',

            // Category dropdown data
            'categories' => $categories,

            // Paginated brand data
            'data' => $brands,
        ]);
    }

    // POST: Create Brand
    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(function ($query) use ($branchCode) {
                        $query->where('branch_code', $branchCode);
                    }),
            ],

            'brand_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'brand_name')
                    ->where(fn ($query) => $query->where(
                        'branch_code',
                        $branchCode
                    )),
            ],

            'brand_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'description' => 'nullable|string',

            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $logoPath = null;

        if ($request->hasFile('brand_logo')) {
            $logoPath = $request->file('brand_logo')
                ->store('brands', 'public');
        }

        try {
            $brand = DB::transaction(function () use (
                $validated,
                $branchCode,
                $logoPath
            ) {
                $brand = Brand::create([
                    'unique_id' => 'TEMP-' . Str::uuid(),
                    'branch_code' => $branchCode,
                    'category_id' => $validated['category_id'],
                    'brand_name' => trim($validated['brand_name']),
                    'brand_logo' => $logoPath,
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
        } catch (\Throwable $e) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }

            throw $e;
        }

        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully',
            'data' => $brand->load('category'),
        ], 201);
    }

    // GET: Single Brand
    public function show(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $brand = Brand::with([
            'category' => function ($query) use ($branchCode) {
                $query->where('branch_code', $branchCode);
            }
        ])
            ->where('branch_code', $branchCode)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Brand fetched successfully',
            'data' => $brand,
        ]);
    }

    // POST: Update Brand
    public function update(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $brand = Brand::where('branch_code', $branchCode)
            ->findOrFail($id);

        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(function ($query) use ($branchCode) {
                        $query->where('branch_code', $branchCode);
                    }),
            ],

            'brand_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'brand_name')
                    ->where(fn ($query) => $query->where(
                        'branch_code',
                        $branchCode
                    ))
                    ->ignore($brand->id),
            ],

            'brand_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'remove_logo' => 'nullable|boolean',

            'description' => 'nullable|string',

            'status' => [
                'nullable',
                Rule::in(['Active', 'Inactive']),
            ],
        ]);

        $oldLogo = $brand->brand_logo;
        $newLogo = $oldLogo;

        if ($request->hasFile('brand_logo')) {
            $newLogo = $request->file('brand_logo')
                ->store('brands', 'public');
        } elseif ($request->boolean('remove_logo')) {
            $newLogo = null;
        }

        try {
            $brand->update([
                'category_id' => $validated['category_id'],
                'brand_name' => trim($validated['brand_name']),
                'brand_logo' => $newLogo,

                'description' => array_key_exists(
                    'description',
                    $validated
                )
                    ? $validated['description']
                    : $brand->description,

                'status' => $validated['status'] ?? $brand->status,
            ]);
        } catch (\Throwable $e) {
            if ($newLogo && $newLogo !== $oldLogo) {
                Storage::disk('public')->delete($newLogo);
            }

            throw $e;
        }

        if ($oldLogo && $oldLogo !== $newLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully',
            'data' => $brand->fresh()->load('category'),
        ]);
    }

    // DELETE: Brand
    public function destroy(Request $request, $id)
    {
        $brand = Brand::where(
            'branch_code',
            $request->user()->branch_code
        )->findOrFail($id);

        $logoPath = $brand->brand_logo;

        $brand->delete();

        if ($logoPath) {
            Storage::disk('public')->delete($logoPath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully',
        ]);
    }
}
