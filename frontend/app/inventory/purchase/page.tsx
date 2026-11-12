
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  ShoppingBag,
  RefreshCw,
  Search,
  IndianRupee,
  Wallet,
  Clock,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import  ProjectApiList  from "@/app/api/ProjectApiList";

import PurchaseTable from "./components/PurchaseTable";
import PurchaseFormModal from "./components/PurchaseFormModal";
import PurchaseViewModal from "./components/PurchaseViewModal";

// =====================================
// TYPES
// =====================================

export interface PurchaseItem {
  id?: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  unit_name?: string;
  quantity: number;
  purchase_price: number;
  discount: number;
  tax_amount: number;
  total_amount: number;
}

export interface Purchase {
  id: number;
  unique_id?: string;
  purchase_number?: string;
  invoice_number?: string;
  purchase_date?: string;
  vendor_id?: number;
  vendor_name?: string;
  vendor?: {
    id?: number;
    vendor_name?: string;
    name?: string;
  };
  subtotal?: number;
  discount?: number;
  tax_amount?: number;
  shipping_charge?: number;
  grand_total?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_status?: string;
  payment_type?: string;
  notes?: string;
  items?: PurchaseItem[];
}

export interface PurchaseItemForm {
  rowId: number;
  product_id: string;
  quantity: string;
  purchase_price: string;
  discount: string;
  tax_amount: string;
}

export interface PurchaseProduct {
  id: number;
  product_name: string;
  sku?: string;
  unit_name?: string;
  purchase_price?: number;
}

export interface SelectOption {
  id: number;
  name: string;
  [key: string]: any;
}

// =====================================
// RESPONSE HELPER
// =====================================

const getResponseList = (response: any): any[] => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;

  return [];
};

// =====================================
// MAIN COMPONENT
// =====================================

