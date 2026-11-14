<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PurchaseController extends Controller
{
    // =========================================
    // COMMON PRODUCT RELATIONSHIPS
    // =========================================

    private function productRelations($branchCode): array
    {
        return [
            'category.attributes' => function ($query) use ($branchCode) {
                $query->where('branch_code', $branchCode)
                    ->where('status', 'Active');
            },

            'category.attributes.values',
            'subCategory',
            'brand',
            'unit',
        ];
    }

    // =========================================
    // PURCHASE LIST
    // =========================================

    public function index(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $query = Purchase::query()
            ->with([
                'vendor:id,vendor_name',

                'items.product' => function ($productQuery) use ($branchCode) {
                    $productQuery->with(
                        $this->productRelations($branchCode)
                    );
                },
            ])
            ->where('branch_code', $branchCode);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('unique_id', 'like', "%{$search}%")
                    ->orWhere('invoice_number', 'like', "%{$search}%")

                    ->orWhereHas('vendor', function ($vendorQuery) use ($search) {
                        $vendorQuery->where(
                            'vendor_name',
                            'like',
                            "%{$search}%"
                        );
                    })

                    ->orWhereHas('items.product', function ($productQuery) use ($search) {
                        $productQuery->where(
                            'product_name',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $purchases = $query
            ->latest()
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Purchases fetched successfully.',
            'data' => $purchases,
        ]);
    }

    // =========================================
    // ACTIVE VENDORS
    // =========================================

    public function vendors()
    {
        $branchCode = auth()->user()->branch_code;

        $vendors = Vendor::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->select('id', 'vendor_name')
            ->orderBy('vendor_name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Active vendors fetched successfully.',
            'data' => $vendors,
        ]);
    }

    // =========================================
    // ACTIVE PRODUCTS WITH COMPLETE DETAILS
    // =========================================

    public function products(Request $request)
    {
        $branchCode = $request->user()->branch_code;

        $products = Product::where('branch_code', $branchCode)
            ->where('status', 'Active')
            ->with($this->productRelations($branchCode))
            ->orderBy('product_name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Active products fetched successfully.',
            'data' => $products,
        ]);
    }

// publice api website 
 
// =========================================
// PUBLIC WEBSITE MENU PRODUCTS
// =========================================
public function menuproducts(Request $request)
{
   $products = Product::query()
    ->where('status', 'Active')
    ->with([
        'category',
        'subCategory',
        'brand',
        'unit',
        'purchaseItems' => function ($query) {
            $query->orderByDesc('id');
        },
        'purchaseItems.purchase',
    ])
    ->orderBy('product_name', 'asc')
    ->get();

    return response()->json([
        'success' => true,
        'message' => 'Menu products fetched successfully.',
        'data' => $products,
    ], 200);
}

    // =========================================
    // STORE PURCHASE
    // =========================================
