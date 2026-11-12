<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PurchaseController extends Controller
{
    // Purchase List
    public function index(Request $request)
    {
        $branchCode = auth()->user()->branch_code;

        $query = Purchase::with([
            'vendor',
            'items.product'
        ])->where('branch_code', $branchCode);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('unique_id', 'like', "%{$search}%")
                    ->orWhere('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('vendor', function ($vendorQuery) use ($search) {
                        $vendorQuery->where('vendor_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $purchases = $query->latest()->paginate(
            $request->get('per_page', 10)
        );

        return response()->json([
            'success' => true,
            'message' => 'Purchases fetched successfully.',
            'data' => $purchases,
        ]);
    }

    // Store Purchase
    public function store(Request $request)
    {
        $branchCode = auth()->user()->branch_code;

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
                'exists:products,id',
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

            foreach ($validated['items'] as $item) {
                $baseAmount = $item['quantity'] * $item['purchase_price'];

                $subtotal += $baseAmount;
                $itemDiscount += $item['discount'] ?? 0;
                $itemTax += $item['tax'] ?? 0;
            }

            $discount = $itemDiscount + ($validated['discount'] ?? 0);
            $tax = $itemTax + ($validated['tax'] ?? 0);

            $grandTotal = max(0, $subtotal - $discount + $tax);

            $paidAmount = $validated['paid_amount'] ?? 0;

            if ($paidAmount > $grandTotal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paid amount cannot be greater than grand total.',
                ], 422);
            }

            $dueAmount = $grandTotal - $paidAmount;

            $paymentStatus = $paidAmount <= 0
                ? 'Unpaid'
                : ($dueAmount <= 0 ? 'Paid' : 'Partial');

            $purchase = Purchase::create([
                'unique_id' => 'PUR-' . strtoupper(Str::random(10)),
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

            foreach ($validated['items'] as $item) {
                $baseAmount = $item['quantity'] * $item['purchase_price'];

                $lineDiscount = $item['discount'] ?? 0;
                $lineTax = $item['tax'] ?? 0;

                $totalAmount = max(
                    0,
                    $baseAmount - $lineDiscount + $lineTax
                );

                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'mrp' => $item['mrp'] ?? 0,
                    'selling_price' => $item['selling_price'] ?? 0,
                    'discount' => $lineDiscount,
                    'tax' => $lineTax,
                    'total_amount' => $totalAmount,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Purchase created successfully.',
                'data' => $purchase->load('vendor', 'items.product'),
            ], 201);
        });
    }

    // Single Purchase Details
    public function show($id)
    {
        $purchase = Purchase::with([
            'vendor',
            'items.product'
        ])
            ->where('branch_code', auth()->user()->branch_code)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Purchase details fetched successfully.',
            'data' => $purchase,
        ]);
    }

    // Update Purchase
    public function update(Request $request, $id)
    {
        $branchCode = auth()->user()->branch_code;

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
                'exists:products,id',
            ],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.purchase_price' => ['required', 'numeric', 'min:0'],
            'items.*.mrp' => ['nullable', 'numeric', 'min:0'],
            'items.*.selling_price' => ['nullable', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax' => ['nullable', 'numeric', 'min:0'],
        ]);

        return DB::transaction(function () use ($validated, $purchase) {

            $subtotal = 0;
            $itemDiscount = 0;
            $itemTax = 0;

            foreach ($validated['items'] as $item) {
                $baseAmount = $item['quantity'] * $item['purchase_price'];

                $subtotal += $baseAmount;
                $itemDiscount += $item['discount'] ?? 0;
                $itemTax += $item['tax'] ?? 0;
            }

            $discount = $itemDiscount + ($validated['discount'] ?? 0);
            $tax = $itemTax + ($validated['tax'] ?? 0);

            $grandTotal = max(0, $subtotal - $discount + $tax);
            $paidAmount = $validated['paid_amount'] ?? 0;

            if ($paidAmount > $grandTotal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paid amount cannot be greater than grand total.',
                ], 422);
            }

            $dueAmount = $grandTotal - $paidAmount;

            $paymentStatus = $paidAmount <= 0
                ? 'Unpaid'
                : ($dueAmount <= 0 ? 'Paid' : 'Partial');

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

            // Replace old purchase items with updated items
            $purchase->items()->delete();

            foreach ($validated['items'] as $item) {
                $baseAmount = $item['quantity'] * $item['purchase_price'];

                $lineDiscount = $item['discount'] ?? 0;
                $lineTax = $item['tax'] ?? 0;

                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'mrp' => $item['mrp'] ?? 0,
                    'selling_price' => $item['selling_price'] ?? 0,
                    'discount' => $lineDiscount,
                    'tax' => $lineTax,
                    'total_amount' => max(
                        0,
                        $baseAmount - $lineDiscount + $lineTax
                    ),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Purchase updated successfully.',
                'data' => $purchase->load('vendor', 'items.product'),
            ]);
        });
    }

    // Delete Purchase
    public function destroy($id)
    {
        $purchase = Purchase::where('branch_code', auth()->user()->branch_code)
            ->findOrFail($id);

        $purchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase deleted successfully.',
        ]);
    }
}