export default function PurchasePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  const [loading, setLoading] = useState(false);
  const [masterLoading, setMasterLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedPurchase, setSelectedPurchase] =
    useState<Purchase | null>(null);

  // =====================================
  // FETCH PURCHASES
  // =====================================

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.purchaseList
      );

      const list = getResponseList(response);

      const formattedPurchases: Purchase[] = list.map((item: any) => ({
        ...item,

        vendor_name:
          item.vendor?.vendor_name ||
          item.vendor?.name ||
          item.vendor_name ||
          "",

        subtotal: Number(item.subtotal || 0),
        discount: Number(item.discount || 0),
        tax_amount: Number(item.tax_amount || 0),
        shipping_charge: Number(item.shipping_charge || 0),
        grand_total: Number(item.grand_total || 0),
        paid_amount: Number(item.paid_amount || 0),
        due_amount: Number(item.due_amount || 0),

        items: (item.items || item.purchase_items || []).map(
          (product: any) => ({
            ...product,
            product_name:
              product.product?.product_name ||
              product.product?.name ||
              product.product_name ||
              "",
            sku: product.product?.sku || product.sku || "",
            unit_name:
              product.product?.unit?.unit_name ||
              product.unit_name ||
              "",
            quantity: Number(product.quantity || 0),
            purchase_price: Number(product.purchase_price || 0),
            discount: Number(product.discount || 0),
            tax_amount: Number(product.tax_amount || 0),
            total_amount: Number(product.total_amount || 0),
          })
        ),
      }));

      setPurchases(formattedPurchases);
    } catch (error: any) {
      console.error("Purchase fetch error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to load purchase records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // FETCH VENDORS AND PRODUCTS
  // =====================================

  const fetchMasterData = useCallback(async () => {
    try {
      setMasterLoading(true);

      const [vendorResponse, productResponse] = await Promise.all([
        axiosInstance.get(ProjectApiList.vendorList, {
          params: { per_page: 1000 },
        }),

        axiosInstance.get(ProjectApiList.productList, {
          params: { per_page: 1000 },
        }),
      ]);

      // Vendor data
      const vendorList = getResponseList(vendorResponse);

      setVendors(
        vendorList.map((vendor: any) => ({
          ...vendor,
          id: Number(vendor.id),
          name:
            vendor.vendor_name ||
            vendor.supplier_name ||
            vendor.name ||
            "",
        }))
      );

      // Product data
      const productList = getResponseList(productResponse);

      setProducts(
        productList.map((product: any) => ({
          id: Number(product.id),

          product_name:
            product.product_name ||
            product.name ||
            "",

          sku: product.sku || "",

          unit_name:
            product.unit?.unit_name ||
            product.unit_name ||
            "",

          purchase_price: Number(product.purchase_price || 0),
        }))
      );
    } catch (error: any) {
      console.error("Purchase master data error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to load vendors or products."
      );
    } finally {
      setMasterLoading(false);
    }
  }, []);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchPurchases();
    fetchMasterData();
  }, [fetchPurchases, fetchMasterData]);

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredPurchases = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return purchases;

    return purchases.filter((purchase) => {
      return (
        purchase.purchase_number?.toLowerCase().includes(keyword) ||
        purchase.unique_id?.toLowerCase().includes(keyword) ||
        purchase.invoice_number?.toLowerCase().includes(keyword) ||
        purchase.vendor_name?.toLowerCase().includes(keyword) ||
        purchase.payment_status?.toLowerCase().includes(keyword)
      );
    });
  }, [purchases, search]);

  // =====================================
  // PURCHASE STATISTICS
  // =====================================

  const stats = useMemo(() => {
    const totalPurchases = purchases.length;

    const totalAmount = purchases.reduce(
      (sum, item) => sum + Number(item.grand_total || 0),
      0
    );

    const totalPaid = purchases.reduce(
      (sum, item) => sum + Number(item.paid_amount || 0),
      0
    );

    const totalDue = purchases.reduce(
      (sum, item) => sum + Number(item.due_amount || 0),
      0
    );

    return {
      totalPurchases,
      totalAmount,
      totalPaid,
      totalDue,
    };
  }, [purchases]);

  // =====================================
  // CREATE PURCHASE
  // =====================================

  const handleCreatePurchase = async (payload: any) => {
    try {
      setSaving(true);

      await axiosInstance.post(
        ProjectApiList.purchaseCreate,
        payload
      );

      alert("Purchase created successfully!");

      setFormOpen(false);

      await fetchPurchases();
    } catch (error: any) {
      console.error("Purchase create error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create purchase."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // VIEW PURCHASE
  // =====================================

  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setViewOpen(true);
  };

  // =====================================
  // DELETE PURCHASE
  // =====================================

  const handleDeletePurchase = async (purchase: Purchase) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete purchase ${
        purchase.purchase_number ||
        purchase.unique_id ||
        `PUR-${purchase.id}`
      }?`
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(
        ProjectApiList.purchaseDelete(purchase.id)
      );

      alert("Purchase deleted successfully!");

      await fetchPurchases();
    } catch (error: any) {
      console.error("Purchase delete error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete purchase."
      );
    }
  };

  // =====================================
  // CURRENCY FORMAT
  // =====================================

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
              <ShoppingBag size={23} />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Purchase Management
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Manage vendor purchases, products and payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() => {
              fetchPurchases();
              fetchMasterData();
            }}
            disabled={loading || masterLoading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading || masterLoading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setFormOpen(true)}
            disabled={masterLoading}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus size={18} />
            Add Purchase
          </button>

        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Purchases
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {stats.totalPurchases}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <ShoppingBag size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Purchase Amount
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-800">
                {formatCurrency(stats.totalAmount)}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <IndianRupee size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Paid
              </p>

              <h2 className="mt-2 text-xl font-bold text-green-700">
                {formatCurrency(stats.totalPaid)}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Wallet size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Due
              </p>

              <h2 className="mt-2 text-xl font-bold text-red-600">
                {formatCurrency(stats.totalDue)}
              </h2>
            </div>

            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <Clock size={23} />
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search purchase, vendor or invoice..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* PURCHASE TABLE */}
      <PurchaseTable
        purchases={filteredPurchases}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onView={handleViewPurchase}
        onDelete={handleDeletePurchase}
      />

      {/* CREATE PURCHASE MODAL */}
      <PurchaseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreatePurchase}
        vendors={vendors}
        products={products}
        saving={saving}
      />

      {/* VIEW PURCHASE MODAL */}
      <PurchaseViewModal
        open={viewOpen}
        purchase={selectedPurchase}
        onClose={() => {
          setViewOpen(false);
          setSelectedPurchase(null);
        }}
      />

    </div>
  );
}
