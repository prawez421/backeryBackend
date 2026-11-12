<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Brand;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    // =========================================
    // GET ALL PRODUCTS
    // =========================================

    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;
        $categoryId = $request->get('category_id');

        // Products list
        $products = Product::where('branch_code', $branchCode)
            ->with(['category', 'subCategory', 'brand', 'unit'])
            ->latest()
            ->paginate(
                max(1, min((int) $request->get('per_page', 10), 1000))
            );

        // Filter existing product images
        $products->getCollection()->transform(function ($product) {

            $images = $product->product_images ?? [];

            if (!is_array($images)) {
                $images = [];
            }

            $validImages = array_values(array_filter(
                $images,
                function ($image) {
                    return is_string($image)
                        && $image !== ''
                        && Storage::disk('public')->exists($image);
                }
            ));

            $mainImage = $product->product_image;

            // Check main image
            if (
                !$mainImage ||
                !Storage::disk('public')->exists($mainImage)
            ) {
                $mainImage = $validImages[0] ?? null;
            }

            // Add main image to gallery if missing
            if (
                $mainImage &&
                !in_array($mainImage, $validImages, true)
            ) {
                array_unshift($validImages, $mainImage);
            }

            $product->product_image = $mainImage;
            $product->product_images = $validImages;

            return $product;
        });

        // Branch-wise active categories
        $categories = Category::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->get();

        // Branch-wise active subcategories
        $subCategoriesQuery = SubCategory::where('branch_code', $branchCode)
            ->where('status', 'Active');

        if ($categoryId) {
            $subCategoriesQuery->where('category_id', $categoryId);
        }

        $subCategories = $subCategoriesQuery->get();

        // Category-wise active brands
        $brands = [];

        if ($categoryId) {
            $brands = Brand::where('branch_code', $branchCode)
                ->where('status', 'Active')
                ->where('category_id', $categoryId)
                ->get();
        }

        // Branch-wise active units
        $units = Unit::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',

            'data' => $products,

            'masters' => [
                'categories' => $categories,
                'sub_categories' => $subCategories,
                'brands' => $brands,
                'units' => $units,
            ],
        ]);
    }


    // =========================================
    // STORE PRODUCT
    // =========================================

    public function store(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $validated = $request->validate([

            'product_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('products', 'product_name')
                    ->where('branch_code', $branchCode),
            ],

            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('branch_code', $branchCode),
            ],

            'sub_category_id' => [
                'required',
                Rule::exists('sub_categories', 'id')
                    ->where('branch_code', $branchCode),
            ],

            'brand_id' => [
                'required',
                Rule::exists('brands', 'id')
                    ->where('branch_code', $branchCode),
            ],

            'unit_id' => [
                'required',
                Rule::exists('units', 'id')
                    ->where('branch_code', $branchCode),
            ],

            'product_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'product_images' => 'nullable|array',

            'product_images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'description' => 'nullable|string',

            'status' => 'nullable|in:Active,Inactive',
        ]);

        // Check subcategory belongs to selected category
        $subCategoryExists = SubCategory::where('id', $validated['sub_category_id'])
            ->where('branch_code', $branchCode)
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (!$subCategoryExists) {
            return response()->json([
                'success' => false,
                'message' => 'Selected sub category does not belong to this category.',
            ], 422);
        }

        // Check brand belongs to selected category
        $brandExists = Brand::where('id', $validated['brand_id'])
            ->where('branch_code', $branchCode)
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (!$brandExists) {
            return response()->json([
                'success' => false,
                'message' => 'Selected brand does not belong to this category.',
            ], 422);
        }

        // Create product
        $product = DB::transaction(function () use (
            $request,
            $validated,
            $branchCode
        ) {

            $data = [
                'unique_id' => 'TEMP-' . Str::uuid(),
                'branch_code' => $branchCode,
                'product_name' => $validated['product_name'],
                'category_id' => $validated['category_id'],
                'sub_category_id' => $validated['sub_category_id'],
                'brand_id' => $validated['brand_id'],
                'unit_id' => $validated['unit_id'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'] ?? 'Active',
            ];

            $images = [];

            // Multiple images upload
            if ($request->hasFile('product_images')) {

                foreach ($request->file('product_images') as $image) {
                    $images[] = $image->store('products', 'public');
                }

                $data['product_image'] = $images[0] ?? null;
                $data['product_images'] = $images;
            }

            // Single image upload
            elseif ($request->hasFile('product_image')) {

                $mainImage = $request->file('product_image')
                    ->store('products', 'public');

                $data['product_image'] = $mainImage;
                $data['product_images'] = [$mainImage];
            }

            $product = Product::create($data);

            // Generate Product ID
            $product->unique_id = 'PRD-' . str_pad(
                $product->id,
                4,
                '0',
                STR_PAD_LEFT
            );

            $product->save();

            return $product;
        });

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load([
                'category',
                'subCategory',
                'brand',
                'unit',
            ]),
        ], 201);
    }


    // =========================================
    // SHOW SINGLE PRODUCT
    // =========================================

    public function show(Request $request, $id)
    {
        $product = Product::where(
            'branch_code',
            $request->user()->branch_code
        )
            ->with(['category', 'subCategory', 'brand', 'unit'])
            ->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product details fetched successfully',
            'data' => $product,
        ]);
    }


    // =========================================
    // UPDATE PRODUCT
    // =========================================