public function store(Request $request)
{
    $branchCode = $request->user()->branch_code;

    $validated = $request->validate([

        'vendor_id' => [
            'required',
            Rule::exists('vendors', 'id')
                ->where('branch_code', $branchCode),
        ],

        'invoice_number' => [
            'required',
            'string',
            'max:100',
            Rule::unique('purchases', 'invoice_number')
                ->where('branch_code', $branchCode),
        ],

        'purchase_date' => ['required', 'date'],

        'discount' => ['nullable', 'numeric', 'min:0'],
        'tax' => ['nullable', 'numeric', 'min:0'],
        'paid_amount' => ['nullable', 'numeric', 'min:0'],
        'status' => ['nullable', 'string', 'max:50'],
        'remarks' => ['nullable', 'string'],

        'items' => ['required', 'array', 'min:1'],

        'items.*.product_id' => [
            'required',
            'integer',
            Rule::exists('products', 'id')
                ->where('branch_code', $branchCode)
                ->where('status', 'Active'),
        ],

        // Selected Attributes: Name => Value
        'items.*.selected_attributes' => ['nullable', 'array'],

        'items.*.selected_attributes.*' => [
            'nullable',
            'string',
            'max:255',
        ],

        'items.*.quantity' => ['required', 'numeric', 'gt:0'],
        'items.*.purchase_price' => ['required', 'numeric', 'min:0'],
        'items.*.mrp' => ['nullable', 'numeric', 'min:0'],
        'items.*.selling_price' => ['nullable', 'numeric', 'min:0'],
        'items.*.discount' => ['nullable', 'numeric', 'min:0'],
        'items.*.tax' => ['nullable', 'numeric', 'min:0'],
    ]);

    return DB::transaction(function () use ($validated, $branchCode) {

        $subtotal = 0;
        $itemDiscount = 0;
        $itemTax = 0;

        // Calculate Purchase Amount
        foreach ($validated['items'] as $item) {

            $baseAmount =
                $item['quantity'] * $item['purchase_price'];

            $subtotal += $baseAmount;
            $itemDiscount += $item['discount'] ?? 0;
            $itemTax += $item['tax'] ?? 0;
        }

        $discount = $itemDiscount + ($validated['discount'] ?? 0);
        $tax = $itemTax + ($validated['tax'] ?? 0);

        $grandTotal = max(0, $subtotal - $discount + $tax);

        $paidAmount = $validated['paid_amount'] ?? 0;

        if ($paidAmount > $grandTotal) {
            throw ValidationException::withMessages([
                'paid_amount' => [
                    'Paid amount cannot be greater than grand total.',
                ],
            ]);
        }

        $dueAmount = $grandTotal - $paidAmount;

        $paymentStatus = $paidAmount <= 0
            ? 'Unpaid'
            : ($dueAmount <= 0 ? 'Paid' : 'Partial');

        // Create Purchase
        $purchase = Purchase::create([

            'unique_id' => 'TEMP-' . Str::uuid(),

            'branch_code' => $branchCode,
            'vendor_id' => $validated['vendor_id'],
            'invoice_number' => $validated['invoice_number'],
            'purchase_date' => $validated['purchase_date'],

            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'grand_total' => $grandTotal,

            'paid_amount' => $paidAmount,
            'due_amount' => $dueAmount,
            'payment_status' => $paymentStatus,

            'status' => $validated['status'] ?? 'Received',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        // Generate Purchase ID
        $purchase->unique_id = 'PUR-' . str_pad(
            $purchase->id,
            4,
            '0',
            STR_PAD_LEFT
        );

        $purchase->save();

        // Save Purchase Items
        foreach ($validated['items'] as $item) {

            $baseAmount =
                $item['quantity'] * $item['purchase_price'];

            $lineDiscount = $item['discount'] ?? 0;
            $lineTax = $item['tax'] ?? 0;

            $totalAmount = max(
                0,
                $baseAmount - $lineDiscount + $lineTax
            );

            $purchase->items()->create([

                'product_id' => $item['product_id'],

                // Save Attribute Name and Value as JSON
                'selected_attributes' => $item['selected_attributes'] ?? [],

                'quantity' => $item['quantity'],

                'purchase_price' => $item['purchase_price'],
                'mrp' => $item['mrp'] ?? 0,
                'selling_price' => $item['selling_price'] ?? 0,

                'discount' => $lineDiscount,
                'tax' => $lineTax,
                'total_amount' => $totalAmount,
            ]);
        }

        // Return Complete Product Details
        $purchase->load([
            'vendor',
            'items.product' => function ($productQuery) use ($branchCode) {
                $productQuery->with(
                    $this->productRelations($branchCode)
                );
            },
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Purchase created successfully.',
            'data' => $purchase,
        ], 201);
    });
}



    // =========================================
    // SINGLE PURCHASE DETAILS
    // =========================================

    public function show(Request $request, $id)
    {
        $branchCode = $request->user()->branch_code;

        $purchase = Purchase::where('branch_code', $branchCode)
            ->with([
                'vendor',

                'items.product' => function ($productQuery) use ($branchCode) {
                    $productQuery->with(
                        $this->productRelations($branchCode)
                    );
                },
            ])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Purchase details fetched successfully.',
            'data' => $purchase,
        ]);
    }

    // =========================================
    // UPDATE PURCHASE
    // =========================================

   


