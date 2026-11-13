
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

import PurchaseStats from "./components/PurchaseStats";
import PurchaseTable, { Purchase } from "./components/PurchaseTable";

import PurchaseFormModal, {
  PurchaseItemForm,
  PurchaseProduct,
  SelectOption,
} from "./components/PurchaseFormModal";

// ==========================================
// API RESPONSE HELPERS
// ==========================================

const getArray = (response: any): any[] => {
  let data = response?.data;

  if (Array.isArray(data)) return data;

  while (data && !Array.isArray(data)) {
    if (Array.isArray(data.data)) {
      return data.data;
    }

    data = data.data;
  }

  return [];
};

const getObject = (response: any): any => {
  let data = response?.data;

  while (
    data &&
    data.data &&
    !Array.isArray(data.data)
  ) {
    data = data.data;
  }

  return data ?? {};
};

type ModalMode = "edit" | "view";

// ==========================================
// PURCHASE PAGE
// ==========================================

export default function PurchasePage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("view");

  const [selectedPurchase, setSelectedPurchase] =
    useState<Purchase | null>(null);

  const [vendorId, setVendorId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState<PurchaseItemForm[]>([]);
  const [nextRowId, setNextRowId] = useState(1);

  // ==========================================
  // 1. FETCH PURCHASE LIST
  // API: purchaseList
  // ==========================================

  const fetchPurchases = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        ProjectApiList.purchaseList
      );

      setPurchases(getArray(response));

    } catch (error: any) {
      console.error("Purchase fetch error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to load purchase records."
      );
    }
  }, []);

  // ==========================================
  // 2. FETCH VENDORS AND PRODUCTS
  // API: purchaseVendors + productList
  // ==========================================

  const fetchMasters = useCallback(async () => {
    try {
      const [vendorResponse, productResponse] =
        await Promise.all([
          axiosInstance.get(ProjectApiList.purchaseVendors),
          axiosInstance.get(ProjectApiList.purchaseProducts),
        ]);

      const vendorData = getArray(vendorResponse);
      const productData = getArray(productResponse);

      // Active Vendors
      setVendors(
        vendorData.map((vendor: any) => ({
          id: Number(vendor.id),
          name: vendor.vendor_name,
        }))
      );

      // Complete Product Data
      setProducts(
        productData.map((product: any) => ({
          ...product,
          id: Number(product.id),
          product_name: product.product_name,
          sku:
            product.sku ||
            product.product_code ||
            product.unique_id ||
            "",
        }))
      );

    } catch (error: any) {
      console.error("Master fetch error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to load vendors and products."
      );
    }
  }, []);

  // ==========================================
  // LOAD PAGE DATA
  // ==========================================

  const loadPageData = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchPurchases(),
        fetchMasters(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchPurchases, fetchMasters]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  // ==========================================
  // 3. FETCH PURCHASE DETAILS
  // API: purchaseDetails(id)
  // ==========================================

  const fetchPurchaseDetails = async (id: number) => {
    const response = await axiosInstance.get(
      ProjectApiList.purchaseDetails(id)
    );

    return getObject(response);
  };

  // ==========================================
  // MAP PURCHASE ITEMS
  // ==========================================

  const mapPurchaseItems = (purchaseItems: any[]) => {
    return purchaseItems.map((item, index) => ({
      rowId: index + 1,
      product_id: String(item.product_id),
      quantity: String(item.quantity ?? 1),
      purchase_price: String(item.purchase_price ?? 0),
      mrp: String(item.mrp ?? 0),
      selling_price: String(item.selling_price ?? 0),
      discount: String(item.discount ?? 0),
      tax: String(item.tax ?? 0),
    }));
  };

  // ==========================================
  // OPEN VIEW / EDIT MODAL
  // ==========================================

  const openPurchaseModal = async (
    purchase: Purchase,
    mode: ModalMode
  ) => {
    try {
      setSaving(true);

      const details = await fetchPurchaseDetails(purchase.id);

      if (!details?.id) {
        throw new Error("Invalid purchase details response.");
      }

      setSelectedPurchase(details);
      setModalMode(mode);

      setVendorId(String(details.vendor_id ?? ""));
      setInvoiceNumber(details.invoice_number ?? "");

      setPurchaseDate(
        String(details.purchase_date ?? "").slice(0, 10)
      );

      setPaidAmount(String(details.paid_amount ?? 0));
      setDiscount(String(details.discount ?? 0));
      setTax(String(details.tax ?? 0));
      setRemarks(details.remarks ?? "");

      const purchaseItems = mapPurchaseItems(
        details.items ?? []
      );

      setItems(purchaseItems);
      setNextRowId(purchaseItems.length + 1);

      setModalOpen(true);

    } catch (error: any) {
      console.error("Purchase details error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load purchase details."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // VIEW PURCHASE
  // ==========================================

  const handleView = (purchase: Purchase) => {
    openPurchaseModal(purchase, "view");
  };

  // ==========================================
  // EDIT PURCHASE
  // ==========================================

  const handleEdit = (purchase: Purchase) => {
    openPurchaseModal(purchase, "edit");
  };

const handleUpdateItem = (
  rowId: number,
  updatedItem: Omit<PurchaseItemForm, "rowId">
) => {
  setItems((prev) =>
    prev.map((item) =>
      item.rowId === rowId
        ? {
            ...updatedItem,
            rowId,
          }
        : item
    )
  );
};

  // ==========================================
  // ADD PURCHASE ITEM
  // ==========================================

  const handleAddItem = (
    newItem: Omit<PurchaseItemForm, "rowId">
  ) => {
    const rowId = nextRowId;

    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        rowId,
      },
    ]);

    setNextRowId((prev) => prev + 1);
  };

  // ==========================================
  // REMOVE PURCHASE ITEM
  // ==========================================

  const handleRemoveItem = (rowId: number) => {
    setItems((prev) =>
      prev.filter((item) => item.rowId !== rowId)
    );
  };

  // ==========================================
  // PURCHASE CALCULATIONS
  // ==========================================

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.purchase_price || 0),
    0
  );

  const itemDiscount = items.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );

  const itemTax = items.reduce(
    (sum, item) => sum + Number(item.tax || 0),
    0
  );

  const grandTotal = Math.max(
    0,
    subtotal -
      itemDiscount -
      Number(discount || 0) +
      itemTax +
      Number(tax || 0)
  );

  const dueAmount = Math.max(
    0,
    grandTotal - Number(paidAmount || 0)
  );

  // ==========================================
  // 4. UPDATE PURCHASE
  // API: purchaseUpdate(id)
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedPurchase) return;

    if (!vendorId) {
      alert("Please select vendor.");
      return;
    }

    if (!items.length) {
      alert("Please add at least one product.");
      return;
    }

    if (Number(paidAmount || 0) > grandTotal) {
      alert("Paid amount cannot be greater than grand total.");
      return;
    }

    const payload = {
      vendor_id: Number(vendorId),
      invoice_number: invoiceNumber.trim(),
      purchase_date: purchaseDate,
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      paid_amount: Number(paidAmount || 0),
      remarks,
      status: "Received",

      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        purchase_price: Number(item.purchase_price),
        mrp: Number(item.mrp || 0),
        selling_price: Number(item.selling_price || 0),
        discount: Number(item.discount || 0),
        tax: Number(item.tax || 0),
      })),
    };

    try {
      setSaving(true);

      await axiosInstance.post(
        ProjectApiList.purchaseUpdate(selectedPurchase.id),
        payload
      );

      alert("Purchase updated successfully!");

      setModalOpen(false);
      setSelectedPurchase(null);

      await fetchPurchases();

    } catch (error: any) {
      console.error("Purchase update error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to update purchase."
      );

      if (error?.response?.data?.errors) {
        console.error(
          "Validation errors:",
          error.response.data.errors
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // 5. DELETE PURCHASE
  // API: purchaseDelete(id)
  // ==========================================

  const handleDelete = async (purchase: Purchase) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete purchase ${purchase.invoice_number}?`
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
          "Unable to delete purchase."
      );
    }
  };

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  const filteredPurchases = purchases.filter((purchase) => {
    const searchText = search.toLowerCase();

    const vendorName =
      purchase.vendor?.vendor_name ||
      purchase.vendor?.name ||
      vendors.find((v) => v.id === purchase.vendor_id)?.name ||
      "";

    const productName =
      purchase.items
        ?.map((item: any) => item.product?.product_name || "")
        .join(" ") || "";

    const matchesSearch =
      (purchase.invoice_number || "")
        .toLowerCase()
        .includes(searchText) ||
      (purchase.unique_id || "")
        .toLowerCase()
        .includes(searchText) ||
      vendorName.toLowerCase().includes(searchText) ||
      productName.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      purchase.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // PURCHASE STATISTICS
  // ==========================================

  const totalPurchases = purchases.length;

  const totalAmount = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.grand_total || 0),
    0
  );

  const totalPaid = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.paid_amount || 0),
    0
  );

  const totalDue = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.due_amount || 0),
    0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag
              size={25}
              className="text-amber-600"
            />

            <h1 className="text-2xl font-bold text-gray-900">
              Purchase Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage purchases, vendors and payments.
          </p>
        </div>

        <div className="flex gap-2">

          {/* Refresh */}
          <button
            type="button"
            onClick={loadPageData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {/* Create Purchase */}
          <button
            type="button"
            onClick={() =>
              router.push("/inventory/purchase/createPurchase")
            }
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            <Plus size={18} />
            Create Purchase
          </button>

        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <PurchaseStats
          totalPurchases={totalPurchases}
          totalAmount={totalAmount}
          totalPaid={totalPaid}
          totalDue={totalDue}
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="font-semibold text-gray-900">
            Purchase Records
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Search and manage your purchase transactions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search purchase..."
              className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 sm:w-64"
            />
          </div>

          {/* Payment Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-amber-500"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>

        </div>
      </div>

      {/* Purchase Table */}
      <PurchaseTable
        purchases={filteredPurchases}
        loading={loading}
        vendors={vendors}
        onView={handleView}
        onEdit={handleEdit}
        
        onDelete={handleDelete}
      />

      {/* Purchase View / Edit Modal */}
      <PurchaseFormModal
        mode={modalMode}
        open={modalOpen}
        saving={saving}
        vendors={vendors}
        products={products}
        vendorId={vendorId}
        invoiceNumber={invoiceNumber}
        purchaseDate={purchaseDate}
        paidAmount={paidAmount}
        discount={discount}
        tax={tax}
        remarks={remarks}
        items={items}
        subtotal={subtotal}
        grandTotal={grandTotal}
        dueAmount={dueAmount}

        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setSelectedPurchase(null);
          }
        }}

        onSubmit={handleSubmit}

        setVendorId={setVendorId}
        setInvoiceNumber={setInvoiceNumber}
        setPurchaseDate={setPurchaseDate}
        setPaidAmount={setPaidAmount}
        setDiscount={setDiscount}
        setTax={setTax}
        setRemarks={setRemarks}

        onAddItem={handleAddItem}
         onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
      />

    </div>
  );
}