public function update(Request $request, $id)
{
    $branchCode = $request->user()->branch_code;

    // =====================================
    // FIND PRODUCT
    // =====================================

    $product = Product::where('branch_code', $branchCode)
        ->find($id);

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Product not found',
        ], 404);
    }

    // =====================================
    // VALIDATION
    // =====================================

    $validated = $request->validate([

        'product_name' => [
            'sometimes',
            'required',
            'string',
            'max:150',
            Rule::unique('products', 'product_name')
                ->where('branch_code', $branchCode)
                ->ignore($product->id),
        ],

        'category_id' => [
            'sometimes',
            'required',
            Rule::exists('categories', 'id')
                ->where('branch_code', $branchCode),
        ],

        'sub_category_id' => [
            'sometimes',
            'required',
            Rule::exists('sub_categories', 'id')
                ->where('branch_code', $branchCode),
        ],

        'brand_id' => [
            'sometimes',
            'required',
            Rule::exists('brands', 'id')
                ->where('branch_code', $branchCode),
        ],

        'unit_id' => [
            'sometimes',
            'required',
            Rule::exists('units', 'id')
                ->where('branch_code', $branchCode),
        ],

        'product_image' => [
            'nullable',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:2048',
        ],

        'product_images' => 'nullable|array',

        'product_images.*' => [
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:2048',
        ],

        'remove_product_images' => 'nullable|array',

        'remove_product_images.*' => [
            'required',
            'string',
        ],

        'description' => 'nullable|string',

        'status' => 'sometimes|in:Active,Inactive',
    ]);

    // =====================================
    // CATEGORY RELATIONSHIP VALIDATION
    // =====================================

    $categoryId = $validated['category_id']
        ?? $product->category_id;

    $subCategoryId = $validated['sub_category_id']
        ?? $product->sub_category_id;

    $brandId = $validated['brand_id']
        ?? $product->brand_id;

    // Check subcategory belongs to category
    $subCategoryExists = SubCategory::where('id', $subCategoryId)
        ->where('branch_code', $branchCode)
        ->where('category_id', $categoryId)
        ->exists();

    if (!$subCategoryExists) {
        return response()->json([
            'success' => false,
            'message' => 'Selected sub category does not belong to this category.',
        ], 422);
    }

    // Check brand belongs to category
    $brandExists = Brand::where('id', $brandId)
        ->where('branch_code', $branchCode)
        ->where('category_id', $categoryId)
        ->exists();

    if (!$brandExists) {
        return response()->json([
            'success' => false,
            'message' => 'Selected brand does not belong to this category.',
        ], 422);
    }

    // =====================================
    // EXISTING IMAGES
    // =====================================

    $oldSingleImage = $product->product_image;

    $oldMultipleImages = $product->product_images ?? [];

    if (!is_array($oldMultipleImages)) {
        $oldMultipleImages = [];
    }

    // Add main image to gallery if missing
    if (
        $oldSingleImage &&
        !in_array($oldSingleImage, $oldMultipleImages, true)
    ) {
        array_unshift($oldMultipleImages, $oldSingleImage);
    }

    // =====================================
    // REMOVE SELECTED IMAGES
    // =====================================

    $removedImages = $validated['remove_product_images'] ?? [];

    // Only allow removal of images belonging to this product
    $removedImages = array_values(array_intersect(
        $oldMultipleImages,
        $removedImages
    ));

    $remainingImages = array_values(array_diff(
        $oldMultipleImages,
        $removedImages
    ));

    // =====================================
    // NORMAL PRODUCT DATA
    // =====================================

    $data = collect($validated)->except([
        'product_image',
        'product_images',
        'remove_product_images',
    ])->toArray();

    // =====================================
    // UPLOAD NEW MULTIPLE IMAGES
    // =====================================

    $newImages = [];

    if ($request->hasFile('product_images')) {

        foreach ($request->file('product_images') as $image) {

            $newImages[] = $image->store('products', 'public');
        }
    }

    // =====================================
    // UPLOAD SINGLE IMAGE (IF PROVIDED)
    // =====================================

    $newSingleImage = null;

    if ($request->hasFile('product_image')) {

        $newSingleImage = $request->file('product_image')
            ->store('products', 'public');

        array_unshift($newImages, $newSingleImage);
    }

    // =====================================
    // COMBINE OLD + NEW IMAGES
    // =====================================

    $hasImageChanges =
        $request->hasFile('product_images') ||
        $request->hasFile('product_image') ||
        !empty($removedImages);

    if ($hasImageChanges) {

        $allImages = array_values(array_unique(
            array_merge($remainingImages, $newImages)
        ));

        // First available image becomes main image
        $data['product_image'] = $allImages[0] ?? null;

        // Save complete gallery
        $data['product_images'] = $allImages;
    }

    // =====================================
    // UPDATE PRODUCT
    // =====================================

    $product->update($data);

    // =====================================
    // DELETE REMOVED IMAGE FILES
    // =====================================

    foreach ($removedImages as $image) {

        // Do not delete a file still referenced by another product
        $usedElsewhere = Product::where('id', '!=', $product->id)
            ->where(function ($query) use ($image) {
                $query->where('product_image', $image)
                    ->orWhereJsonContains('product_images', $image);
            })
            ->exists();

        if (!$usedElsewhere) {
            Storage::disk('public')->delete($image);
        }
    }

    // =====================================
    // RESPONSE
    // =====================================

    return response()->json([
        'success' => true,
        'message' => 'Product updated successfully',

        'data' => $product->fresh()->load([
            'category',
            'subCategory',
            'brand',
            'unit',
        ]),
    ]);
}



    // =========================================
    // DELETE PRODUCT
    // =========================================

    public function destroy(Request $request, $id)
    {
        $product = Product::where(
            'branch_code',
            $request->user()->branch_code
        )->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $images = $product->product_images ?? [];

        if (!is_array($images)) {
            $images = [];
        }

        // Include main image
        if (
            $product->product_image &&
            !in_array($product->product_image, $images, true)
        ) {
            $images[] = $product->product_image;
        }

        // Delete all unique product images
        foreach (array_unique($images) as $image) {

            if (is_string($image) && $image !== '') {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
