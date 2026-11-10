
"use client";

import { Plus, Search, Download, Truck } from "lucide-react";

interface VendorHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onExport: () => void;
}

export default function VendorHeader({
  search,
  setSearch,
  onAdd,
  onExport,
}: VendorHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm text-gray-500">
            Inventory / Vendor Master
          </p>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <Truck className="h-7 w-7 text-orange-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Vendor Master
              </h1>
              <p className="text-sm text-gray-500">
                Manage your bakery suppliers
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download size={18} />
            Export
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Plus size={19} />
            Add New Vendor
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendor, code, mobile, GST..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>
    </div>
  );
}
