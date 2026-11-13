
"use client";

import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  Package,
} from "lucide-react";

// ==========================================
// PURCHASE INTERFACE
// ==========================================

export interface Purchase {
  id: number;
  unique_id: string;
  vendor_id: number;

  vendor?: {
    id: number;
    vendor_name?: string;
    name?: string;
  };

  invoice_number: string;
  purchase_date: string;

  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;

  paid_amount: number;
  due_amount: number;

  payment_status: string;
  status: string;
}

// ==========================================
// PROPS INTERFACE
// ==========================================

interface PurchaseTableProps {
  purchases: Purchase[];
  loading: boolean;

  vendors?: {
    id: number;
    name?: string;
    vendor_name?: string;
  }[];

  onView: (purchase: Purchase) => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
}

// ==========================================
// CURRENCY FORMAT
// ==========================================

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ==========================================
// DATE FORMAT
// ==========================================

const formatDate = (date: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// PAYMENT STATUS STYLE
// ==========================================

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";

    case "partial":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "unpaid":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

// ==========================================
// PURCHASE TABLE COMPONENT
// ==========================================

export default function PurchaseTable({
  purchases,
  loading,
  vendors = [],
  onView,
  onEdit,
  onDelete,
}: PurchaseTableProps) {

  // ==========================================
  // GET VENDOR NAME
  // ==========================================

  const getVendorName = (purchase: Purchase) => {
    return (
      purchase.vendor?.vendor_name ||
      purchase.vendor?.name ||
      vendors.find(
        (vendor) => Number(vendor.id) === Number(purchase.vendor_id)
      )?.vendor_name ||
      vendors.find(
        (vendor) => Number(vendor.id) === Number(purchase.vendor_id)
      )?.name ||
      "-"
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* TABLE HEADER */}

      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-base font-bold text-gray-900">
            Purchase Records
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            View and manage all purchase transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          <Package size={17} />

          {purchases.length} Purchases
        </div>

      </div>

      {/* RESPONSIVE TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1050px] text-left text-sm">

          {/* TABLE HEAD */}

          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">

            <tr>
              <th className="px-5 py-4 font-semibold">
                S.No
              </th>

              <th className="px-5 py-4 font-semibold">
                Purchase ID
              </th>

              <th className="px-5 py-4 font-semibold">
                Invoice No.
              </th>

              <th className="px-5 py-4 font-semibold">
                Vendor
              </th>

              <th className="px-5 py-4 font-semibold">
                Date
              </th>

              <th className="px-5 py-4 font-semibold">
                Grand Total
              </th>

              <th className="px-5 py-4 font-semibold">
                Paid
              </th>

              <th className="px-5 py-4 font-semibold">
                Due
              </th>

              <th className="px-5 py-4 font-semibold">
                Payment Status
              </th>

              <th className="px-5 py-4 text-center font-semibold">
                Actions
              </th>
            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody className="divide-y divide-gray-100">

            {/* LOADING */}

            {loading && (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-16 text-center text-gray-500"
                >

                  <div className="flex flex-col items-center gap-3">

                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />

                    <span>
                      Loading purchases...
                    </span>

                  </div>

                </td>
              </tr>
            )}

            {/* EMPTY */}

            {!loading && purchases.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-16 text-center"
                >

                  <div className="flex flex-col items-center">

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <FileText size={26} />
                    </div>

                    <h3 className="font-semibold text-gray-700">
                      No Purchases Found
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Purchase records will appear here.
                    </p>

                  </div>

                </td>
              </tr>
            )}

            {/* PURCHASE ROWS */}

            {!loading &&
              purchases.map((purchase, index) => (

                <tr
                  key={purchase.id}
                  className="transition hover:bg-amber-50/30"
                >

                  {/* S.NO */}

                  <td className="px-5 py-4 text-gray-500">
                    {index + 1}
                  </td>

                  {/* PURCHASE ID */}

                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800">
                      {purchase.unique_id || `PUR-${purchase.id}`}
                    </span>
                  </td>

                  {/* INVOICE NUMBER */}

                  <td className="px-5 py-4 font-medium text-gray-700">
                    {purchase.invoice_number || "-"}
                  </td>

                  {/* VENDOR */}

                  <td className="px-5 py-4 text-gray-600">
                    {getVendorName(purchase)}
                  </td>

                  {/* DATE */}

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {formatDate(purchase.purchase_date)}
                  </td>

                  {/* GRAND TOTAL */}

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {money(purchase.grand_total)}
                  </td>

                  {/* PAID */}

                  <td className="px-5 py-4 font-medium text-green-600">
                    {money(purchase.paid_amount)}
                  </td>

                  {/* DUE */}

                  <td className="px-5 py-4 font-medium text-red-600">
                    {money(purchase.due_amount)}
                  </td>

                  {/* PAYMENT STATUS */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        purchase.payment_status
                      )}`}
                    >
                      {purchase.payment_status || "Unpaid"}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex items-center justify-center gap-1">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() => onView(purchase)}
                        title="View Purchase"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Eye size={17} />
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() => onEdit(purchase)}
                        title="Edit Purchase"
                        className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => onDelete(purchase)}
                        title="Delete Purchase"
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}

      <div className="flex flex-col justify-between gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center">

        <p>
          Showing {purchases.length} purchase records
        </p>

        <p>
          Purchase Management
        </p>

      </div>

    </div>
  );
}
