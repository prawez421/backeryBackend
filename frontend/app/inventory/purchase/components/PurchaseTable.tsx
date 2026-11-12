
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, ShoppingCart, Save } from "lucide-react";
import type {
  Purchase,
  PurchaseProduct,
  SelectOption,
  PurchaseItemForm,
} from "../page";

interface PurchaseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  vendors: SelectOption[];
  products: PurchaseProduct[];
  saving: boolean;
  initialData?: Purchase | null;
}

const createEmptyItem = (): PurchaseItemForm => ({
  rowId: Date.now() + Math.random(),
  product_id: "",
  quantity: "1",
  purchase_price: "0",
  discount: "0",
  tax_amount: "0",
});

export default function PurchaseFormModal({
  open,
  onClose,
  onSubmit,
  vendors,
  products,
  saving,
  initialData,
}: PurchaseFormModalProps) {
  const [vendorId, setVendorId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [shippingCharge, setShippingCharge] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseItemForm[]>([
    createEmptyItem(),
  ]);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setVendorId(
        String(
          (initialData as any).vendor_id ||
          (initialData as any).vendor?.id ||
          ""
        )
      );

      setPurchaseDate(
        initialData.purchase_date ||
        new Date().toISOString().split("T")[0]
      );

      setInvoiceNumber(initialData.invoice_number || "");
      setPaymentType(initialData.payment_type || "Cash");
      setShippingCharge(String(initialData.shipping_charge || 0));
      setPaidAmount(String(initialData.paid_amount || 0));
      setNotes(initialData.notes || "");

      setItems(
        initialData.items?.length
          ? initialData.items.map((item) => ({
              rowId: Date.now() + Math.random(),
              product_id: String(item.product_id),
              quantity: String(item.quantity),
              purchase_price: String(item.purchase_price),
              discount: String(item.discount || 0),
              tax_amount: String(item.tax_amount || 0),
            }))
          : [createEmptyItem()]
      );
    } else {
      setVendorId("");
      setPurchaseDate(new Date().toISOString().split("T")[0]);
      setInvoiceNumber("");
      setPaymentType("Cash");
      setShippingCharge("0");
      setPaidAmount("0");
      setNotes("");
      setItems([createEmptyItem()]);
    }
  }, [open, initialData]);

  const updateItem = (
    rowId: number,
    field: keyof PurchaseItemForm,
    value: string
  ) => {
    setItems((previous) =>
      previous.map((item) =>
        item.rowId === rowId ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((previous) => [...previous, createEmptyItem()]);
  };

  const removeItem = (rowId: number) => {
    setItems((previous) =>
      previous.length > 1
        ? previous.filter((item) => item.rowId !== rowId)
        : previous
    );
  };

  const handleProductChange = (rowId: number, productId: string) => {
    const selectedProduct = products.find(
      (product) => String(product.id) === productId
    );

    setItems((previous) =>
      previous.map((item) =>
        item.rowId === rowId
          ? {
              ...item,
              product_id: productId,
              purchase_price: String(selectedProduct?.purchase_price || 0),
            }
          : item
      )
    );
  };

  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.purchase_price) || 0;

      return sum + quantity * price;
    }, 0);

    const discount = items.reduce(
      (sum, item) => sum + (Number(item.discount) || 0),
      0
    );

    const taxAmount = items.reduce(
      (sum, item) => sum + (Number(item.tax_amount) || 0),
      0
    );

    const shipping = Number(shippingCharge) || 0;

    const grandTotal = Math.max(
      0,
      subtotal - discount + taxAmount + shipping
    );

    const paid = Math.min(
      Math.max(0, Number(paidAmount) || 0),
      grandTotal
    );

    const due = Math.max(0, grandTotal - paid);

    const paymentStatus =
      paid <= 0
        ? "Unpaid"
        : paid >= grandTotal
          ? "Paid"
          : "Partial";

    return {
      subtotal,
      discount,
      taxAmount,
      shipping,
      grandTotal,
      paid,
      due,
      paymentStatus,
    };
  }, [items, shippingCharge, paidAmount]);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Please select a vendor.");
      return;
    }

    const validItems = items.filter(
      (item) =>
        item.product_id &&
        Number(item.quantity) > 0 &&
        Number(item.purchase_price) >= 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one valid product.");
      return;
    }

    const productIds = validItems.map((item) => item.product_id);

    if (new Set(productIds).size !== productIds.length) {
      alert("Duplicate products are not allowed. Update the existing row.");
      return;
    }

    const payload = {
      vendor_id: Number(vendorId),
      purchase_date: purchaseDate,
      invoice_number: invoiceNumber,
      payment_type: paymentType,
      subtotal: calculations.subtotal,
      discount: calculations.discount,
      tax_amount: calculations.taxAmount,
      shipping_charge: calculations.shipping,
      grand_total: calculations.grandTotal,
      paid_amount: calculations.paid,
      due_amount: calculations.due,
      payment_status: calculations.paymentStatus,
      notes,
      items: validItems.map((item) => {
        const quantity = Number(item.quantity);
        const price = Number(item.purchase_price);
        const discount = Number(item.discount) || 0;
        const tax = Number(item.tax_amount) || 0;

        return {
          product_id: Number(item.product_id),
          quantity,
          purchase_price: price,
          discount,
          tax_amount: tax,
          total_amount: Math.max(
            0,
            quantity * price - discount + tax
          ),
        };
      }),
    };

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">

      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
              <ShoppingCart size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {initialData ? "Update Purchase" : "Create Purchase"}
              </h2>
              <p className="text-xs text-gray-500">
                Add vendor and purchase product details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-red-500"
          >
            <X size={21} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-5"
        >

          {/* Basic Information */}
          <section>
            <h3 className="mb-4 text-sm font-bold text-gray-800">
              Purchase Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Vendor <span className="text-red-500">*</span>
                </label>

                <select
                  required
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                >
                  <option value="">Select Vendor</option>

                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Purchase Date
                </label>

                <input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Invoice Number
                </label>

                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Enter invoice number"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>

            </div>
          </section>

          {/* Product Items */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Purchase Products
              </h3>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.purchase_price) || 0;
                const discount = Number(item.discount) || 0;
                const tax = Number(item.tax_amount) || 0;

                const total = Math.max(
                  0,
                  quantity * price - discount + tax
                );

                return (
                  <div
                    key={item.rowId}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">
                        Product #{index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.rowId)}
                        disabled={items.length === 1}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Remove Product"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Product
                        </label>

                        <select
                          required
                          value={item.product_id}
                          onChange={(e) =>
                            handleProductChange(
                              item.rowId,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        >
                          <option value="">Select Product</option>

                          {products.map((product) => (
                            <option
                              key={product.id}
                              value={product.id}
                            >
                              {product.product_name}
                              {product.sku ? ` (${product.sku})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.rowId,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Purchase Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={item.purchase_price}
                          onChange={(e) =>
                            updateItem(
                              item.rowId,
                              "purchase_price",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Discount (₹)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(
                              item.rowId,
                              "discount",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Tax (₹)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.tax_amount}
                          onChange={(e) =>
                            updateItem(
                              item.rowId,
                              "tax_amount",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Item Total
                        </label>

                        <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700">
                          {formatCurrency(total)}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Information */}
          <section>
            <h3 className="mb-4 text-sm font-bold text-gray-800">
              Payment Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Payment Type
                </label>

                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Shipping Charge (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Paid Amount (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  max={calculations.grandTotal}
                  step="0.01"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                />
              </div>

            </div>
          </section>

          {/* Notes */}
          <section>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter purchase notes..."
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400"
            />
          </section>

          {/* Total Summary */}
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="mb-4 font-bold text-gray-800">
              Purchase Summary
            </h3>

            <div className="ml-auto max-w-sm space-y-3 text-sm">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(calculations.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>- {formatCurrency(calculations.discount)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(calculations.taxAmount)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(calculations.shipping)}</span>
              </div>

              <div className="border-t border-amber-200 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>{formatCurrency(calculations.grandTotal)}</span>
                </div>
              </div>

              <div className="flex justify-between font-medium text-green-700">
                <span>Paid Amount</span>
                <span>{formatCurrency(calculations.paid)}</span>
              </div>

              <div className="flex justify-between font-medium text-red-600">
                <span>Due Amount</span>
                <span>{formatCurrency(calculations.due)}</span>
              </div>

              <div className="flex justify-between border-t border-amber-200 pt-3">
                <span className="font-medium text-gray-600">
                  Payment Status
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700">
                  {calculations.paymentStatus}
                </span>
              </div>

            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : initialData
                  ? "Update Purchase"
                  : "Save Purchase"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
