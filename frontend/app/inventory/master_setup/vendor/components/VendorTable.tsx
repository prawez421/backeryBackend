
"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Building2,
  Users,
  UserCheck,
  UserX,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Vendor } from "./VendorModal";

interface VendorTableProps {
  vendors: Vendor[];
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  openingBalanceTotal: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  onView: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export default function VendorTable({
  vendors = [],
  totalVendors = 0,
  activeVendors = 0,
  inactiveVendors = 0,
  openingBalanceTotal = 0,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onView,
  onEdit,
  onDelete,
}: VendorTableProps) {

  const safeVendors = Array.isArray(vendors) ? vendors : [];

  const formatAmount = (amount: unknown) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const stats = [
    {
      title: "Total Vendors",
      value: totalVendors,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Vendors",
      value: activeVendors,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Vendors",
      value: inactiveVendors,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Opening Balance",
      value: `₹${formatAmount(openingBalanceTotal)}`,
      icon: Wallet,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  return (
    <div className="space-y-6">

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={24} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Vendor Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Vendor List
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage all your registered vendors
            </p>
          </div>

          <span className="w-fit rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
            Total: {totalItems} Vendors
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            <thead className="bg-gray-50">
              <tr>
                {[
                  "Vendor Details",
                  "Contact Details",
                  "Category",
                  "GST Number",
                  "Opening Balance",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {safeVendors.length > 0 ? (

                safeVendors.map((vendor) => {

                  const isActive =
                    String(vendor.status).toLowerCase() === "active";

                  return (
                    <tr
                      key={vendor.id}
                      className="transition hover:bg-orange-50/40"
                    >

                      {/* Vendor Details */}
                      <td className="px-5 py-4">

                        <p className="font-semibold text-gray-800">
                          {vendor.vendor_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-orange-600">
                          {vendor.vendor_code || "-"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <Building2 size={13} />
                          {vendor.company_name || "-"}
                        </p>

                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">

                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={14} className="text-gray-400" />
                          {vendor.mobile || "-"}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={14} className="text-gray-400" />
                          {vendor.email || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {vendor.contact_person || "-"}
                        </p>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                          {vendor.category || "-"}
                        </span>
                      </td>

                      {/* GST */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {vendor.gst_number || "-"}
                      </td>

                      {/* Opening Balance */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          ₹{formatAmount(vendor.opening_balance)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {vendor.status || "Inactive"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            title="View Vendor"
                            onClick={() => onView(vendor)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Edit Vendor"
                            onClick={() => onEdit(vendor)}
                            className="rounded-lg bg-orange-50 p-2 text-orange-600 hover:bg-orange-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            title="Delete Vendor"
                            onClick={() => onDelete(vendor)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">

                    <Building2
                      size={42}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-semibold text-gray-600">
                      No Vendors Found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      No vendor records available.
                    </p>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-4 border-t border-gray-100 p-4 sm:flex-row sm:items-center">

          <p className="text-sm text-gray-500">
            Showing {startItem}-{endItem} of {totalItems} vendors
          </p>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={itemsPerPage}
              onChange={(e) =>
                onItemsPerPageChange(Number(e.target.value))
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
            >
              {[10, 25, 50, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit} Rows
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 text-sm font-semibold text-orange-600">
                {currentPage} / {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
