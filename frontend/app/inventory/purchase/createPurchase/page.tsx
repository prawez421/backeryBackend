
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

import PurchaseFormModal, {
  PurchaseItemForm,
  PurchaseProduct,
  SelectOption,
} from "../components/PurchaseFormModal";

// ==========================================
// API RESPONSE HELPER
// ==========================================

const getArray = (response: any): any[] => {
  let data = response?.data;

  for (let i = 0; i < 6; i++) {
    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== "object") {
      break;
    }

    data = data.data;
  }

  return [];
};

// ==========================================
// CREATE PURCHASE PAGE
// ==========================================

export default function CreatePurchasePage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  const [vendorId, setVendorId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Local date
  const getLocalDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [purchaseDate, setPurchaseDate] = useState(getLocalDate);

  const [paidAmount, setPaidAmount] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState<PurchaseItemForm[]>([]);
  const [nextRowId, setNextRowId] = useState(1);

  // ==========================================
  // 1. FETCH ACTIVE VENDORS AND PRODUCTS
  // ==========================================

  const fetchMasters = useCallback(async () => {
    try {
      setLoading(true);

      const [vendorResponse, productResponse] =
        await Promise.all([
          axiosInstance.get(ProjectApiList.purchaseVendors),
          axiosInstance.get(ProjectApiList.purchaseProducts),
        ]);

      // Extract API data
      const vendorData = getArray(vendorResponse);
      const productData = getArray(productResponse);

      console.log("Active Vendors:", vendorData);
      console.log("Products:", productData);

      // ==========================================
      // VENDOR DATA
      // ==========================================

      setVendors(
        vendorData.map((vendor: any) => ({
          id: Number(vendor.id),
          name: vendor.vendor_name || vendor.name || "",
        }))
      );

      // ==========================================
      // PRODUCT DATA
      // ==========================================

      setProducts(
        productData.map((product: any) => ({
          ...product,
          id: Number(product.id),
          product_name: product.product_name || "",
          sku:
            product.sku ||
            product.product_code ||
            product.unique_id ||
            "",
        }))
      );

    } catch (error: any) {
      console.error("Master data error:", error);
      console.error("API Error:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
          "Unable to load vendors and products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOAD MASTER DATA
  // ==========================================

  useEffect(() => {
    fetchMasters();
  }, [fetchMasters]);

  // ==========================================
  // 2. ADD PURCHASE ITEM
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
  // UPDATE PURCHASE ITEM
  // ==========================================

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
  // 3. REMOVE PURCHASE ITEM
  // ==========================================

  const handleRemoveItem = (rowId: number) => {
    setItems((prev) =>
      prev.filter((item) => item.rowId !== rowId)
    );
  };

  // ==========================================
  // 4. PURCHASE CALCULATIONS
  // ==========================================

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.purchase_price || 0),
    0
  );

  const itemDiscount = items.reduce(
    (sum, item) =>
      sum + Number(item.discount || 0),
    0
  );

  const itemTax = items.reduce(
    (sum, item) =>
      sum + Number(item.tax || 0),
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
  // 5. CREATE PURCHASE
  // API: purchaseCreate
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Vendor validation
    if (!vendorId) {
      alert("Please select vendor.");
      return;
    }

    // Invoice validation
    if (!invoiceNumber.trim()) {
      alert("Please enter invoice number.");
      return;
    }

    // Date validation
    if (!purchaseDate) {
      alert("Please select purchase date.");
      return;
    }

    // Product validation
    if (!items.length) {
      alert("Please add at least one product.");
      return;
    }

    // Item validation
    const invalidItem = items.some(
      (item) =>
        !item.product_id ||
        Number(item.quantity) <= 0 ||
        Number(item.purchase_price) < 0
    );

    if (invalidItem) {
      alert(
        "Please enter valid product, quantity and purchase price."
      );
      return;
    }

    // Paid amount validation
    if (Number(paidAmount || 0) > grandTotal) {
      alert("Paid amount cannot be greater than grand total.");
      return;
    }

    if (
      Number(paidAmount || 0) < 0 ||
      Number(discount || 0) < 0 ||
      Number(tax || 0) < 0
    ) {
      alert("Amount, discount and tax cannot be negative.");
      return;
    }

    // ==========================================
    // PURCHASE PAYLOAD
    // ==========================================

    const payload = {
      vendor_id: Number(vendorId),
      invoice_number: invoiceNumber.trim(),
      purchase_date: purchaseDate,

      discount: Number(discount || 0),
      tax: Number(tax || 0),
      paid_amount: Number(paidAmount || 0),

      remarks: remarks.trim(),
      status: "Received",

      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        purchase_price: Number(item.purchase_price),
        mrp: Number(item.mrp || 0),
        selling_price: Number(item.selling_price || 0),
        discount: Number(item.discount || 0),
        tax: Number(item.tax || 0),

        // Selected attributes
        selected_attributes: item.selected_attributes || {},
      })),
    };

    // ==========================================
    // API REQUEST
    // ==========================================

    try {
      setSaving(true);

      console.log("Purchase Payload:", payload);

      const response = await axiosInstance.post(
        ProjectApiList.purchaseCreate,
        payload
      );

      console.log("Purchase Created:", response.data);

      alert(
        response?.data?.message ||
          "Purchase created successfully!"
      );

      // Redirect to Purchase Listing
      router.push("/inventory/purchase");
      router.refresh();

    } catch (error: any) {
      console.error("Purchase create error:", error);
      console.error("API Error:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
          "Unable to create purchase."
      );

      // Laravel validation errors
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
  // UI
  // ==========================================

  return (
    <div className="w-full min-w-0 bg-slate-50">

      {loading ? (
        <div className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">

            <Loader2
              size={34}
              className="animate-spin text-amber-600"
            />

            <p className="text-sm font-medium text-slate-500">
              Loading vendors and products...
            </p>

          </div>
        </div>
      ) : (
        <PurchaseFormModal
          mode="create"
          open={true}
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
              router.push("/inventory/purchase");
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
      )}

    </div>
  );
}
