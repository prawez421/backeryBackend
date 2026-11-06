
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Package,
  Eye,
  Plus,
  ImageOff,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import { toast } from "sonner";

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  category_name: string;
  unit_name: string;
  selling_price: number;
  purchase_price: number;
  stock_quantity: number;
  status: "Active" | "Inactive";
  image_url: string | null;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/products");

      setProducts(response.data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Products load nahi ho paye"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category_name).filter(Boolean))
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    const matchesSearch =
      product.product_name?.toLowerCase().includes(value) ||
      product.product_code?.toLowerCase().includes(value) ||
      product.category_name?.toLowerCase().includes(value);

    const matchesCategory =
      categoryFilter === "All" ||
      product.category_name === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Product Master
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bakery products and product information
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            href="/inventory/products/create"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Products"
          value={products.length}
          color="blue"
        />

        <StatCard
          title="Active Products"
          value={activeProducts}
          color="green"
        />

        <StatCard
          title="Inactive Products"
          value={products.length - activeProducts}
          color="red"
        />
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search product name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT COUNT */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          All Products
        </h2>

        <span className="text-sm text-gray-500">
          {filteredProducts.length} Products
        </span>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="rounded-xl bg-white py-20 text-center text-gray-500">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border bg-white py-20 text-center text-gray-500">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/inventory/products/${product.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* IMAGE */}
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ImageOff size={40} className="text-gray-300" />
                )}

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {/* PRODUCT INFO */}
              <div className="p-4">
                <p className="text-xs font-medium text-orange-600">
                  {product.category_name || "Uncategorized"}
                </p>

                <h3 className="mt-1 text-lg font-bold text-gray-800">
                  {product.product_name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Code: {product.product_code}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Selling Price
                    </p>

                    <p className="text-xl font-bold text-orange-600">
                      ₹{Number(product.selling_price).toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Stock
                    </p>

                    <p className="font-semibold text-gray-800">
                      {product.stock_quantity} {product.unit_name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-orange-50 py-2.5 text-sm font-semibold text-orange-600 group-hover:bg-orange-500 group-hover:text-white">
                  <Eye size={16} />
                  View Product Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`mt-2 text-3xl font-bold ${colors[color].split(" ").pop()}`}>
        {value}
      </h2>
    </div>
  );
}
