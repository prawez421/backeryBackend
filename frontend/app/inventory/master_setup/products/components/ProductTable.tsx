
"use client";

import React from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  Image as ImageIcon,
} from "lucide-react";

export interface Product {
  id: number;
  product_name: string;
  category_id: number;
  sub_category_id: number;
  brand_id: number;
  unit_id: number;
  category_name: string;
  sub_category_name: string;
  brand_name: string;
  unit_name: string;
  product_image?: string | null;
  description: string;
  status: "Active" | "Inactive";
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  search: string;
  onSearch: (value: string) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  loading,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL || "";

  const getImageUrl = (image?: string | null) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${imageBaseUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* TABLE HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Product List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage all your products.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search product..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">

          <thead className="bg-amber-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-5 py-4 font-semibold">#</th>
              <th className="px-5 py-4 font-semibold">Image</th>
              <th className="px-5 py-4 font-semibold">Product Name</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Sub Category</th>
              <th className="px-5 py-4 font-semibold">Brand</th>
              <th className="px-5 py-4 font-semibold">Unit</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-12 text-center text-gray-500"
                >
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center">

                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-amber-50 p-4">
                      <Package
                        size={28}
                        className="text-amber-500"
                      />
                    </div>

                    <p className="font-semibold text-gray-700">
                      No Products Found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Add your first product to get started.
                    </p>
                  </div>

                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-amber-50/40"
                >
                  {/* NUMBER */}
                  <td className="px-5 py-4 text-gray-500">
                    {index + 1}
                  </td>

                  {/* PRODUCT IMAGE */}
                  <td className="px-5 py-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                      {product.product_image ? (
                        <img
                          src={getImageUrl(product.product_image)}
                          alt={product.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon
                          size={20}
                          className="text-gray-400"
                        />
                      )}

                    </div>
                  </td>

                  {/* PRODUCT NAME */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800">
                      {product.product_name}
                    </span>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4 text-gray-600">
                    {product.category_name || "-"}
                  </td>

                  {/* SUB CATEGORY */}
                  <td className="px-5 py-4 text-gray-600">
                    {product.sub_category_name || "-"}
                  </td>

                  {/* BRAND */}
                  <td className="px-5 py-4 text-gray-600">
                    {product.brand_name || "-"}
                  </td>

                  {/* UNIT */}
                  <td className="px-5 py-4 text-gray-600">
                    {product.unit_name || "-"}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <button
                        type="button"
                        onClick={() => onView(product)}
                        title="View Product"
                        className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        title="Delete Product"
                        className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      {!loading && (
        <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
          Showing {products.length} product(s)
        </div>
      )}

    </div>
  );
}