public function update(Request $request, $id)
{
    $branchCode = $request->user()->branch_code;

    $purchase = Purchase::where('branch_code', $branchCode)
        ->findOrFail($id);

    $validated = $request->validate([

        'vendor_id' => [
            'required',
            Rule::exists('vendors', 'id')
                ->where('branch_code', $branchCode),
        ],

        'invoice_number' => [
            'required',
            'string',
            'max:100',
            Rule::unique('purchases', 'invoice_number')
                ->where('branch_code', $branchCode)
                ->ignore($purchase->id),
        ],

        'purchase_date' => ['required', 'date'],

        'discount' => ['nullable', 'numeric', 'min:0'],
        'tax' => ['nullable', 'numeric', 'min:0'],
        'paid_amount' => ['nullable', 'numeric', 'min:0'],
        'status' => ['nullable', 'string', 'max:50'],
        'remarks' => ['nullable', 'string'],

        'items' => ['required', 'array', 'min:1'],

        'items.*.product_id' => [
            'required',
            'integer',

            function ($attribute, $value, $fail) use (
                $branchCode,
                $purchase
            ) {
                $activeProduct = Product::where('id', $value)
                    ->where('branch_code', $branchCode)
                    ->where('status', 'Active')
                    ->exists();

                $existingProduct = $purchase->items()
                    ->where('product_id', $value)
                    ->exists();

                if (!$activeProduct && !$existingProduct) {
                    $fail(
                        'Selected product is inactive or does not belong to this branch.'
                    );
                }
            },
        ],

        // Selected Attributes: Attribute Name => Attribute Value
        'items.*.selected_attributes' => ['nullable', 'array'],

        'items.*.selected_attributes.*' => [
            'nullable',
            'string',
            'max:255',
        ],

        'items.*.quantity' => ['required', 'numeric', 'gt:0'],
        'items.*.purchase_price' => ['required', 'numeric', 'min:0'],
        'items.*.mrp' => ['nullable', 'numeric', 'min:0'],
        'items.*.selling_price' => ['nullable', 'numeric', 'min:0'],
        'items.*.discount' => ['nullable', 'numeric', 'min:0'],
        'items.*.tax' => ['nullable', 'numeric', 'min:0'],
    ]);

    return DB::transaction(function () use (
        $validated,
        $purchase,
        $branchCode
    ) {

        // Calculate totals
        $subtotal = 0;
        $itemDiscount = 0;
        $itemTax = 0;

        foreach ($validated['items'] as $item) {

            $baseAmount =
                $item['quantity'] * $item['purchase_price'];

            $subtotal += $baseAmount;
            $itemDiscount += $item['discount'] ?? 0;
            $itemTax += $item['tax'] ?? 0;
        }

        $discount = $itemDiscount + ($validated['discount'] ?? 0);
        $tax = $itemTax + ($validated['tax'] ?? 0);

        $grandTotal = max(0, $subtotal - $discount + $tax);

        $paidAmount = $validated['paid_amount'] ?? 0;

        if ($paidAmount > $grandTotal) {
            throw ValidationException::withMessages([
                'paid_amount' => [
                    'Paid amount cannot be greater than grand total.',
                ],
            ]);
        }

        $dueAmount = $grandTotal - $paidAmount;

        $paymentStatus = $paidAmount <= 0
            ? 'Unpaid'
            : ($dueAmount <= 0 ? 'Paid' : 'Partial');

        // Update Purchase
        $purchase->update([

            'vendor_id' => $validated['vendor_id'],
            'invoice_number' => $validated['invoice_number'],
            'purchase_date' => $validated['purchase_date'],

            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'grand_total' => $grandTotal,

            'paid_amount' => $paidAmount,
            'due_amount' => $dueAmount,
            'payment_status' => $paymentStatus,

            'status' => $validated['status'] ?? 'Received',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        // Delete old items
        $purchase->items()->delete();

        // Create updated items
        foreach ($validated['items'] as $item) {

            $baseAmount =
                $item['quantity'] * $item['purchase_price'];

            $lineDiscount = $item['discount'] ?? 0;
            $lineTax = $item['tax'] ?? 0;

            $totalAmount = max(
                0,
                $baseAmount - $lineDiscount + $lineTax
            );

            $purchase->items()->create([

                'product_id' => $item['product_id'],

                // Save Attribute Name and Value as JSON
                'selected_attributes' => $item['selected_attributes'] ?? [],

                'quantity' => $item['quantity'],

                'purchase_price' => $item['purchase_price'],
                'mrp' => $item['mrp'] ?? 0,
                'selling_price' => $item['selling_price'] ?? 0,

                'discount' => $lineDiscount,
                'tax' => $lineTax,
                'total_amount' => $totalAmount,
            ]);
        }

        // Return updated purchase with complete product details
        $purchase->load([
            'vendor',

            'items.product' => function ($productQuery) use ($branchCode) {
                $productQuery->with(
                    $this->productRelations($branchCode)
                );
            },
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Purchase updated successfully.',
            'data' => $purchase,
        ]);
    });
}



    // =========================================
    // DELETE PURCHASE
    // =========================================

    public function destroy($id)
    {
        $purchase = Purchase::where(
            'branch_code',
            auth()->user()->branch_code
        )->findOrFail($id);

        $purchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase deleted successfully.',
        ]);
    }
}
