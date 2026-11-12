
"use client";

import React from "react";
import { Package, Plus, RefreshCw } from "lucide-react";

interface ProductHeaderProps {
  onAdd: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function ProductHeader({
  onAdd,
  onRefresh,
  loading = false,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Heading */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Product Master
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage products, categories, brands and product images.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          <Plus size={19} />
          Add Product
        </button>

      </div>
    </div>
  );
}
