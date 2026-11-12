
"use client";

import React from "react";
import {
  X,
  ShoppingBag,
  CalendarDays,
  FileText,
  User,
  CreditCard,
  Package,
} from "lucide-react";

import type { Purchase } from "../page";

interface PurchaseViewModalProps {
  open: boolean;
  purchase: Purchase | null;
  onClose: () => void;
}

export default function PurchaseViewModal({
  open,
  purchase,
  onClose,
}: PurchaseViewModalProps) {
  if (!open || !purchase) return null;

  const formatCurrency = (value?: number) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "partial":
      case "partially paid":
        return "bg-yellow-100 text-yellow-700";

      case "unpaid":
      case "pending":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const subtotal = Number(purchase.subtotal || 0);
  const discount = Number(purchase.discount || 0);
  const tax = Number(purchase.tax_amount || 0);
  const shipping = Number(purchase.shipping_charge || 0);
  const grandTotal = Number(purchase.grand_total || 0);
  const paid = Number(purchase.paid_amount || 0);
  const due = Number(purchase.due_amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">

      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-5 py-4">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Purchase Details
              </h2>

              <p className="text-xs text-gray-500">
                {purchase.purchase_number ||
                  purchase.unique_id ||
                  `PUR-${purchase.id}`}
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

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">

          {/* Purchase Information */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
              <FileText size={17} className="text-amber-600" />
              Purchase Information
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-xs text-gray-500">Purchase Number</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {purchase.purchase_number ||
                    purchase.unique_id ||
                    `PUR-${purchase.id}`}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Purchase Date</p>
                <p className="mt-1 flex items-center gap-2 font-medium text-gray-800">
                  <CalendarDays size={15} className="text-amber-600" />
                  {formatDate(purchase.purchase_date)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Invoice Number</p>
                <p className="mt-1 font-medium text-gray-800">
                  {purchase.invoice_number || "-"}
                </p>
              </div>

            </div>
          </section>

          {/* Vendor Information */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
              <User size={17} className="text-amber-600" />
              Vendor Information
            </h3>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <p className="text-xs text-gray-500">Vendor Name</p>

              <p className="mt-1 font-semibold text-gray-800">
                {purchase.vendor_name ||
                  (purchase as any).vendor?.vendor_name ||
                  (purchase as any).vendor?.name ||
                  "-"}
              </p>

            </div>
          </section>

          {/* Product Details */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Package size={17} className="text-amber-600" />
              Purchased Products
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[650px] text-left text-sm">

                <thead className="bg-amber-50 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Tax</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {purchase.items?.length ? (
                    purchase.items.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="px-4 py-3 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.product_name || "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-500">
                          {item.sku || "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.quantity} {item.unit_name || ""}
                        </td>

                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {formatCurrency(item.purchase_price)}
                        </td>

                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {formatCurrency(item.discount)}
                        </td>

                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {formatCurrency(item.tax_amount)}
                        </td>

                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                          {formatCurrency(item.total_amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No product details available.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </section>

          {/* Payment Summary */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
              <CreditCard size={17} className="text-amber-600" />
              Payment Summary
            </h3>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">

              <div className="ml-auto max-w-sm space-y-3 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charge</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>

                <div className="border-t border-amber-200 pt-3">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-medium text-green-700">
                  <span>Paid Amount</span>
                  <span>{formatCurrency(paid)}</span>
                </div>

                <div className="flex justify-between font-medium text-red-600">
                  <span>Due Amount</span>
                  <span>{formatCurrency(due)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-amber-200 pt-3">
                  <span className="font-medium text-gray-600">
                    Payment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                      purchase.payment_status
                    )}`}
                  >
                    {purchase.payment_status || "Pending"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Payment Type</span>
                  <span className="font-medium text-gray-800">
                    {purchase.payment_type || "-"}
                  </span>
                </div>

              </div>
            </div>
          </section>

          {/* Notes */}
          {purchase.notes && (
            <section>
              <h3 className="mb-2 text-sm font-bold text-gray-800">
                Notes
              </h3>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                {purchase.notes}
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
